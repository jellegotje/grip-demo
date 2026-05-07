# CLAUDE.md – Grip op Gegevenskwaliteit Demo
# Native Consulting – Claude Code instructies

## Doel van dit project

Bouw een publieke demo-applicatie voor de Native Consulting website die potentiële klanten
(lokale overheden) laat ervaren hoe een datakwaliteit volwassenheidsmeting werkt.

De demo toont:
1. Een korte organisatiecontext (2–3 velden)
2. Een verkorte vragenlijst (8 vragen, 2 per dimensie)
3. Automatische scoringsberekening
4. Een radar chart van de 4 dimensiescores
5. Een echte AI-analyse via de Anthropic API (Claude)

De demo heeft GEEN: login, database, roadmap, verbeterbibliotheek of beheerscherm.
Alles draait in de browser + één serverloze API route.

---

## Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Charts:** Recharts (radar chart)
- **AI:** Anthropic SDK (`@anthropic-ai/sdk`)
- **Hosting target:** Vercel
- **Taal UI:** Nederlands

---

## Projectstructuur

```
grip-demo/
├── app/
│   ├── page.tsx                  # Startpagina / intro
│   ├── assessment/
│   │   └── page.tsx              # Vragenlijst + organisatiecontext
│   ├── results/
│   │   └── page.tsx              # Scores + radar chart + AI-analyse
│   └── api/
│       └── analyse/
│           └── route.ts          # Server-side Anthropic API aanroep
├── components/
│   ├── RadarChart.tsx            # Recharts radar chart component
│   ├── ScoreCard.tsx             # Score per dimensie
│   ├── MaturityBadge.tsx         # Volwassenheidslabel badge
│   └── ProgressBar.tsx           # Voortgangsindicator vragenlijst
├── lib/
│   ├── questions.ts              # Vragenlijst data
│   ├── scoring.ts                # Scoringslogica
│   └── types.ts                  # TypeScript types
├── .env.local                    # ANTHROPIC_API_KEY (niet committen)
└── CLAUDE.md                     # Dit bestand
```

---

## Domeinkennis – LEES DIT GOED

### De 4 dimensies

Het systeem meet datakwaliteitsvolwassenheid op 4 dimensies:

| Code | Naam                    | Beschrijving |
|------|-------------------------|-------------|
| D1   | Gegevenskwaliteit       | Kwaliteitsnormen, meting, zichtbaarheid en verbetering van data |
| D2   | Structuur & betekenis   | Definities, metadata, gegevenscatalogus, herkomst van data |
| D3   | Governance              | Data-eigenaren, rollen, processen, beleid, bestuurlijke aandacht |
| D4   | Mens & cultuur          | Bewustzijn, eigenaarschap, leren, bestuurlijke betrokkenheid |

### Scoringslogica

- Elke vraag scoort 1–5 (Likert schaal)
- Dimensiescore = gemiddelde van vragen in die dimensie
- Totaalscore = gemiddelde van alle 4 dimensiescores
- Volwassenheidsniveaus:

| Score     | Niveau         |
|-----------|----------------|
| 1.0–1.9   | Ad hoc         |
| 2.0–2.9   | Bewust         |
| 3.0–3.9   | Gestructureerd |
| 4.0–4.4   | Sturend        |
| 4.5–5.0   | Adaptief       |

### Demo vragenlijst (8 vragen, 2 per dimensie)

Gebruik exact deze vragen en antwoordopties:

**D1 – Gegevenskwaliteit**

Vraag 1: "In hoeverre zijn kwaliteitsnormen voor gegevens vastgesteld?"
- 1 = Geen kwaliteitsnormen
- 2 = Enkele datasets hebben informele normen
- 3 = Belangrijke datasets hebben kwaliteitsnormen
- 4 = Kwaliteitsnormen worden organisatiebreed toegepast
- 5 = Normen worden continu geëvalueerd en verbeterd

