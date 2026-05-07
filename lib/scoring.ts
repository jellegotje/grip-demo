import { Antwoorden, AssessmentResults, DimensionCode, DimensionScores, MaturityLevel } from './types';
import { VRAGEN } from './questions';

export function berekenDimensieScores(antwoorden: Antwoorden): DimensionScores {
  const dimensies: DimensionCode[] = ['D1', 'D2', 'D3', 'D4'];
  const scores = {} as DimensionScores;

  for (const dim of dimensies) {
    const vragenVoorDim = VRAGEN.filter((v) => v.dimensie === dim);
    const totaal = vragenVoorDim.reduce((sum, v) => sum + (antwoorden[v.id] ?? 0), 0);
    scores[dim] = totaal / vragenVoorDim.length;
  }

  return scores;
}

export function berekenTotaalScore(dimensionScores: DimensionScores): number {
  const waarden = Object.values(dimensionScores);
  return waarden.reduce((a, b) => a + b, 0) / waarden.length;
}

export function bepaalVolwassenheidsniveau(score: number): MaturityLevel {
  if (score < 2.0) return 'Ad hoc';
  if (score < 3.0) return 'Bewust';
  if (score < 4.0) return 'Gestructureerd';
  if (score < 4.5) return 'Sturend';
  return 'Adaptief';
}

export function berekenResultaten(antwoorden: Antwoorden): AssessmentResults {
  const dimensionScores = berekenDimensieScores(antwoorden);
  const totalScore = berekenTotaalScore(dimensionScores);
  const maturityLevel = bepaalVolwassenheidsniveau(totalScore);
  return { dimensionScores, totalScore, maturityLevel };
}

export function scoreKleur(score: number): string {
  if (score >= 3.5) return 'green';
  if (score >= 2.5) return 'orange';
  return 'red';
}
