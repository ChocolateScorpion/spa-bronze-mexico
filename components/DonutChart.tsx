"use client";

import { useEffect, useState } from "react";

type DonutItem = {
  label: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  items: DonutItem[];

  title: string;
};

const GOLD_PALETTE = ["#C9A84C", "#8B6914", "#E8C97A", "#6B4F10", "#DFB85C"];

export default function DonutChart({ items, title }: DonutChartProps) {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  useEffect(() => { setMounted(true); }, []);

  const fmt = (v: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(v);
  const total = items.reduce((s, i) => s + i.value, 0);
  if (total === 0) return null;

  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 58;
  const innerR = 38;
  const gap = 2;

  // Build arcs
  let cumAngle = -90;
  const arcs = items.map((item, idx) => {
    const pct = item.value / total;
    const startAngle = cumAngle;
    const sweepDeg = pct * 360 - (gap * 360) / 360;
    cumAngle += pct * 360;
    const endAngle = startAngle + sweepDeg;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const ix1 = cx + innerR * Math.cos(toRad(endAngle));
    const iy1 = cy + innerR * Math.sin(toRad(endAngle));
    const ix2 = cx + innerR * Math.cos(toRad(startAngle));
    const iy2 = cy + innerR * Math.sin(toRad(startAngle));
    const large = sweepDeg > 180 ? 1 : 0;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2} Z`;
    return { d, color: item.color || GOLD_PALETTE[idx % GOLD_PALETTE.length], pct, item, idx };
  });

  const hoveredItem = hovered !== null ? items[hovered] : null;

  return (
    <div
      className="rounded-2xl bg-white p-5"
      style={{
        border: "1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
      }}
    >
      <h2 className="mb-5 text-base font-bold" style={{ color: "var(--color-texto, #1a1208)" }}>
        {title}
      </h2>

      <div className="flex items-center gap-6">
        {/* SVG donut */}
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {mounted && arcs.map((arc) => (
              <path
                key={arc.idx}
                d={arc.d}
                fill={arc.color}
                opacity={hovered === null || hovered === arc.idx ? 1 : 0.4}
                style={{
                  transform: hovered === arc.idx ? `scale(1.04)` : "scale(1)",
                  transformOrigin: `${cx}px ${cy}px`,
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHovered(arc.idx)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
            {/* Centro */}
            <circle cx={cx} cy={cy} r={innerR - 3} fill="white" />
            {hoveredItem ? (
              <>
                <text x={cx} y={cy - 5} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a1208">
                  {Math.round((hoveredItem.value / total) * 100)}%
                </text>
                <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8.5" fill="#888" fontWeight="500">
                  {fmt(hoveredItem.value)}
                </text>
              </>
            ) : (
              <>
                <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#C9A84C"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {fmt(total)}
                </text>
                <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="#aaa">
                  total
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Leyenda */}
        <ul className="flex-1 space-y-2.5">
          {items.map((item, idx) => {
            const pct = Math.round((item.value / total) * 100);
            return (
              <li
                key={idx}
                className="flex items-center justify-between gap-3 cursor-pointer"
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{ opacity: hovered === null || hovered === idx ? 1 : 0.5, transition: "opacity 0.15s" }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color || GOLD_PALETTE[idx % GOLD_PALETTE.length] }} />
                  <span className="text-sm font-medium truncate capitalize" style={{ color: "var(--color-texto, #1a1208)" }}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {pct}%
                  </span>
                  <span className="text-sm font-bold" style={{ color: "var(--color-texto, #1a1208)" }}>
                    {fmt(item.value)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
