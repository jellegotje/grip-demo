import Link from 'next/link';
import WaveDecoration from '@/components/WaveDecoration';
import DimensieRadarChart from '@/components/RadarChart';

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center py-12">
        <span
          className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-6"
          style={{ backgroundColor: '#EBF8F4', color: '#5BC4A0' }}
        >
          Gratis demo
        </span>
        <h1 className="text-4xl font-bold mb-4 break-words hyphens-auto" style={{ color: '#1E3A5F' }}>
          Hoe volwassen is uw (kern)gegevens&shy;kwaliteit?
        </h1>
        <p className="text-xl text-gray-600 mb-4 leading-relaxed">
          Beantwoord 9 vragen en ontdek direct hoe volwassen uw organisatie is op
          (kern)gegevens&shy;kwaliteit, structuur, governance en cultuur. U ontvangt een persoonlijke
          analyse met uw score, sterke punten en concrete verbeterstappen.
        </p>
        <p className="text-base text-gray-500 mb-8 leading-relaxed">
          Ontwikkeld voor gemeenten, provincies, waterschappen en samenwerkingsverbanden die willen
          weten waar ze staan in hun (kern)gegevens&shy;kwaliteit.
        </p>

        {/* Voorbeeldresultaat radar chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-10 shadow-sm max-w-[300px] mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#5BC4A0' }}>
            Voorbeeldresultaat
          </div>
          <DimensieRadarChart
            scores={{ D1: 2.5, D2: 3.5, D3: 2.0, D4: 3.0 }}
            height={200}
            outerRadius={55}
          />
        </div>

        <Link
          href="/assessment"
          className="btn-primary inline-block text-white font-semibold px-8 py-4 rounded-xl text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A5F]"
        >
          Start gratis meting
        </Link>
        <p className="text-sm text-gray-700 mt-3">
          Duurt ca. 5 minuten, geen registratie vereist, direct resultaat.
        </p>
        <p className="text-xs text-gray-400 mt-4 max-w-md mx-auto leading-relaxed">
          Uw antwoorden worden anoniem verwerkt. Alleen uw organisatietype, organisatiegrootte en
          scores worden gebruikt voor de analyse. Gegevens worden niet opgeslagen en niet gebruikt
          voor het trainen van AI-modellen.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <StepCard
          step="1"
          icon="📋"
          title="Meting"
          description="Beantwoord 9 gerichte vragen over 4 dimensies van (kern)gegevens&shy;kwaliteits&shy;volwassenheid."
        />
        <StepCard
          step="2"
          icon="📊"
          title="Score"
          description="Zie direct uw score per dimensie in een radar chart en uw volwassenheidsniveau."
        />
        <StepCard
          step="3"
          icon="🤖"
          title="Persoonlijk advies"
          description="Ontvang een korte analyse met sterke punten, aandachtspunten en concrete vervolgstappen."
        />
      </div>

      {/* Dimensions info */}
      <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold mb-6" style={{ color: '#1E3A5F' }}>
          Wat meten we?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DimensionInfo
            code="D1"
            naam="Gegevenskwaliteit"
            beschrijving="Kwaliteitsnormen, meting en zichtbaarheid"
          />
          <DimensionInfo
            code="D2"
            naam="Structuur & betekenis"
            beschrijving="Definities, metadata en (kern)gegevenscatalogus"
          />
          <DimensionInfo
            code="D3"
            naam="Governance"
            beschrijving="(Kern)gegevens-eigenaren, rollen en beleid"
          />
          <DimensionInfo
            code="D4"
            naam="Mens & cultuur"
            beschrijving="Bewustzijn, eigenaarschap en betrokkenheid"
          />
        </div>
      </div>

      {/* CTA bottom */}
      <div className="text-center mt-10 mb-4">
        <Link
          href="/assessment"
          className="btn-primary inline-block text-white font-semibold px-8 py-4 rounded-xl text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A5F]"
        >
          Start gratis meting
        </Link>
      </div>

      {/* Golflijnen decoratie */}
      <div className="mt-16 -mx-4 overflow-hidden">
        <WaveDecoration className="h-20" />
      </div>
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#5BC4A0' }}>
        Stap {step}
      </div>
      <h3 className="font-bold text-lg mb-2" style={{ color: '#1E3A5F' }}>
        {title}
      </h3>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  );
}

function DimensionInfo({
  code,
  naam,
  beschrijving,
}: {
  code: string;
  naam: string;
  beschrijving: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: '#1E3A5F' }}
      >
        {code}
      </span>
      <div>
        <div className="font-semibold text-gray-900 text-sm">{naam}</div>
        <div className="text-sm text-gray-700">{beschrijving}</div>
      </div>
    </div>
  );
}
