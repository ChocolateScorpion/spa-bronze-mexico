"use client";

import { useEffect, useRef, useState } from "react";

type StatCardProps = {
  label: string;
  value: string;
  numericValue?: number;          // para animación de contador
  hint?: string;
  accent?: boolean;
  trend?: number;                 // positivo = ↑, negativo = ↓
  trendLabel?: string;
  isCurrency?: boolean;
};

function formatWithCommas(n: number, isCurrency: boolean): string {
  const rounded = Math.round(n);
  if (isCurrency) return "$" + rounded.toLocaleString("es-MX");
  return rounded.toLocaleString("es-MX");
}

function useCountUp(target: number, active: boolean, duration = 900) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    startRef.current = null;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(eased * target);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, active, duration]);

  return current;
}

function TrendBadge({ trend, trendLabel }: { trend: number; trendLabel?: string }) {
  const up = trend >= 0;
  return (
    <div className="flex items-center gap-1 mt-2">
      <span
        className="inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full"
        style={{
          background: up ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.10)",
          color: up ? "#15803d" : "#dc2626",
        }}
      >
        {up ? "↑" : "↓"} {Math.abs(trend)}%
      </span>
      {trendLabel && (
        <span className="text-xs" style={{ color: "color-mix(in srgb, var(--color-texto,#1a1208) 35%, transparent)" }}>
          {trendLabel}
        </span>
      )}
    </div>
  );
}

export default function StatCard({
  label,
  value,
  numericValue,
  hint,
  accent = false,
  trend,
  trendLabel = "vs mes anterior",
  isCurrency = false,
}: StatCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const animated = useCountUp(numericValue ?? 0, mounted && numericValue !== undefined);
  const displayValue = (mounted && numericValue !== undefined)
    ? formatWithCommas(animated, isCurrency)
    : value;

  if (accent) {
    return (
      <div
        className="animate-fade-in relative rounded-2xl p-5 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)",
          boxShadow: "0 4px 24px rgba(201,168,76,0.30)",
        }}
      >
        {/* Círculo decorativo */}
        <div className="absolute top-0 right-0 w-28 h-28 rounded-full -translate-y-1/2 translate-x-1/2 bg-white opacity-[0.08]" />
        <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full translate-y-1/2 -translate-x-1/2 bg-white opacity-[0.05]" />

        <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-white/70">{label}</p>
        <p
          className="text-3xl font-black tracking-tight leading-none text-white"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {displayValue}
        </p>
        {trend !== undefined ? (
          <div className="flex items-center gap-1 mt-2">
            <span
              className="inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.20)", color: "rgba(255,255,255,0.95)" }}
            >
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
            <span className="text-xs text-white/60">{trendLabel}</span>
          </div>
        ) : hint ? (
          <p className="mt-2 text-xs text-white/60">{hint}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in relative rounded-2xl p-5 overflow-hidden bg-white"
      style={{
        border: "1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-1/2 translate-x-1/2 opacity-[0.05]"
        style={{ background: "var(--color-primary)" }}
      />
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: "color-mix(in srgb, var(--color-texto, #1a1208) 45%, transparent)" }}
      >
        {label}
      </p>
      <p
        className="text-3xl font-black tracking-tight leading-none"
        style={{
          color: "var(--color-texto, #1a1208)",
          fontFamily: isCurrency ? "'Playfair Display', Georgia, serif" : undefined,
        }}
      >
        {displayValue}
      </p>
      {trend !== undefined ? (
        <TrendBadge trend={trend} trendLabel={trendLabel} />
      ) : hint ? (
        <p className="mt-2 text-xs" style={{ color: "color-mix(in srgb, var(--color-texto, #1a1208) 35%, transparent)" }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
