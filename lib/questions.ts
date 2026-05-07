import { Dimension, Question } from './types';

export const DIMENSIES: Dimension[] = [
  {
    code: 'D1',
    naam: 'Gegevenskwaliteit',
    beschrijving: 'Kwaliteitsnormen, meting, zichtbaarheid en verbetering van data',
  },
  {
    code: 'D2',
    naam: 'Structuur & betekenis',
    beschrijving: 'Definities, metadata, gegevenscatalogus, herkomst van data',
  },
  {
    code: 'D3',
    naam: 'Governance',
    beschrijving: 'Data-eigenaren, rollen, processen, beleid, bestuurlijke aandacht',
  },
  {
    code: 'D4',
    naam: 'Mens & cultuur',
    beschrijving: 'Bewustzijn, eigenaarschap, leren, bestuurlijke betrokkenheid',
  },
];

export const VRAGEN: Question[] = [
  {
    id: 'Q1',
    dimensie: 'D1',
    tekst: 'In hoeverre zijn kwaliteitsnormen voor gegevens vastgesteld?',
    opties: [
      { value: 1, label: 'Geen kwaliteitsnormen' },
      { value: 2, label: 'Enkele datasets hebben informele normen' },
      { value: 3, label: 'Belangrijke datasets hebben kwaliteitsnormen' },
      { value: 4, label: 'Kwaliteitsnormen worden organisatiebreed toegepast' },
      { value: 5, label: 'Normen worden continu geëvalueerd en verbeterd' },
    ],
  },
  {
    id: 'Q2',
    dimensie: 'D1',
    tekst: 'In hoeverre wordt datakwaliteit gemeten?',
    opties: [
      { value: 1, label: 'Wordt niet gemeten' },
      { value: 2, label: 'Incidentele controles' },
      { value: 3, label: 'Metingen voor belangrijke datasets' },
      { value: 4, label: 'Structurele monitoring' },
      { value: 5, label: 'Continue en grotendeels geautomatiseerde monitoring' },
    ],
  },
  {
    id: 'Q3',
    dimensie: 'D2',
    tekst: 'In hoeverre zijn gegevens eenduidig gedefinieerd?',
    opties: [
      { value: 1, label: 'Geen definities' },
      { value: 2, label: 'Lokale definities' },
      { value: 3, label: 'Belangrijke definities vastgelegd' },
      { value: 4, label: 'Centrale definities gebruikt' },
      { value: 5, label: 'Definities organisatiebreed en gestandaardiseerd' },
    ],
  },
  {
    id: 'Q4',
    dimensie: 'D2',
    tekst: 'Is er overzicht van datasets en registraties?',
    opties: [
      { value: 1, label: 'Geen overzicht' },
      { value: 2, label: 'Fragmentarisch overzicht' },
      { value: 3, label: 'Overzicht van belangrijkste datasets' },
      { value: 4, label: 'Centraal overzicht van datasets' },
      { value: 5, label: 'Volledige gegevenscatalogus' },
    ],
  },
  {
    id: 'Q5',
    dimensie: 'D3',
    tekst: 'Zijn data-eigenaren benoemd?',
    opties: [
      { value: 1, label: 'Geen eigenaren' },
      { value: 2, label: 'Enkele datasets hebben een eigenaar' },
      { value: 3, label: 'Belangrijke datasets hebben een eigenaar' },
      { value: 4, label: 'Rollen zijn vastgelegd' },
      { value: 5, label: 'Eigenaarschap wordt actief ingevuld' },
    ],
  },
  {
    id: 'Q6',
    dimensie: 'D3',
    tekst: 'Is datagovernance onderdeel van beleid?',
    opties: [
      { value: 1, label: 'Geen beleid' },
      { value: 2, label: 'In ontwikkeling' },
      { value: 3, label: 'Governance beschreven' },
      { value: 4, label: 'Actief toegepast' },
      { value: 5, label: 'Strategisch verankerd' },
    ],
  },
  {
    id: 'Q7',
    dimensie: 'D4',
    tekst: 'In hoeverre is er bewustzijn over datakwaliteit?',
    opties: [
      { value: 1, label: 'Nauwelijks bewustzijn' },
      { value: 2, label: 'Enkele medewerkers zijn bewust' },
      { value: 3, label: 'Bewustzijn is groeiend' },
      { value: 4, label: 'Breed bewustzijn' },
      { value: 5, label: 'Datakwaliteit is vanzelfsprekend' },
    ],
  },
  {
    id: 'Q8',
    dimensie: 'D4',
    tekst: 'Wordt datakwaliteit meegenomen in projecten?',
    opties: [
      { value: 1, label: 'Niet' },
      { value: 2, label: 'Soms' },
      { value: 3, label: 'Regelmatig' },
      { value: 4, label: 'Structureel' },
      { value: 5, label: 'Standaard onderdeel van elk project' },
    ],
  },
];

export const TYPE_OVERHEID_OPTIES = [
  'Gemeente',
  'Waterschap',
  'Provincie',
  'Gemeenschappelijke regeling',
  'Anders',
];

export const MEDEWERKERS_OPTIES = ['< 100', '100–500', '500–2000', '> 2000'];
