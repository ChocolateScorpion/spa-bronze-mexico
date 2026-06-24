type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
};

export default function StatCard({ label, value, hint, accent = false }: StatCardProps) {
  if (accent) {
    return (
      <div
        className="animate-fade-in relative rounded-2xl p-5 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)",
          boxShadow: "0 4px 24px rgba(201,168,76,0.30)",
        }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-1/2 translate-x-1/2 bg-white opacity-[0.07]" />
        <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-white/70">{label}</p>
        <p className="text-3xl font-black tracking-tight leading-none text-white">{value}</p>
        {hint && <p className="mt-2 text-xs text-white/60">{hint}</p>}
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
      <p className="text-3xl font-black tracking-tight leading-none" style={{ color: "var(--color-texto, #1a1208)" }}>
        {value}
      </p>
      {hint && (
        <p className="mt-2 text-xs" style={{ color: "color-mix(in srgb, var(--color-texto, #1a1208) 35%, transparent)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}
