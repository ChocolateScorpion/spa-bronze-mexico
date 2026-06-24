import Link from "next/link";
import { getCobros, getCitasHoy, getClientas } from "@/lib/data";
import { formatMXN, formatDateLong } from "@/lib/format";
import { vocab, cap, pluralize } from "@/lib/business";
import StatCard from "@/components/StatCard";
import EstadoBadge from "@/components/EstadoBadge";

// Hora de saludo
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default function DashboardPage() {
  const cobros = getCobros();
  const citasHoy = getCitasHoy();
  const clientas = getClientas();

  const ingresosMes = cobros.reduce((sum, c) => sum + c.monto, 0);
  const ticketPromedio = cobros.length > 0 ? ingresosMes / cobros.length : 0;
  const hoy = new Date().toISOString().slice(0, 10);

  // Especialista con más ingresos
  const porEspecialista = cobros.reduce<Record<string, number>>((acc, c) => {
    acc[c.terapeuta] = (acc[c.terapeuta] ?? 0) + c.monto;
    return acc;
  }, {});
  const topEspecialista = Object.entries(porEspecialista).sort((a, b) => b[1] - a[1])[0];

  const confirmadas = citasHoy.filter((c) => c.estado === "confirmada").length;

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header con saludo */}
      <div className="animate-fade-in flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* Sol dorado */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <p className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
              {getGreeting()}, Mayerling
            </p>
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--color-texto, #1a1208)" }}>
            Dashboard
          </h1>
          <p className="text-sm mt-0.5 capitalize" style={{ color: "color-mix(in srgb, var(--color-texto, #1a1208) 40%, transparent)" }}>
            {formatDateLong(hoy)} · {citasHoy.length} {citasHoy.length === 1 ? "clienta hoy" : "clientas hoy"}, {confirmadas} confirmadas
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
            numericValue={ingresosMes}
            isCurrency
            accent
            trend={12}
          />
        </div>
        <div className="animate-fade-in delay-2">
          <StatCard
            label="Sesiones de hoy"
            value={String(citasHoy.length)}
            numericValue={citasHoy.length}
            trend={0}
            trendLabel="igual que ayer"
          />
        </div>
        <div className="animate-fade-in delay-3">
          <StatCard
            label={cap(pluralize(vocab.cliente))}
            value={String(clientas.length)}
            numericValue={clientas.length}
            trend={8}
          />
        </div>
        <div className="animate-fade-in delay-4">
          <StatCard
            label="Ticket promedio"
            value={formatMXN(ticketPromedio)}
            numericValue={ticketPromedio}
            isCurrency
            trend={5}
          />
        </div>
      </div>

      {/* Fila: Especialista destacada + próxima sesión */}
      {topEspecialista && (
        <div className="animate-fade-in grid gap-4 sm:grid-cols-2">
          {/* Especialista destacada */}
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(139,105,20,0.04) 100%)",
              border: "1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)",
            }}
          >
            {/* Trophy */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)", boxShadow: "0 4px 12px rgba(201,168,76,0.35)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2" />
                <path d="M18 9h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" />
                <path d="M6 4h12v10a6 6 0 0 1-6 6 6 6 0 0 1-6-6V4Z" />
                <path d="M10 20v2M14 20v2M8 22h8" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--color-primary)" }}>
                Especialista del mes
              </p>
              <p className="font-black text-base truncate" style={{ color: "var(--color-texto, #1a1208)" }}>
                {topEspecialista[0]}
              </p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--color-primary)", fontFamily: "'Playfair Display', Georgia, serif" }}>
                {formatMXN(topEspecialista[1])} generados
              </p>
            </div>
          </div>

          {/* Próxima sesión */}
          {citasHoy.length > 0 && (() => {
            const proxima = citasHoy.find((c) => c.estado !== "completada" && c.estado !== "cancelada") ?? citasHoy[0];
            return (
              <div
                className="rounded-2xl p-5 flex items-center gap-4"
                style={{
                  background: "#fff",
                  border: "1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "color-mix(in srgb, var(--color-primary) 10%, transparent)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                    style={{ color: "var(--color-primary)" }}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "color-mix(in srgb, var(--color-texto, #1a1208) 40%, transparent)" }}>
                    Próxima sesión
                  </p>
                  <p className="font-black text-base truncate" style={{ color: "var(--color-texto, #1a1208)" }}>
                    {proxima.clienta}
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "color-mix(in srgb, var(--color-texto, #1a1208) 45%, transparent)" }}>
                    {proxima.hora} · {proxima.tratamiento}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

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
              <li
                key={cita.id}
                className="cita-row flex items-center justify-between gap-4 px-6 py-4 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Hora badge */}
                  <div
                    className="w-14 text-center py-1.5 rounded-lg flex-shrink-0 transition-colors"
                    style={{ background: "color-mix(in srgb, var(--color-primary) 08%, transparent)" }}
                  >
                    <span className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>
                      {cita.hora}
                    </span>
                  </div>
                  {/* Avatar inicial */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
                    style={{ background: "linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)" }}
                  >
                    {cita.clienta.charAt(0)}
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
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-right hidden sm:block" style={{ color: "color-mix(in srgb, var(--color-texto,#1a1208) 35%, transparent)" }}>
                    {cita.duracionMin} min
                  </span>
                  <EstadoBadge estado={cita.estado} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
