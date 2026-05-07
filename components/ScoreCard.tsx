'use client';

import { DimensionCode, MaturityLevel } from '@/lib/types';
import { bepaalVolwassenheidsniveau } from '@/lib/scoring';
import MaturityBadge from './MaturityBadge';
import { DIMENSIES } from '@/lib/questions';

interface ScoreCardProps {
  code: DimensionCode;
  score: number;
}

export default function ScoreCard({ code, score }: ScoreCardProps) {
  const dimensie = DIMENSIES.find((d) => d.code === code)!;
  const level: MaturityLevel = bepaalVolwassenheidsniveau(score);

  let borderColor: string;
  let scoreColor: string;
  if (score >= 3.5) {
    borderColor = '#5BC4A0';
    scoreColor = '#5BC4A0';
  } else if (score >= 2.5) {
    borderColor = '#F59E0B';
    scoreColor = '#D97706';
  } else {
    borderColor = '#F87171';
    scoreColor = '#DC2626';
  }

  return (
    <div
      className="bg-white rounded-xl border-2 p-5 shadow-sm"
      style={{ borderColor }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {code}
          </span>
          <h3 className="font-semibold text-gray-900 mt-0.5">{dimensie.naam}</h3>
        </div>
        <span className="text-2xl font-bold" style={{ color: scoreColor }}>
          {score.toFixed(1)}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-3">{dimensie.beschrijving}</p>
      <MaturityBadge level={level} size="sm" />
    </div>
  );
}
