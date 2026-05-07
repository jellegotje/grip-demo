export type DimensionCode = 'D1' | 'D2' | 'D3' | 'D4';

export type MaturityLevel =
  | 'Ad hoc'
  | 'Bewust'
  | 'Gestructureerd'
  | 'Sturend'
  | 'Adaptief';

export interface Dimension {
  code: DimensionCode;
  naam: string;
  beschrijving: string;
}

export interface AnswerOption {
  value: number;
  label: string;
}

export interface Question {
  id: string;
  dimensie: DimensionCode;
  tekst: string;
  opties: AnswerOption[];
}

export interface OrganisatieContext {
  naam: string;
  type: string;
  medewerkers: string;
}

export interface Antwoorden {
  [questionId: string]: number;
}

export interface SessionData {
  organisatie: OrganisatieContext;
  antwoorden: Antwoorden;
}

export interface DimensionScores {
  D1: number;
  D2: number;
  D3: number;
  D4: number;
}

export interface AssessmentResults {
  dimensionScores: DimensionScores;
  totalScore: number;
  maturityLevel: MaturityLevel;
}
