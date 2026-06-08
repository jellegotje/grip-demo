'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import WaveDecoration from '@/components/WaveDecoration';
import { SessionData, AssessmentResults } from '@/lib/types';
import { berekenResultaten } from '@/lib/scoring';
import { exporteerAnalysePdf } from '@/lib/pdf';
import DimensieRadarChart from '@/components/RadarChart';
import ScoreCard from '@/components/ScoreCard';
import MaturityBadge from '@/components/MaturityBadge';

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<SessionData | null>(null);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [analyse, setAnalyse] = useState<string>('');
  const [loadingAnalyse, setLoadingAnalyse] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [analyseError, setAnalyseError] = useState(false);
  const [exporteren, setExporteren] = useState(false);
  const hasFetched = useRef(false);

  async function handleExportPdf() {
    if (!data || !results || !analyse) return;
    setExporteren(true);
    try {
      await exporteerAnalysePdf({
        organisatie: data.organisatie,
        results,
        analyse,
      });
    } catch (err) {
      console.error('PDF-export mislukt:', err);
    } finally {
      setExporteren(false);
    }
  }

  useEffect(() => {
    // Guard tegen dubbele aanroep door React Strict Mode (dev) en re-renders.
    // Zonder deze guard lopen er twee fetches tegelijk en wordt de tekst
    // dubbel/gemixt in de state geschreven.
    if (hasFetched.current) return;
    hasFetched.current = true;

    const raw = sessionStorage.getItem('gripData');
    if (!raw) {
      router.push('/assessment');
      return;
    }
    const parsed: SessionData = JSON.parse(raw);
    setData(parsed);
    const r = berekenResultaten(parsed.antwoorden);
    setResults(r);

    setLoadingAnalyse(true);
    setAnalyse('');
    setAnalyseError(false);

    const controller = new AbortController();

    fetch('/api/analyse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        organisatieContext: {
          naam: parsed.organisatie.naam,
          type: parsed.organisatie.type,
          medewerkers: parsed.organisatie.medewerkers,
        },
        dimensionScores: r.dimensionScores,
        totalScore: r.totalScore,
        maturityLevel: r.maturityLevel,
      }),
    })
      .then(async (res) => {
        if (!res.ok || !res.body) {
          throw new Error('Analyse niet beschikbaar');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let receivedAny = false;

        try {
          // Eén reader, één lus. We stoppen zodra done === true.
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            if (!chunk) continue;

            if (!receivedAny) {
              receivedAny = true;
              setLoadingAnalyse(false);
              setStreaming(true);
            }
            setAnalyse((prev) => prev + chunk);
          }
        } finally {
          // Sluit de stream netjes af, ook bij vroegtijdig afbreken.
          reader.releaseLock();
        }

        setStreaming(false);
        setLoadingAnalyse(false);
      })
      .catch(() => {
        // Een afgebroken fetch (unmount) is geen echte fout.
        if (controller.signal.aborted) return;
        setAnalyseError(true);
        setStreaming(false);
        setLoadingAnalyse(false);
      });

    // Cleanup: breek de in-flight stream af bij unmount.
    // We resetten de guard zodat de "echte" mount (na Strict Mode's
    // mount → cleanup → mount cyclus) opnieuw mag fetchen; de afgebroken
    // eerste fetch schrijft niets meer naar de state, dus geen dubbeling.
    return () => {
      controller.abort();
      hasFetched.current = false;
    };
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
              Gebaseerd op 9 vragen verdeeld over 4 dimensies.
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

      {/* Sectie 3: Analyse */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg" style={{ color: '#1E3A5F' }}>
            Analyse
          </h2>
        </div>

        {loadingAnalyse && (
          <div className="flex items-center gap-3 py-8" role="status" aria-live="polite">
            <div
              className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent flex-shrink-0"
              style={{ borderColor: '#1E3A5F', borderTopColor: 'transparent' }}
              aria-hidden="true"
            />
            <span className="text-gray-700">Uw resultaten worden geanalyseerd...</span>
          </div>
        )}

        {analyseError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700" role="alert">
            De analyse kon niet worden geladen. Controleer uw API-sleutel en probeer het opnieuw.
          </div>
        )}

        {!loadingAnalyse && !analyseError && analyse && (
          <div aria-live="polite">
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
          {streaming && (
            <span
              className="inline-block w-[2px] h-4 ml-0.5 align-text-bottom animate-pulse"
              style={{ backgroundColor: '#1E3A5F' }}
              aria-hidden="true"
            />
          )}
          </div>
        )}

        {!loadingAnalyse && !streaming && !analyseError && analyse && (
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={exporteren}
              className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl border-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A5F]"
              style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
            >
              {exporteren ? (
                <>
                  <span
                    className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"
                    style={{ borderColor: '#1E3A5F', borderTopColor: 'transparent' }}
                    aria-hidden="true"
                  />
                  PDF wordt gemaakt...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M10 1a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 10.586V2a1 1 0 0 1 1-1Z" />
                    <path d="M3 14a1 1 0 0 1 1 1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1a1 1 0 1 1 2 0v1a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-1a1 1 0 0 1 1-1Z" />
                  </svg>
                  Download analyse als PDF
                </>
              )}
            </button>
          </div>
        )}

        {!loadingAnalyse && !analyseError && analyse && (
          <p className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
            Deze analyse kan fouten bevatten. Voor een uitgebreidere meting kunt u contact opnemen met Native Consulting.
          </p>
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
          href="https://www.nativeconsulting.nl/neem-contact-met-ons-op/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          style={{ color: '#1E3A5F' }}
        >
          Neem contact op
        </a>
      </div>

      <div className="text-center mb-8">
        <Link href="/assessment" className="text-sm text-gray-700 hover:text-gray-900 underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A5F] rounded">
          ← Opnieuw beginnen
        </Link>
      </div>
    </div>
  );
}
