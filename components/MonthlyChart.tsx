"use client";

import { useEffect, useState } from "react";

type MonthlyData = {
  mes: string;     // e.g. "Ene", "Feb"
  ingresos: number;
};

type MonthlyChartProps = {
  data: MonthlyData[];

  title?: string;
};

export default function MonthlyChart({
  data,
  title = "Evolución mensual",
}: MonthlyChartProps) {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  useEffect(() => { setMounted(true); }, []);

  const fmt = (v: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(v);
  const max = Math.max(...data.map((d) => d.ingresos), 1);

  const W = 480;
  const H = 140;
  const padL = 8;
  const padR = 8;
  const padT = 16;
  const padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const n = data.length;
  const stepX = n > 1 ? chartW / (n - 1) : chartW;

  const pts = data.map((d, i) => ({
    x: padL + (n > 1 ? i * stepX : chartW / 2),
    y: padT + chartH - (d.ingresos / max) * chartH,
    d,
    i,
  }));

  // Build SVG path for area
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = [
    linePath,
    `L ${pts[pts.length - 1].x} ${padT + chartH}`,
    `L ${pts[0].x} ${padT + chartH}`,
    "Z",
  ].join(" ");

  return (
    <div
      className="rounded-2xl bg-white p-5"
      style={{
        border: "1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
      }}
    >
      <h2 className="mb-4 text-base font-bold" style={{ color: "var(--color-texto, #1a1208)" }}>
        {title}
      </h2>
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.00" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((t, i) => (
            <line
              key={i}
              x1={padL}
              y1={padT + chartH * (1 - t)}
              x2={W - padR}
              y2={padT + chartH * (1 - t)}
              stroke="#C9A84C"
              strokeOpacity="0.10"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          {mounted && (
            <path d={areaPath} fill="url(#goldArea)" />
          )}

          {/* Line */}
          {mounted && (
            <path
              d={linePath}
              fill="none"
              stroke="#C9A84C"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Dots + hover */}
          {mounted && pts.map((p) => (
            <g key={p.i} onMouseEnter={() => setHovered(p.i)} onMouseLeave={() => setHovered(null)}>
              {/* hover area */}
              <rect
                x={p.x - stepX / 2}
                y={padT}
                width={stepX}
                height={chartH}
                fill="transparent"
                style={{ cursor: "pointer" }}
              />
              {/* dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hovered === p.i ? 5 : 3.5}
                fill={hovered === p.i ? "#8B6914" : "#C9A84C"}
                stroke="white"
                strokeWidth="2"
                style={{ transition: "all 0.15s" }}
              />
              {/* tooltip */}
              {hovered === p.i && (
                <g>
                  <rect
                    x={p.x - 36}
                    y={p.y - 30}
                    width={72}
                    height={22}
                    rx={6}
                    fill="#1a1208"
                    fillOpacity="0.88"
                  />
                  <text
                    x={p.x}
                    y={p.y - 14}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill="white"
                  >
                    {fmt(p.d.ingresos)}
                  </text>
                </g>
              )}
              {/* month label */}
              <text
                x={p.x}
                y={H - 6}
                textAnchor="middle"
                fontSize="9"
                fontWeight={hovered === p.i ? "700" : "500"}
                fill={hovered === p.i ? "#C9A84C" : "#aaa"}
              >
                {p.d.mes}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
