import Link from "next/link";
import { getCobros, getCitasHoy, getClientas } from "@/lib/data";
import { formatMXN, formatDateLong } from "@/lib/format";
import { vocab, cap, pluralize } from "@/lib/business";
import StatCard from "@/components/StatCard";
import EstadoBadge from "@/components/EstadoBadge";

export default function DashboardPage() {
  const cobros = getCobros();
  const citasHoy = getCitasHoy();
  const clientas = getClientas();

  const ingresosMes = cobros.reduce((sum, c) => sum + c.monto, 0);
  const ticketPromedio = cobros.length > 0 ? ingresosMes / cobros.length : 0;
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="animate-fade-in flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--color-texto, #1a1208)" }}>
            Dashboard
          </h1>
          <p className="text-sm mt-0.5 capitalize" style={{ color: "color-mix(in srgb, var(--color-texto, #1a1208) 40%, transparent)" }}>
            {formatDateLong(hoy)}
          </p>
        </div>
        <Link
          href="/cobros/nuevo"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-white transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-acento, #8B6914) 100%)",
            boxShadow: "0 2px 12px color-mix(in srgb, var(--color-primary) 30%, transparent)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nuevo cobro
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-in delay-1">
          <StatCard
            label="Ingresos del mes"
            value={formatMXN(ingresosMes)}
            hint={`${cobros.length} cobros registrados`}
            accent
          />
        </div>
        <div className="animate-fade-in delay-2">
          <StatCard
            label="Sesiones de hoy"
            value={String(citasHoy.length)}
            hint="Agenda del día"
          />
        </div>
        <div className="animate-fade-in delay-3">
          <StatCard
            label={cap(pluralize(vocab.cliente))}
            value={String(clientas.length)}
            hint="Registradas"
          />
        </div>
        <div className="animate-fade-in delay-4">
          <StatCard
            label="Ticket promedio"
            value={formatMXN(ticketPromedio)}
            hint="Por cobro este mes"
          />
        </div>
      </div>

      {/* Citas de hoy */}
      <div
        className="animate-fade-in rounded-2xl overflow-hidden"
        style={{
          background: "#fff",
          border: "1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
        }}
      >
        {/* Card header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid color-mix(in srgb, var(--color-primary) 08%, transparent)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "color-mix(in srgb, var(--color-primary) 10%, transparent)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                style={{ color: "var(--color-primary)" }}>
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M8 2v4M16 2v4M3 9h18" />
              </svg>
            </div>
            <h2 className="text-base font-bold" style={{ color: "var(--color-texto, #1a1208)" }}>
              Sesiones de hoy
            </h2>
            {citasHoy.length > 0 && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                  color: "var(--color-primary)",
                }}
              >
                {citasHoy.length}
              </span>
            )}
          </div>
          <Link
            href="/agenda"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: "var(--color-primary)" }}
          >
            Ver agenda →
          </Link>
        </div>

        {/* Lista */}
        {citasHoy.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: "color-mix(in srgb, var(--color-texto, #1a1208) 35%, transparent)" }}>
              Sin sesiones para hoy
            </p>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: "color-mix(in srgb, var(--color-primary) 06%, transparent)" }}>
            {citasHoy.map((cita) => (
              <li key={cita.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Hora badge */}
                  <div
                    className="w-14 text-center py-1.5 rounded-lg flex-shrink-0"
                    style={{
                      background: "color-mix(in srgb, var(--color-primary) 08%, transparent)",
                    }}
                  >
                    <span className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>
                      {cita.hora}
                    </span>
                  </div>
                  {/* Info */}
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--color-texto, #1a1208)" }}>
                      {cita.clienta}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "color-mix(in srgb, var(--color-texto, #1a1208) 45%, transparent)" }}>
                      {cita.tratamiento} · {cap(vocab.empleado)}: {cita.terapeuta}
                    </p>
                  </div>
                </div>
                <EstadoBadge estado={cita.estado} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
