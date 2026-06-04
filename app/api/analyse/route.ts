import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { bepaalVolwassenheidsniveau } from '@/lib/scoring';

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

const VALID_TYPES = ['Gemeente', 'Waterschap', 'Provincie', 'Gemeenschappelijke regeling', 'Anders'];
const VALID_MEDEWERKERS = ['< 100', '100–500', '500–2000', '> 2000'];
const DIMENSION_KEYS = ['D1', 'D2', 'D3', 'D4'] as const;

function isValidScore(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 5;
}

function validatePayload(body: unknown): string | null {
  if (!body || typeof body !== 'object') return 'Ongeldige request body.';

  const { organisatieContext, dimensionScores, totalScore } = body as Record<string, unknown>;

  if (!organisatieContext || typeof organisatieContext !== 'object') {
    return 'organisatieContext ontbreekt of is ongeldig.';
  }
  const ctx = organisatieContext as Record<string, unknown>;
  if (typeof ctx.type !== 'string' || !VALID_TYPES.includes(ctx.type)) {
    return 'Ongeldig type overheid.';
  }
  if (typeof ctx.medewerkers !== 'string' || !VALID_MEDEWERKERS.includes(ctx.medewerkers)) {
    return 'Ongeldig aantal medewerkers.';
  }

  if (!dimensionScores || typeof dimensionScores !== 'object') {
    return 'dimensionScores ontbreekt of is ongeldig.';
  }
  const scores = dimensionScores as Record<string, unknown>;
  for (const key of DIMENSION_KEYS) {
    if (!isValidScore(scores[key])) {
      return `Ongeldige score voor ${key} (verwacht een getal tussen 1.0 en 5.0).`;
    }
  }

  if (!isValidScore(totalScore)) {
    return 'Ongeldige totalScore (verwacht een getal tussen 1.0 en 5.0).';
  }

  return null;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Te veel verzoeken. Probeer het over een uur opnieuw.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ongeldige JSON.' }, { status: 400 });
  }

  const validationError = validatePayload(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  console.log('KEY AANWEZIG:', !!process.env.ANTHROPIC_API_KEY);

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const { organisatieContext, dimensionScores, totalScore } = body as {
    organisatieContext: { type: string; medewerkers: string };
    dimensionScores: { D1: number; D2: number; D3: number; D4: number };
    totalScore: number;
  };
  const maturityLevel = bepaalVolwassenheidsniveau(totalScore);

  const prompt = `Je bent een adviseur (kern)gegevenskwaliteit voor lokale overheden in Nederland.

Een medewerker van een Nederlandse ${organisatieContext.type} met ${organisatieContext.medewerkers} medewerkers heeft een volwassenheidsmeting over (kern)gegevenskwaliteit ingevuld.

Resultaten:
- Totaalscore: ${totalScore.toFixed(1)} / 5.0 → Niveau: ${maturityLevel}
- Gegevenskwaliteit (D1): ${dimensionScores.D1.toFixed(1)}
- Structuur & betekenis (D2): ${dimensionScores.D2.toFixed(1)}
- Governance (D3): ${dimensionScores.D3.toFixed(1)}
- Mens & cultuur (D4): ${dimensionScores.D4.toFixed(1)}

Volwassenheidsniveaus: 1-1.9 = Ad hoc | 2-2.9 = Bewust | 3-3.9 = Gestructureerd | 4-4.4 = Sturend | 4.5-5 = Adaptief

Geef een analyse in de volgende structuur. Gebruik uitsluitend vetgedrukte tekst (**tekst**) voor sectietitels, geen markdown headers met #.

**Samenvatting**
2-3 zinnen over het overall beeld van de organisatie, met verwijzing naar de totaalscore en het volwassenheidsniveau.

**Gegevenskwaliteit (D1)**
Score: ${dimensionScores.D1.toFixed(1)}. Geef minimaal 3 concrete aanbevelingen die specifiek gelden voor dit volwassenheidsniveau. Wees praktisch en direct uitvoerbaar.

**Structuur & betekenis (D2)**
Score: ${dimensionScores.D2.toFixed(1)}. Geef minimaal 3 concrete aanbevelingen die specifiek gelden voor dit volwassenheidsniveau. Wees praktisch en direct uitvoerbaar.

**Governance (D3)**
Score: ${dimensionScores.D3.toFixed(1)}. Geef minimaal 3 concrete aanbevelingen die specifiek gelden voor dit volwassenheidsniveau. Wees praktisch en direct uitvoerbaar.

**Mens & cultuur (D4)**
Score: ${dimensionScores.D4.toFixed(1)}. Geef minimaal 3 concrete aanbevelingen die specifiek gelden voor dit volwassenheidsniveau. Wees praktisch en direct uitvoerbaar.

**Eerste stap**
1 concrete, morgen uitvoerbare actie voor de dimensie met de laagste score. Noem een verantwoordelijke rol en een realistisch tijdpad.

Schrijf in begrijpelijk Nederlands, zakelijk maar toegankelijk. Verwijs expliciet naar de scores. Schrijf voor een informatiemanager of CIO van een ${organisatieContext.type}.

Behandel verplicht alle vier de dimensies D1, D2, D3 en D4 elk in een aparte sectie. Sluit altijd af met een volledige sectie Eerste stap. Geef per dimensie maximaal 3 aanbevelingen van elk maximaal 60 woorden.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error('Anthropic API error:', error);
    return NextResponse.json({ error: 'Analyse niet beschikbaar' }, { status: 500 });
  }
}