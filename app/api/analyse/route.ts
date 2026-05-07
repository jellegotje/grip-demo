import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('KEY AANWEZIG:', !!process.env.ANTHROPIC_API_KEY);

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const { organisatieContext, dimensionScores, totalScore, maturityLevel } = await req.json();

  const prompt = `Je bent een adviseur gegevenskwaliteit voor lokale overheden in Nederland.

Een medewerker van ${organisatieContext.naam} (${organisatieContext.type}, ${organisatieContext.medewerkers} medewerkers) heeft een korte volwassenheidsmeting ingevuld.

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

Schrijf in begrijpelijk Nederlands, zakelijk maar toegankelijk. Verwijs expliciet naar de scores. Schrijf voor een informatiemanager of CIO van een ${organisatieContext.type}.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error('Anthropic API error:', error);
    return NextResponse.json({ error: 'Analyse niet beschikbaar' }, { status: 500 });
  }
}