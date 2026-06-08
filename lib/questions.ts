import { Dimension, Question } from './types';

export const DIMENSIES: Dimension[] = [
  {
    code: 'D1',
    naam: 'Gegevenskwaliteit',
    beschrijving: 'Kwaliteitsnormen, meting, zichtbaarheid en verbetering van gegevens',
  },
  {
    code: 'D2',
    naam: 'Structuur & betekenis',
    beschrijving: 'Definities, metadata, gegevenscatalogus, herkomst van gegevens',
  },
  {
    code: 'D3',
    naam: 'Governance',
    beschrijving: 'Gegevens-eigenaren, rollen, processen, beleid, bestuurlijke aandacht',
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
      { value: 1, label: 'Geen kwaliteitsnormen aanwezig' },
      { value: 2, label: 'Informele normen bij enkele datasets' },
      { value: 3, label: 'Normen voor belangrijke datasets' },
      { value: 4, label: 'Normen organisatiebreed toegepast' },
      { value: 5, label: 'Normen continu geëvalueerd en verbeterd' },
    ],
  },
  {
    id: 'Q2',
    dimensie: 'D1',
    tekst: 'In hoeverre heeft uw organisatie structureel inzicht in de kwaliteit van gegevens?',
    opties: [
      { value: 1, label: 'Geen inzicht in datakwaliteit' },
      { value: 2, label: 'Incidenteel inzicht bij enkele datasets' },
      { value: 3, label: 'Periodiek inzicht voor kerngegevens' },
      { value: 4, label: 'Structurele monitoring aanwezig' },
      { value: 5, label: 'Continue geautomatiseerde monitoring' },
    ],
  },
  {
    id: 'Q3',
    dimensie: 'D1',
    tekst: 'In hoeverre worden datakwaliteitsproblemen structureel opgevolgd?',
    opties: [
      { value: 1, label: 'Problemen worden niet opgevolgd' },
      { value: 2, label: 'Opvolging ad hoc en incidenteel' },
      { value: 3, label: 'Bekende problemen worden opgevolgd' },
      { value: 4, label: 'Structureel opvolgingsproces aanwezig' },
      { value: 5, label: 'Proactief gesignaleerd en opgelost' },
    ],
  },
  {
    id: 'Q4',
    dimensie: 'D2',
    tekst: 'In hoeverre zijn gegevens eenduidig gedefinieerd?',
    opties: [
      { value: 1, label: 'Geen definities aanwezig' },
      { value: 2, label: 'Lokale definities per afdeling' },
      { value: 3, label: 'Belangrijke definities vastgelegd' },
      { value: 4, label: 'Centrale definities in gebruik' },
      { value: 5, label: 'Definities organisatiebreed gestandaardiseerd' },
    ],
  },
  {
    id: 'Q5',
    dimensie: 'D2',
    tekst: 'Is er overzicht van gegevens en registraties?',
    opties: [
      { value: 1, label: 'Geen overzicht aanwezig' },
      { value: 2, label: 'Fragmentarisch overzicht beschikbaar' },
      { value: 3, label: 'Overzicht van kerngegevens aanwezig' },
      { value: 4, label: 'Centraal overzicht beschikbaar' },
      { value: 5, label: 'Volledige gegevenscatalogus actief' },
    ],
  },
  {
    id: 'Q6',
    dimensie: 'D3',
    tekst: 'In hoeverre zijn rollen en verantwoordelijkheden voor datakwaliteit duidelijk belegd?',
    opties: [
      { value: 1, label: 'Geen rollen belegd' },
      { value: 2, label: 'Informeel enkele verantwoordelijken' },
      { value: 3, label: 'Rollen voor kerngegevens beschreven' },
      { value: 4, label: 'Rollen formeel vastgelegd' },
      { value: 5, label: 'Eigenaarschap actief en organisatiebreed' },
    ],
  },
  {
    id: 'Q7',
    dimensie: 'D3',
    tekst: 'Is governance van gegevens onderdeel van beleid?',
    opties: [
      { value: 1, label: 'Geen beleid aanwezig' },
      { value: 2, label: 'Beleid in ontwikkeling' },
      { value: 3, label: 'Governance beschreven in beleid' },
      { value: 4, label: 'Beleid actief toegepast' },
      { value: 5, label: 'Governance strategisch verankerd' },
    ],
  },
  {
    id: 'Q8',
    dimensie: 'D4',
    tekst: 'In hoeverre is er bewustzijn over datakwaliteit?',
    opties: [
      { value: 1, label: 'Nauwelijks bewustzijn aanwezig' },
      { value: 2, label: 'Bewustzijn bij enkele medewerkers' },
      { value: 3, label: 'Groeiend bewustzijn in organisatie' },
      { value: 4, label: 'Breed bewustzijn aanwezig' },
      { value: 5, label: 'Datakwaliteit vanzelfsprekend geborgd' },
    ],
  },
  {
    id: 'Q9',
    dimensie: 'D4',
    tekst: 'In hoeverre werken afdelingen samen om de kwaliteit van gegevens te verbeteren?',
    opties: [
      { value: 1, label: 'Geen samenwerking aanwezig' },
      { value: 2, label: 'Incidentele afstemming tussen afdelingen' },
      { value: 3, label: 'Regelmatige samenwerking bij kerngegevens' },
      { value: 4, label: 'Samenwerking structureel georganiseerd' },
      { value: 5, label: 'Afdelingsoverstijgende samenwerking vanzelfsprekend' },
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
