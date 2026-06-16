import { getCobros } from "@/lib/data";
import { formatMXN, formatDateLong } from "@/lib/format";
import { vocab } from "@/lib/business";
import StatCard from "@/components/StatCard";
import Breakdown from "@/components/Breakdown";
import type { Cobro } from "@/lib/types";

const METODO_LABELS: Record<string, string> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
};

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

  const porMetodo = sumPorClave(cobros, (c) => c.metodoPago);
  const porTerapeuta = sumPorClave(cobros, (c) => c.terapeuta);
  const porTratamiento = sumPorClave(cobros, (c) => c.tratamiento);

  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>
        <p className="text-sm text-gray-500 capitalize">Resumen mensual · {formatDateLong(hoy)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Ingresos totales" value={formatMXN(ingresosTotales)} hint="Este mes" />
        <StatCard label="Cobros registrados" value={String(cobros.length)} />
        <StatCard label="Ticket promedio" value={formatMXN(ticketPromedio)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Breakdown title="Ingresos por método de pago" items={porMetodo} formatValue={formatMXN} />
        <Breakdown title={`Ingresos por ${vocab.empleado}`} items={porTerapeuta} formatValue={formatMXN} />
      </div>

      <Breakdown title={`Ingresos por ${vocab.servicio}`} items={porTratamiento} formatValue={formatMXN} />
    </div>
  );
}
