import { getClientas } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { vocab, cap, pluralize } from "@/lib/business";

export default function ClientesPage() {
  const clientas = getClientas();
  const titulo = cap(pluralize(vocab.cliente));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{titulo}</h1>
        <p className="text-sm text-gray-500">{clientas.length} registradas</p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Teléfono</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">{cap(vocab.servicio)} frecuente</th>
              <th className="px-5 py-3">Última visita</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clientas.map((clienta) => (
              <tr key={clienta.id}>
                <td className="px-5 py-3 font-medium text-gray-900">{clienta.nombre}</td>
                <td className="px-5 py-3 text-gray-500">{clienta.telefono}</td>
                <td className="px-5 py-3 text-gray-500">{clienta.email}</td>
                <td className="px-5 py-3">{clienta.tratamientoFrecuente}</td>
                <td className="px-5 py-3 text-gray-500">{formatDate(clienta.ultimaVisita)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
