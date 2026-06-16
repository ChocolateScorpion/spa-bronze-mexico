import { getCitasHoy } from "@/lib/data";
import { formatDateLong } from "@/lib/format";
import { vocab, cap } from "@/lib/business";
import EstadoBadge from "@/components/EstadoBadge";

export default function AgendaPage() {
  const citas = getCitasHoy();
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Agenda</h1>
        <p className="text-sm text-gray-500 capitalize">{formatDateLong(hoy)}</p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Hora</th>
              <th className="px-5 py-3">{cap(vocab.cliente)}</th>
              <th className="px-5 py-3">{cap(vocab.servicio)}</th>
              <th className="px-5 py-3">{cap(vocab.empleado)}</th>
              <th className="px-5 py-3">Duración</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {citas.map((cita) => (
              <tr key={cita.id}>
                <td className="px-5 py-3 font-medium text-gray-900">{cita.hora}</td>
                <td className="px-5 py-3">{cita.clienta}</td>
                <td className="px-5 py-3">{cita.tratamiento}</td>
                <td className="px-5 py-3">{cita.terapeuta}</td>
                <td className="px-5 py-3 text-gray-500">{cita.duracionMin} min</td>
                <td className="px-5 py-3">
                  <EstadoBadge estado={cita.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
