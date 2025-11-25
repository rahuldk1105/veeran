'use client';

import { useMemo, useRef, useState } from 'react';

export default function TrendChart({ values, title }: { values: number[]; title: string }) {
  const width = 560;
  const height = 200;
  const padding = 24;
  const [hover, setHover] = useState<{ x: number; y: number; i: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const points = useMemo(() => {
    if (values.length === 0) return [] as { x: number; y: number }[];
    const max = Math.max(...values, 1);
    const step = (width - padding * 2) / Math.max(values.length - 1, 1);
    return values.map((v, i) => ({
      x: padding + i * step,
      y: height - padding - (v / max) * (height - padding * 2),
    }));
  }, [values]);

  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    return points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ');
  }, [points]);

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let nearest = 0;
    let best = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - x);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setHover({ x: points[nearest].x, y: points[nearest].y, i: nearest });
  };

  return (
    <div className="rounded-xl bg-white shadow-md p-4">
      <p className="text-sm font-medium mb-2 text-christmas-blue">{title}</p>
      <svg ref={svgRef} width={width} height={height} className="w-full" onMouseMove={onMouseMove} onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A73E8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1A73E8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={width} height={height} fill="url(#lineGrad)" opacity={0.1} />
        <path d={pathD} stroke="#1A73E8" strokeWidth={3} fill="none" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill="#1A73E8" />
        ))}
        {hover && (
          <g>
            <line x1={hover.x} y1={padding} x2={hover.x} y2={height - padding} stroke="#999" strokeDasharray="4 4" />
            <circle cx={hover.x} cy={hover.y} r={5} fill="#FFD966" />
          </g>
        )}
      </svg>
      {hover && (
        <div className="mt-2 text-sm">
          <span className="font-medium">Match {hover.i + 1}:</span> {values[hover.i]} goals
        </div>
      )}
    </div>
  );
}
