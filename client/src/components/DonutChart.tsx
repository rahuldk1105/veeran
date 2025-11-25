'use client';

import { useMemo, useState } from 'react';

type Item = { label: string; value: number; color?: string };

export default function DonutChart({ items, title }: { items: Item[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);
  const radius = 80;
  const stroke = 24;
  const circumference = 2 * Math.PI * radius;
  const total = useMemo(() => items.reduce((a, b) => a + b.value, 0), [items]);
  const segments = useMemo(() => {
    let offset = 0;
    return items.map((it, i) => {
      const frac = total > 0 ? it.value / total : 0;
      const len = frac * circumference;
      const seg = { index: i, dasharray: `${len} ${circumference - len}`, dashoffset: offset, color: it.color || ['#1A73E8', '#FFD966', '#22c55e', '#ef4444', '#9333ea'][i % 5] };
      offset += len;
      return seg;
    });
  }, [items, total, circumference]);

  return (
    <div className="rounded-xl bg-white shadow-md p-4">
      <p className="text-sm font-medium mb-2 text-christmas-blue">{title}</p>
      <div className="flex items-center gap-6">
        <svg width={220} height={220} viewBox="0 0 220 220">
          <g transform="translate(110,110)">
            {segments.map(s => (
              <circle key={s.index} r={radius} fill="none" stroke={s.color} strokeWidth={stroke} strokeDasharray={s.dasharray} strokeDashoffset={s.dashoffset} style={{ cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseEnter={() => setActive(s.index)} onMouseLeave={() => setActive(null)} />
            ))}
            <circle r={radius - stroke} fill="#fff" />
          </g>
        </svg>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className={`flex items-center gap-2 ${active === i ? 'scale-[1.02]' : ''}`}>
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: segments[i]?.color }}></span>
              <span className="text-sm">{it.label}</span>
              <span className="ml-auto text-sm font-medium">{it.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