Vraag 2: "In hoeverre wordt datakwaliteit gemeten?"
- 1 = Wordt niet gemeten
- 2 = Incidentele controles
- 3 = Metingen voor belangrijke datasets
- 4 = Structurele monitoring
- 5 = Continue en grotendeels geautomatiseerde monitoring

**D2 – Structuur & betekenis**

Vraag 3: "In hoeverre zijn gegevens eenduidig gedefinieerd?"
- 1 = Geen definities
- 2 = Lokale definities
- 3 = Belangrijke definities vastgelegd
- 4 = Centrale definities gebruikt
- 5 = Definities organisatiebreed en gestandaardiseerd

Vraag 4: "Is er overzicht van datasets en registraties?"
- 1 = Geen overzicht
- 2 = Fragmentarisch overzicht
- 3 = Overzicht van belangrijkste datasets
- 4 = Centraal overzicht van datasets
- 5 = Volledige gegevenscatalogus

**D3 – Governance**

Vraag 5: "Zijn data-eigenaren benoemd?"
- 1 = Geen eigenaren
- 2 = Enkele datasets hebben een eigenaar
- 3 = Belangrijke datasets hebben een eigenaar
- 4 = Rollen zijn vastgelegd
- 5 = Eigenaarschap wordt actief ingevuld

Vraag 6: "Is datagovernance onderdeel van beleid?"
- 1 = Geen beleid
- 2 = In ontwikkeling
- 3 = Governance beschreven
- 4 = Actief toegepast
- 5 = Strategisch verankerd

**D4 – Mens & cultuur**

Vraag 7: "In hoeverre is er bewustzijn over datakwaliteit?"
- 1 = Nauwelijks bewustzijn
- 2 = Enkele medewerkers zijn bewust
- 3 = Bewustzijn is groeiend
- 4 = Breed bewustzijn
- 5 = Datakwaliteit is vanzelfsprekend

Vraag 8: "Wordt datakwaliteit meegenomen in projecten?"
- 1 = Niet
- 2 = Soms
- 3 = Regelmatig
- 4 = Structureel
- 5 = Standaard onderdeel van elk project

### Organisatiecontext (voor en na de vragenlijst)

Verzamel vóór de vragenlijst deze 3 velden:
- `organisatienaam` (text input, verplicht)
- `type_overheid` (dropdown: Gemeente / Waterschap / Provincie / Gemeenschappelijke regeling / Anders)
- `aantal_medewerkers` (dropdown: < 100 / 100–500 / 500–2000 / > 2000)

---

## AI-analyse – implementatie

### API route: `app/api/analyse/route.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

