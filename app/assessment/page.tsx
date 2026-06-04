'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import { VRAGEN, DIMENSIES, TYPE_OVERHEID_OPTIES, MEDEWERKERS_OPTIES } from '@/lib/questions';
import { Antwoorden, OrganisatieContext } from '@/lib/types';

export default function AssessmentPage() {
  const router = useRouter();

  const [organisatie, setOrganisatie] = useState<OrganisatieContext>({
    naam: '',
    type: '',
    medewerkers: '',
  });

  const [antwoorden, setAntwoorden] = useState<Antwoorden>({});

  const [definitieOpen, setDefinitieOpen] = useState(false);

  const beantwoord = Object.keys(antwoorden).length;
  const alleFeldenIngevuld =
    organisatie.naam.trim() !== '' &&
    organisatie.type !== '' &&
    organisatie.medewerkers !== '';
  const alleVragenBeantwoord = beantwoord === VRAGEN.length;
  const kanDoorgaan = alleFeldenIngevuld && alleVragenBeantwoord;

  function handleSubmit() {
    if (!kanDoorgaan) return;
    sessionStorage.setItem('gripData', JSON.stringify({ organisatie, antwoorden }));
    router.push('/results');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1E3A5F' }}>
          (Kern)gegevenskwaliteitsmeting
        </h1>
        <p className="text-gray-700">
          Vul uw organisatiegegevens in en beantwoord de 9 vragen om uw volwassenheidsscore te
          ontvangen.
        </p>
      </div>

      {/* Definitiebox */}
      <div
        className="rounded-2xl border p-5 mb-8 flex gap-3"
        style={{ backgroundColor: '#EFF4F9', borderColor: '#1E3A5F' }}
      >
        <span className="text-xl flex-shrink-0" aria-hidden="true">
          ℹ️
        </span>
        <div className="flex-1">
          <h2 className="font-bold text-base" style={{ color: '#1E3A5F' }}>
            Wat zijn (kern)gegevens?
          </h2>
          {definitieOpen && (
            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
              Kerngegevens van een gemeente zijn de belangrijkste, objectieve gegevens en feiten over
              een specifieke gemeente. Ze vormen een overzicht van de demografische, sociale en
              geografische status van het gebied en worden gebruikt voor beleidsvorming, onderzoek en
              informatievoorziening aan inwoners. Denk hierbij aan cijfers over aantallen inwoners,
              demografische gegevens, wijkindelingen, cijfers over ingezette zorg, arbeidsmarktgegevens,
              woningvoorraad, woningtypes etc.
            </p>
          )}
          <button
            type="button"
            onClick={() => setDefinitieOpen((v) => !v)}
            aria-expanded={definitieOpen}
            className="text-sm font-medium underline mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
            style={{ color: '#1E3A5F', '--tw-ring-color': '#1E3A5F' } as React.CSSProperties}
          >
            {definitieOpen ? 'Minder informatie' : 'Meer informatie'}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <ProgressBar current={beantwoord} total={VRAGEN.length} />
      </div>

      {/* Organisatiecontext */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="font-bold text-lg mb-4" style={{ color: '#1E3A5F' }}>
          Uw organisatie
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="org-naam" className="block text-sm font-medium text-gray-700 mb-1">
              Naam organisatie <span className="text-red-500" aria-hidden="true">*</span>
              <span className="sr-only">(verplicht)</span>
            </label>
            <input
              id="org-naam"
              type="text"
              value={organisatie.naam}
              onChange={(e) => setOrganisatie({ ...organisatie, naam: e.target.value })}
              placeholder="bijv. Gemeente Voorbeeldstad"
              autoComplete="organization"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#1E3A5F' } as React.CSSProperties}
            />
          </div>
          <div>
            <label htmlFor="org-type" className="block text-sm font-medium text-gray-700 mb-1">
              Type overheid <span className="text-red-500" aria-hidden="true">*</span>
              <span className="sr-only">(verplicht)</span>
            </label>
            <select
              id="org-type"
              value={organisatie.type}
              onChange={(e) => setOrganisatie({ ...organisatie, type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-transparent bg-white"
              style={{ '--tw-ring-color': '#1E3A5F' } as React.CSSProperties}
            >
              <option value="">Selecteer type</option>
              {TYPE_OVERHEID_OPTIES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="org-medewerkers" className="block text-sm font-medium text-gray-700 mb-1">
              Aantal medewerkers <span className="text-red-500" aria-hidden="true">*</span>
              <span className="sr-only">(verplicht)</span>
            </label>
            <select
              id="org-medewerkers"
              value={organisatie.medewerkers}
              onChange={(e) => setOrganisatie({ ...organisatie, medewerkers: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-transparent bg-white"
              style={{ '--tw-ring-color': '#1E3A5F' } as React.CSSProperties}
            >
              <option value="">Selecteer grootte</option>
              {MEDEWERKERS_OPTIES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vragenlijst per dimensie */}
      {DIMENSIES.map((dim) => {
        const vragenVoorDim = VRAGEN.filter((v) => v.dimensie === dim.code);
        return (
          <div key={dim.code} className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: '#1E3A5F' }}
                aria-hidden="true"
              >
                {dim.code}
              </span>
              <div>
                <h2 className="font-bold text-base text-gray-900">{dim.naam}</h2>
                <p className="text-xs text-gray-700">{dim.beschrijving}</p>
              </div>
            </div>

            <div className="space-y-6">
              {vragenVoorDim.map((vraag) => (
                <fieldset key={vraag.id}>
                  <legend className="font-medium text-gray-800 mb-3 text-sm">{vraag.tekst}</legend>
                  <div className="space-y-2">
                    {vraag.opties.map((optie) => {
                      const inputId = `${vraag.id}-${optie.value}`;
                      const geselecteerd = antwoorden[vraag.id] === optie.value;
                      return (
                        <label
                          key={optie.value}
                          htmlFor={inputId}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            geselecteerd
                              ? 'border-blue-900 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            id={inputId}
                            type="radio"
                            name={vraag.id}
                            value={optie.value}
                            checked={geselecteerd}
                            onChange={() =>
                              setAntwoorden({ ...antwoorden, [vraag.id]: optie.value })
                            }
                            className="sr-only focus:not-sr-only focus:w-4 focus:h-4 focus:ring-2 focus:ring-offset-2"
                            style={{ '--tw-ring-color': '#1E3A5F' } as React.CSSProperties}
                          />
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              geselecteerd ? 'border-blue-900' : 'border-gray-300'
                            }`}
                            aria-hidden="true"
                          >
                            {geselecteerd && (
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: '#1E3A5F' }}
                              />
                            )}
                          </span>
                          <span className="text-xs text-gray-600 font-medium w-4 flex-shrink-0" aria-hidden="true">
                            {optie.value}
                          </span>
                          <span className="text-sm text-gray-700">{optie.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>
        );
      })}

      {/* Submit */}
      <div className="mt-6 mb-12">
        {!kanDoorgaan && (
          <p className="text-sm text-gray-700 text-center mb-3" role="status" aria-live="polite">
            {!alleFeldenIngevuld
              ? 'Vul eerst uw organisatiegegevens in.'
              : `Beantwoord nog ${VRAGEN.length - beantwoord} ${
                  VRAGEN.length - beantwoord === 1 ? 'vraag' : 'vragen'
                } om door te gaan.`}
          </p>
        )}
        <button
          onClick={handleSubmit}
          disabled={!kanDoorgaan}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            kanDoorgaan
              ? 'text-white shadow-md cursor-pointer hover:opacity-90'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          style={
            kanDoorgaan
              ? ({ backgroundColor: '#1E3A5F', '--tw-ring-color': '#1E3A5F' } as React.CSSProperties)
              : {}
          }
          aria-disabled={!kanDoorgaan}
        >
          Bekijk mijn resultaten →
        </button>
      </div>
    </div>
  );
}
