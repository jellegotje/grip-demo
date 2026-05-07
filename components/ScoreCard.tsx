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

  let borderColor = 'border-red-300';
  let scoreColor = 'text-red-600';
  if (score >= 3.5) {
    borderColor = 'border-green-300';
    scoreColor = 'text-green-600';
  } else if (score >= 2.5) {
    borderColor = 'border-orange-300';
    scoreColor = 'text-orange-600';
  }

  return (
    <div className={`bg-white rounded-xl border-2 ${borderColor} p-5 shadow-sm`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {code}
          </span>
          <h3 className="font-semibold text-gray-900 mt-0.5">{dimensie.naam}</h3>
        </div>
        <span className={`text-2xl font-bold ${scoreColor}`}>{score.toFixed(1)}</span>
      </div>
      <p className="text-sm text-gray-500 mb-3">{dimensie.beschrijving}</p>
      <MaturityBadge level={level} size="sm" />
    </div>
  );
}