export async function POST(req: NextRequest) {
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

Geef een analyse in deze structuur (schrijf in begrijpelijk Nederlands, zakelijk maar toegankelijk):

**Samenvatting**
[2-3 zinnen over het overall beeld]

**Sterke punten**
[2 concrete sterke punten op basis van de scores]

**Aandachtspunten**
[2-3 concrete risico's of verbeterpunten, gebaseerd op de laagste scores]

**Eerste stap**
[1 concrete, uitvoerbare aanbeveling die deze organisatie morgen kan beginnen]

Wees specifiek. Verwijs naar de scores. Schrijf voor een informatiemanager of CIO van een gemeente.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  return NextResponse.json({ analysis: text });
}
```

### UI – resultaatpagina (`app/results/page.tsx`)

Toon de AI-analyse als gestreamde of gewone tekst onder de scores.
Gebruik een loading state ("Claude analyseert uw resultaten...") terwijl de API aanroep loopt.
Parse de markdown headers (**Samenvatting**, **Sterke punten** etc.) en toon ze als gestructureerde secties.

---

## UI/UX richtlijnen

### Huisstijl Native Consulting
- Primaire kleur: gebruik `#1E3A5F` (donkerblauw) als basis – pas aan als Native Consulting andere kleuren gebruikt
- Secundaire kleur: `#00A86B` (groen) voor positieve scores / successen
- Lettertype: system font stack of Inter
- Stijl: professioneel, clean, geen speelse elementen

### Flow
```
/ (startpagina)
  ↓ [Knop: Start gratis meting]
/assessment (organisatiecontext + vragenlijst)
  ↓ [Knop: Bekijk mijn resultaten]
/results (scores + radar + AI-analyse)
  ↓ [CTA: Wil je de volledige analyse? Neem contact op]
```

### Startpagina (`/`)
- Korte intro: wat is deze tool, voor wie is het
- 3 iconen/bullets: Meting → Score → AI-advies
- Grote CTA knop "Start gratis meting"
- Subtitel: "Duurt ca. 5 minuten"

### Vragenlijstpagina (`/assessment`)
- Stap 1: organisatiecontext (apart blok bovenaan)
- Stap 2: vragenlijst, gegroepeerd per dimensie
- Progress bar bovenaan (hoeveel % ingevuld)
- Radio buttons of kaarten voor antwoordopties (niet een dropdown)
- Elke antwoordoptie toont de tekst, niet alleen een getal
- Knop onderaan disabled totdat alle vragen beantwoord zijn

### Resultaatpagina (`/results`)
Sectie 1 – Totaalresultaat
  - Grote score (bijv. "2.8 / 5.0")
  - Volwassenheidsbadge (bijv. "Bewust")
  - Radar chart (4 assen, één per dimensie)

Sectie 2 – Scores per dimensie
  - 4 kaarten, elk met: naam, score, niveau, kleurcodering
  - Groen ≥ 3.5 | Oranje 2.5–3.4 | Rood < 2.5

Sectie 3 – AI-analyse
  - Loading state met spinner
  - Gestructureerde weergave van de analyse
  - Subtekst: "Analyse gegenereerd door Claude (Anthropic)"

Sectie 4 – CTA
  - Tekst: "Wilt u een volledige meting met een Native Consulting adviseur?"
  - Knop: "Neem contact op" → link naar contactpagina Native Consulting

---

## State management

Gebruik `sessionStorage` om antwoorden en organisatiecontext door te geven van `/assessment` naar `/results`.
Geen database, geen login, geen persistentie over sessies.

Sla op in sessionStorage:
```json
{
  "organisatie": {
    "naam": "...",
    "type": "...",
    "medewerkers": "..."
  },
  "antwoorden": {
    "Q1": 3,
    "Q2": 2,
    "Q3": 4,
    "Q4": 2,
    "Q5": 1,
    "Q6": 2,
    "Q7": 3,
    "Q8": 2
  }
}
```

---

## Omgevingsvariabelen

Maak `.env.local` aan met:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Voeg `.env.local` toe aan `.gitignore`. Nooit committen.

---

## Deployment op Vercel

1. `git init && git add . && git commit -m "initial"`
2. Push naar GitHub
3. Importeer repo in Vercel
4. Voeg environment variable toe: `ANTHROPIC_API_KEY`
5. Deploy → Vercel geeft een URL die je op de Native Consulting website kunt embedden of linken

---

## Wat de demo NIET bevat (bewust weggelaten)

- Geen login of authenticatie
- Geen database
- Geen roadmapgenerator
- Geen verbeterbibliotheek
- Geen PDF-export
- Geen multi-tenant organisatiebeheer
- Geen beheerscherm

Dit is een lead generation demo. Het doel is interesse wekken, niet het volledige product tonen.

---

## Instructies voor Claude Code

Start met:
```
claude
```

Eerste prompt die je geeft in Claude Code:
> "Lees CLAUDE.md en bouw de applicatie stap voor stap. Begin met de projectstructuur en de lib/ bestanden, dan de componenten, dan de pagina's, en tot slot de API route."

Als Claude Code om bevestiging vraagt over keuzes: verwijs terug naar dit document.
Als iets niet duidelijk is: kies de eenvoudigste werkende oplossing die past bij de demo-scope.

---

*Document versie: 1.0 | Project: Grip op Gegevenskwaliteit Demo | Opdrachtgever: Native Consulting*
