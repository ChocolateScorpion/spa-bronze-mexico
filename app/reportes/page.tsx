import { getCobros } from "@/lib/data";
import { formatMXN, formatDateLong } from "@/lib/format";
import { vocab } from "@/lib/business";
import StatCard from "@/components/StatCard";
import DonutChart from "@/components/DonutChart";
import MonthlyChart from "@/components/MonthlyChart";
import type { Cobro } from "@/lib/types";

const GOLD_PALETTE = ["#C9A84C", "#8B6914", "#DFB85C"];
const ESPECIALISTA_PALETTE = ["#C9A84C", "#8B6914", "#DFB85C", "#6B4F10"];

const METODO_LABELS: Record<string, string> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
};

// Datos mensuales de ejemplo (últimos 6 meses)
const MONTHLY_DATA = [
  { mes: "Ene", ingresos: 5200 },
  { mes: "Feb", ingresos: 6800 },
  { mes: "Mar", ingresos: 5900 },
  { mes: "Abr", ingresos: 7400 },
  { mes: "May", ingresos: 6200 },
  { mes: "Jun", ingresos: 7030 },
];

function sumPorClave(cobros: Cobro[], clave: (cobro: Cobro) => string) {
  const totales = cobros.reduce<Record<string, number>>((acc, cobro) => {
    const key = clave(cobro);
    acc[key] = (acc[key] ?? 0) + cobro.monto;
    return acc;
  }, {});

  return Object.entries(totales)
    .map(([label, value]) => ({ label: METODO_LABELS[label] ?? label, value }))
    .sort((a, b) => b.value - a.value);
}

export default function ReportesPage() {
  const cobros = getCobros();
  const ingresosTotales = cobros.reduce((sum, c) => sum + c.monto, 0);
  const ticketPromedio = cobros.length > 0 ? ingresosTotales / cobros.length : 0;

  const porMetodoRaw = sumPorClave(cobros, (c) => c.metodoPago);
  const porTerapeutaRaw = sumPorClave(cobros, (c) => c.terapeuta);
  const porTratamientoRaw = sumPorClave(cobros, (c) => c.tratamiento);

  const porMetodo = porMetodoRaw.map((item, i) => ({ ...item, color: GOLD_PALETTE[i % GOLD_PALETTE.length] }));
  const porTerapeuta = porTerapeutaRaw.map((item, i) => ({ ...item, color: ESPECIALISTA_PALETTE[i % ESPECIALISTA_PALETTE.length] }));
  const porTratamiento = porTratamientoRaw.map((item, i) => ({ ...item, color: GOLD_PALETTE[i % GOLD_PALETTE.length] }));

  const hoy = new Date().toISOString().slice(0, 10);

  // Especialista top
  const topEsp = porTerapeutaRaw[0];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--color-texto, #1a1208)" }}>
          Reportes
        </h1>
        <p className="text-sm mt-0.5 capitalize" style={{ color: "color-mix(in srgb, var(--color-texto, #1a1208) 40%, transparent)" }}>
          Resumen Mensual · {formatDateLong(hoy)}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3 animate-fade-in delay-1">
        <StatCard
          label="Ingresos totales"
          value={formatMXN(ingresosTotales)}
          numericValue={ingresosTotales}
          isCurrency
          accent
          trend={14}
        />
        <StatCard
          label="Cobros registrados"
          value={String(cobros.length)}
          numericValue={cobros.length}
          trend={3}
        />
        <StatCard
          label="Ticket promedio"
          value={formatMXN(ticketPromedio)}
          numericValue={ticketPromedio}
          isCurrency
          trend={9}
        />
      </div>

      {/* Evolución mensual */}
      <div className="animate-fade-in delay-2">
        <MonthlyChart
          data={MONTHLY_DATA}

          title="Ingresos últimos 6 meses"
        />
      </div>

      {/* Donuts */}
      <div className="grid gap-4 lg:grid-cols-2 animate-fade-in delay-3">
        <DonutChart
          title="Por método de pago"
          items={porMetodo}

        />
        <DonutChart
          title={`Por ${vocab.empleado}`}
          items={porTerapeuta}

        />
      </div>

      {/* Especialista destacada — banner */}
      {topEsp && (
        <div
          className="animate-fade-in delay-4 rounded-2xl p-5 flex items-center gap-5"
          style={{
            background: "linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)",
            boxShadow: "0 4px 24px rgba(201,168,76,0.28)",
          }}
        >
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2" />
              <path d="M18 9h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" />
              <path d="M6 4h12v10a6 6 0 0 1-6 6 6 6 0 0 1-6-6V4Z" />
              <path d="M10 20v2M14 20v2M8 22h8" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-0.5">
              Especialista del mes
            </p>
            <p className="text-xl font-black text-white leading-tight">{topEsp.label}</p>
            <p className="text-sm text-white/80 mt-0.5">
              {formatMXN(topEsp.value)} generados · {Math.round((topEsp.value / ingresosTotales) * 100)}% del total
            </p>
          </div>
          <div className="text-right flex-shrink-0 hidden sm:block">
            <p className="text-3xl font-black text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              #{porTerapeutaRaw.indexOf(topEsp) + 1}
            </p>
            <p className="text-xs text-white/60 mt-0.5">ranking</p>
          </div>
        </div>
      )}

      {/* Por tratamiento */}
      <div className="animate-fade-in delay-4">
        <DonutChart
          title={`Por ${vocab.servicio}`}
          items={porTratamiento}

        />
      </div>
    </div>
  );
}
