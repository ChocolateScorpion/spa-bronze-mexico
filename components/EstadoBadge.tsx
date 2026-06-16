import type { EstadoCita } from "@/lib/types";

const ESTADO_STYLES: Record<EstadoCita, string> = {
  confirmada: "bg-green-100 text-green-700",
  pendiente: "bg-amber-100 text-amber-700",
  completada: "bg-gray-100 text-gray-600",
  cancelada: "bg-red-100 text-red-600",
};

export default function EstadoBadge({ estado }: { estado: EstadoCita }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${ESTADO_STYLES[estado]}`}>
      {estado}
    </span>
  );
}
