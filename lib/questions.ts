import { Dimension, Question } from './types';

export const DIMENSIES: Dimension[] = [
  {
    code: 'D1',
    naam: 'Gegevenskwaliteit',
    beschrijving: 'Kwaliteitsnormen, meting, zichtbaarheid en verbetering van (kern)gegevens',
  },
  {
    code: 'D2',
    naam: 'Structuur & betekenis',
    beschrijving: 'Definities, metadata, (kern)gegevenscatalogus, herkomst van (kern)gegevens',
  },
  {
    code: 'D3',
    naam: 'Governance',
    beschrijving: '(Kern)gegevens-eigenaren, rollen, processen, beleid, bestuurlijke aandacht',
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
    tekst: 'In hoeverre zijn kwaliteitsnormen voor (kern)gegevens vastgesteld?',
    opties: [
      { value: 1, label: 'Geen kwaliteitsnormen' },
      { value: 2, label: 'Enkele (kern)gegevens hebben informele normen' },
      { value: 3, label: 'Belangrijke (kern)gegevens hebben kwaliteitsnormen' },
      { value: 4, label: 'Kwaliteitsnormen worden organisatiebreed toegepast' },
      { value: 5, label: 'Normen worden continu geëvalueerd en verbeterd' },
    ],
  },
  {
    id: 'Q2',
    dimensie: 'D1',
    tekst: 'In hoeverre heeft uw organisatie structureel inzicht in de kwaliteit van (kern)gegevens?',
    opties: [
      { value: 1, label: 'Er is geen inzicht in de kwaliteit van (kern)gegevens' },
      { value: 2, label: 'Incidenteel wordt gekeken naar kwaliteit van enkele (kern)gegevens' },
      { value: 3, label: 'Voor de belangrijkste (kern)gegevens is er periodiek inzicht in de kwaliteit' },
      { value: 4, label: 'Kwaliteit van (kern)gegevens wordt structureel gemonitord' },
      { value: 5, label: 'Er is continue en grotendeels geautomatiseerde monitoring van (kern)gegevenskwaliteit' },
    ],
  },
  {
    id: 'Q3',
    dimensie: 'D1',
    tekst: 'In hoeverre worden (kern)gegevenskwaliteitsproblemen structureel opgevolgd?',
    opties: [
      { value: 1, label: 'Problemen worden niet opgevolgd' },
      { value: 2, label: 'Problemen worden incidenteel en ad hoc opgepakt' },
      { value: 3, label: 'Bekende problemen bij belangrijke (kern)gegevens worden opgevolgd' },
      { value: 4, label: 'Er is een structureel proces voor opvolging van kwaliteitsproblemen' },
      { value: 5, label: 'Kwaliteitsproblemen worden proactief gesignaleerd en structureel opgelost' },
    ],
  },
  {
    id: 'Q4',
    dimensie: 'D2',
    tekst: 'In hoeverre zijn (kern)gegevens eenduidig gedefinieerd?',
    opties: [
      { value: 1, label: 'Geen definities' },
      { value: 2, label: 'Lokale definities' },
      { value: 3, label: 'Belangrijke definities vastgelegd' },
      { value: 4, label: 'Centrale definities gebruikt' },
      { value: 5, label: 'Definities organisatiebreed en gestandaardiseerd' },
    ],
  },
  {
    id: 'Q5',
    dimensie: 'D2',
    tekst: 'Is er overzicht van (kern)gegevens en registraties?',
    opties: [
      { value: 1, label: 'Geen overzicht' },
      { value: 2, label: 'Fragmentarisch overzicht' },
      { value: 3, label: 'Overzicht van belangrijkste (kern)gegevens' },
      { value: 4, label: 'Centraal overzicht van (kern)gegevens' },
      { value: 5, label: 'Volledige (kern)gegevenscatalogus' },
    ],
  },
  {
    id: 'Q6',
    dimensie: 'D3',
    tekst: 'In hoeverre zijn rollen en verantwoordelijkheden voor (kern)gegevenskwaliteit duidelijk belegd?',
    opties: [
      { value: 1, label: 'Er zijn geen rollen of verantwoordelijkheden belegd' },
      { value: 2, label: 'Bij enkele (kern)gegevens is er informeel een verantwoordelijke' },
      { value: 3, label: 'Voor de belangrijkste (kern)gegevens zijn verantwoordelijkheden beschreven' },
      { value: 4, label: 'Rollen en verantwoordelijkheden zijn formeel vastgelegd, inclusief data-eigenaren' },
      { value: 5, label: 'Eigenaarschap wordt actief ingevuld en verantwoordelijkheden zijn organisatiebreed geborgd' },
    ],
  },
  {
    id: 'Q7',
    dimensie: 'D3',
    tekst: 'Is governance van (kern)gegevens onderdeel van beleid?',
    opties: [
      { value: 1, label: 'Geen beleid' },
      { value: 2, label: 'In ontwikkeling' },
      { value: 3, label: 'Governance beschreven' },
      { value: 4, label: 'Actief toegepast' },
      { value: 5, label: 'Strategisch verankerd' },
    ],
  },
  {
    id: 'Q8',
    dimensie: 'D4',
    tekst: 'In hoeverre is er bewustzijn over (kern)gegevenskwaliteit?',
    opties: [
      { value: 1, label: 'Nauwelijks bewustzijn' },
      { value: 2, label: 'Enkele medewerkers zijn bewust' },
      { value: 3, label: 'Bewustzijn is groeiend' },
      { value: 4, label: 'Breed bewustzijn' },
      { value: 5, label: '(Kern)gegevenskwaliteit is vanzelfsprekend' },
    ],
  },
  {
    id: 'Q9',
    dimensie: 'D4',
    tekst: 'In hoeverre werken afdelingen samen om de kwaliteit van (kern)gegevens te verbeteren?',
    opties: [
      { value: 1, label: 'Afdelingen werken niet samen op het gebied van (kern)gegevenskwaliteit' },
      { value: 2, label: 'Incidenteel is er afstemming tussen afdelingen over (kern)gegevens' },
      { value: 3, label: 'Bij specifieke (kern)gegevens wordt regelmatig samengewerkt tussen afdelingen' },
      { value: 4, label: 'Samenwerking rond (kern)gegevenskwaliteit is structureel georganiseerd' },
      { value: 5, label: 'Afdelingsoverstijgende samenwerking op (kern)gegevenskwaliteit is vanzelfsprekend en continu' },
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
