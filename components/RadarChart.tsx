'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { DimensionScores } from '@/lib/types';

interface RadarChartProps {
  scores: DimensionScores;
  height?: number;
  outerRadius?: number;
}

const LABELS: Record<string, string[]> = {
  D1: ['Gegevens-', 'kwaliteit'],
  D2: ['Structuur &', 'betekenis'],
  D3: ['Governance'],
  D4: ['Mens &', 'cultuur'],
};

function MultiLineLabel({
  x,
  y,
  payload,
}: {
  x?: number | string;
  y?: number | string;
  payload?: { value: string };
}) {
  const lines = LABELS[payload?.value ?? ''] ?? [payload?.value ?? ''];
  const lineHeight = 15;
  const totalHeight = lines.length * lineHeight;
  const numY = typeof y === 'string' ? parseFloat(y) : (y ?? 0);
  const startY = numY - totalHeight / 2 + lineHeight / 2;

  return (
    <text
      x={x}
      y={startY}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="#374151"
      fontSize={12}
      fontWeight={500}
      fontFamily="Inter, system-ui, sans-serif"
    >
      {lines.map((line, i) => (
        <tspan key={i} x={typeof x === 'string' ? parseFloat(x) : x} dy={i === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export default function DimensieRadarChart({
  scores,
  height = 340,
  outerRadius = 90,
}: RadarChartProps) {
  const data = [
    { dimensie: 'D1', score: scores.D1, fullMark: 5 },
    { dimensie: 'D2', score: scores.D2, fullMark: 5 },
    { dimensie: 'D3', score: scores.D3, fullMark: 5 },
    { dimensie: 'D4', score: scores.D4, fullMark: 5 },
  ];

  return (
    <div className="w-full py-4 px-6">
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart
          data={data}
          outerRadius={outerRadius}
          margin={{ top: 30, right: 60, bottom: 30, left: 60 }}
        >
          <PolarGrid stroke="#e5e7eb" strokeWidth={1} />
          <PolarAngleAxis
            dataKey="dimensie"
            tick={(props) => <MultiLineLabel {...props} />}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tickCount={6}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#1E3A5F"
            fill="#1E3A5F"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={{ fill: '#1E3A5F', r: 4 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
