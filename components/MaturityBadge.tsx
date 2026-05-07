'use client';

import { MaturityLevel } from '@/lib/types';

const badgeColors: Record<MaturityLevel, string> = {
  'Ad hoc': 'bg-red-100 text-red-800 border-red-200',
  'Bewust': 'bg-orange-100 text-orange-800 border-orange-200',
  'Gestructureerd': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Sturend': 'bg-blue-100 text-blue-800 border-blue-200',
  'Adaptief': 'bg-green-100 text-green-800 border-green-200',
};

interface MaturityBadgeProps {
  level: MaturityLevel;
  size?: 'sm' | 'md' | 'lg';
}

export default function MaturityBadge({ level, size = 'md' }: MaturityBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-block rounded-full border font-medium ${badgeColors[level]} ${sizeClasses[size]}`}
    >
      {level}
    </span>
  );
}
