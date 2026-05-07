'use client';

import { MaturityLevel } from '@/lib/types';

const badgeColors: Record<MaturityLevel, { bg: string; text: string; border: string }> = {
  'Ad hoc':         { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
  'Bewust':         { bg: '#FFF7ED', text: '#92400E', border: '#FED7AA' },
  'Gestructureerd': { bg: '#FEFCE8', text: '#713F12', border: '#FDE68A' },
  'Sturend':        { bg: '#EFF6FF', text: '#1E3A5F', border: '#5BC4A0' },
  'Adaptief':       { bg: '#F0FDF8', text: '#065F46', border: '#5BC4A0' },
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
  const { bg, text, border } = badgeColors[level];

  return (
    <span
      className={`inline-block rounded-full border font-medium ${sizeClasses[size]}`}
      style={{ backgroundColor: bg, color: text, borderColor: border }}
    >
      {level}
    </span>
  );
}
