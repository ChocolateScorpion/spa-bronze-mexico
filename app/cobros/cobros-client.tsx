"use client";

import { useState, type ChangeEvent } from "react";
import type { Cobro, ExtractedCobro, MetodoPago } from "@/lib/types";
import { formatMXN, formatDate } from "@/lib/format";
import { vocab, cap } from "@/lib/business";
import { getTerapeutas } from "@/lib/data";

const METODOS: { value: MetodoPago; label: string }[] = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta" },
  { value: "transferencia", label: "Transferencia" },
];

const CONFIANZA_LABELS: Record<string, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

type Props = {
  initialCobros: Cobro[];
};

export default function CobrosClient({ initialCobros }: Props) {
  const terapeutas = getTerapeutas();

  const [cobros, setCobros] = useState<Cobro[]>(initialCobros);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractedCobro | null>(null);

  const [clienta, setClienta] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [terapeuta, setTerapeuta] = useState(terapeutas[0]?.nombre ?? "");
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("efectivo");

  const total = cobros.reduce((sum, c) => sum + c.monto, 0);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setResult(null);
    setError(null);

    if (!selected) {
      setPreviewUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(selected);
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/ocr", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "No se pudo procesar la imagen.");
        return;
      }
      const data = json.data as ExtractedCobro;
      setResult(data);
      if (data.metodoPago) setMetodoPago(data.metodoPago);
      if (data.concepto) setTratamiento(data.concepto);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  function handleAddCobro() {
    if (!result || result.monto == null) return;
    const nuevo: Cobro = {
      id: `co-${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      clienta: clienta || "Sin especificar",
      tratamiento: tratamiento || "Sin especificar",
      monto: result.monto,
      metodoPago,
      terapeuta: terapeuta || "Sin especificar",
    };
    setCobros((prev) => [nuevo, ...prev]);
    setFile(null);
    setResult(null);
    setClienta("");
    setTratamiento("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cobros</h1>
          <p className="text-sm text-gray-500">Historial de pagos del mes</p>
        </div>
        <div className="rounded-2xl bg-white px-5 py-3 shadow-sm">
          <p className="text-xs text-gray-500">Total del mes</p>
          <p className="text-xl font-semibold text-[var(--color-primary)]">{formatMXN(total)}</p>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Registrar cobro con comprobante</h2>
          <p className="text-sm text-gray-500">
            Sube una foto del comprobante y la IA (Gemini) extraerá el monto y método de pago automáticamente.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-4 text-center text-sm text-gray-500 transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] sm:w-56 sm:shrink-0">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Vista previa del comprobante"
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <>
                <span className="text-2xl">📷</span>
                <span>Subir comprobante</span>
                <span className="text-xs text-gray-400">JPG, PNG o WebP</span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <div className="flex-1 space-y-3">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40"
            >
              {loading ? "Analizando…" : "Analizar con IA"}
            </button>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {result && (
              <div className="space-y-3 rounded-xl bg-[var(--color-secondary)] p-4 text-sm">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">Monto detectado</p>
                    <p className="font-semibold text-gray-900">
                      {result.monto != null ? formatMXN(result.monto) : "No detectado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Método</p>
                    <p className="font-semibold capitalize text-gray-900">{result.metodoPago ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Confianza</p>
                    <p className="font-semibold text-gray-900">
                      {CONFIANZA_LABELS[result.confianza] ?? result.confianza}
                    </p>
                  </div>
                </div>

                {result.monto != null && (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <input
                        type="text"
                        placeholder={cap(vocab.cliente)}
                        value={clienta}
                        onChange={(e) => setClienta(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder={cap(vocab.servicio)}
                        value={tratamiento}
                        onChange={(e) => setTratamiento(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      />
                      <select
                        value={terapeuta}
                        onChange={(e) => setTerapeuta(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      >
                        {terapeutas.map((t) => (
                          <option key={t.id} value={t.nombre}>
                            {t.nombre}
                          </option>
                        ))}
                      </select>
                      <select
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      >
                        {METODOS.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddCobro}
                      className="rounded-lg border border-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-white"
                    >
                      Agregar a la lista
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">{cap(vocab.cliente)}</th>
              <th className="px-5 py-3">{cap(vocab.servicio)}</th>
              <th className="px-5 py-3">{cap(vocab.empleado)}</th>
              <th className="px-5 py-3">Método</th>
              <th className="px-5 py-3 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cobros.map((cobro) => (
              <tr key={cobro.id}>
                <td className="px-5 py-3 text-gray-500">{formatDate(cobro.fecha)}</td>
                <td className="px-5 py-3">{cobro.clienta}</td>
                <td className="px-5 py-3">{cobro.tratamiento}</td>
                <td className="px-5 py-3">{cobro.terapeuta}</td>
                <td className="px-5 py-3 capitalize">{cobro.metodoPago}</td>
                <td className="px-5 py-3 text-right font-medium text-gray-900">{formatMXN(cobro.monto)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
