'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import WaveDecoration from '@/components/WaveDecoration';
import { SessionData, AssessmentResults } from '@/lib/types';
import { berekenResultaten } from '@/lib/scoring';
import DimensieRadarChart from '@/components/RadarChart';
import ScoreCard from '@/components/ScoreCard';
import MaturityBadge from '@/components/MaturityBadge';

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<SessionData | null>(null);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [analyse, setAnalyse] = useState<string>('');
  const [loadingAnalyse, setLoadingAnalyse] = useState(false);
  const [analyseError, setAnalyseError] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('gripData');
    if (!raw) {
      router.push('/assessment');
      return;
    }
    const parsed: SessionData = JSON.parse(raw);
    setData(parsed);
    const r = berekenResultaten(parsed.antwoorden);
    setResults(r);

    // Fetch AI analyse
    setLoadingAnalyse(true);
    fetch('/api/analyse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organisatieContext: {
          naam: parsed.organisatie.naam,
          type: parsed.organisatie.type,
          medewerkers: parsed.organisatie.medewerkers,
        },
        dimensionScores: berekenResultaten(parsed.antwoorden).dimensionScores,
        totalScore: berekenResultaten(parsed.antwoorden).totalScore,
        maturityLevel: berekenResultaten(parsed.antwoorden).maturityLevel,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setAnalyse(json.analysis ?? '');
        setLoadingAnalyse(false);
      })
      .catch(() => {
        setAnalyseError(true);
        setLoadingAnalyse(false);
      });
  }, [router]);

  if (!data || !results) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent" style={{ borderColor: '#1E3A5F', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const { dimensionScores, totalScore, maturityLevel } = results;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Golflijnen decoratie bovenaan */}
      <div className="-mx-4 -mt-8 mb-8 overflow-hidden">
        <WaveDecoration className="h-16" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1">Resultaten voor</p>
        <h1 className="text-3xl font-bold" style={{ color: '#1E3A5F' }}>
          {data.organisatie.naam}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {data.organisatie.type} · {data.organisatie.medewerkers} medewerkers
        </p>
      </div>

      {/* Sectie 1: Totaalresultaat */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
        <h2 className="font-bold text-lg mb-6" style={{ color: '#1E3A5F' }}>
          Totaalresultaat
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center md:text-left">
            <div className="text-6xl font-bold mb-2" style={{ color: '#1E3A5F' }}>
              {totalScore.toFixed(1)}
              <span className="text-2xl text-gray-400 font-normal"> / 5.0</span>
            </div>
            <MaturityBadge level={maturityLevel} size="lg" />
            <p className="text-sm text-gray-500 mt-3 max-w-xs">
              Gebaseerd op 8 vragen verdeeld over 4 dimensies.
            </p>
          </div>
          <div className="flex-1 w-full">
            <DimensieRadarChart scores={dimensionScores} />
          </div>
        </div>
      </div>

      {/* Sectie 2: Scores per dimensie */}
      <div className="mb-6">
        <h2 className="font-bold text-lg mb-4" style={{ color: '#1E3A5F' }}>
          Scores per dimensie
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['D1', 'D2', 'D3', 'D4'] as const).map((code) => (
            <ScoreCard key={code} code={code} score={dimensionScores[code]} />
          ))}
        </div>
      </div>

      {/* Sectie 3: AI-analyse */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg" style={{ color: '#1E3A5F' }}>
            AI-analyse
          </h2>
          <span className="text-xs text-gray-400">Gegenereerd door Claude (Anthropic)</span>
        </div>

        {loadingAnalyse && (
          <div className="flex items-center gap-3 py-8">
            <div
              className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent flex-shrink-0"
              style={{ borderColor: '#1E3A5F', borderTopColor: 'transparent' }}
            />
            <span className="text-gray-500">Claude analyseert uw resultaten...</span>
          </div>
        )}

        {analyseError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            De analyse kon niet worden geladen. Controleer uw API-sleutel en probeer het opnieuw.
          </div>
        )}

        {!loadingAnalyse && !analyseError && analyse && (
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h3 className="font-semibold text-gray-900 mt-5 mb-2 first:mt-0">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="text-sm text-gray-700 leading-relaxed">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900">{children}</strong>
              ),
            }}
          >
            {analyse}
          </ReactMarkdown>
        )}
      </div>

      {/* Sectie 4: CTA */}
      <div
        className="rounded-2xl p-8 text-center mb-8"
        style={{ backgroundColor: '#1E3A5F' }}
      >
        <h2 className="text-xl font-bold text-white mb-3">
          Wilt u een volledige meting met een Native Consulting adviseur?
        </h2>
        <p className="mb-6 text-sm" style={{ color: '#5BC4A0' }}>
          Onze adviseurs helpen u met een diepgaande analyse en een concreet verbeterplan.
        </p>
        <a
          href="https://www.nativeconsulting.nl/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors"
          style={{ color: '#1E3A5F' }}
        >
          Neem contact op
        </a>
      </div>

      <div className="text-center mb-8">
        <Link href="/assessment" className="text-sm text-gray-500 hover:text-gray-700 underline">
          ← Opnieuw beginnen
        </Link>
      </div>
    </div>
  );
}
