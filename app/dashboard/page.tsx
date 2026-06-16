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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 capitalize">{formatDateLong(hoy)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Ingresos del mes"
          value={formatMXN(ingresosMes)}
          hint={`${cobros.length} cobros registrados`}
        />
        <StatCard
          label="Citas de hoy"
          value={String(citasHoy.length)}
          hint="Agenda del día"
        />
        <StatCard
          label={cap(pluralize(vocab.cliente))}
          value={String(clientas.length)}
          hint="Registradas"
        />
        <StatCard
          label="Ticket promedio"
          value={formatMXN(ticketPromedio)}
          hint="Por cobro este mes"
        />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Citas de hoy</h2>
          <Link href="/agenda" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
            Ver agenda completa
          </Link>
        </div>
        <ul className="divide-y divide-gray-100">
          {citasHoy.map((cita) => (
            <li key={cita.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-medium text-gray-900">
                  {cita.hora} · {cita.clienta}
                </p>
                <p className="text-sm text-gray-500">
                  {cita.tratamiento} · {cap(vocab.empleado)}: {cita.terapeuta}
                </p>
              </div>
              <EstadoBadge estado={cita.estado} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
