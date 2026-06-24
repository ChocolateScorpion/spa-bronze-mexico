type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
};

export default function StatCard({ label, value, hint, accent }: StatCardProps) {
  return (
    <div
      className="animate-fade-in relative rounded-2xl p-5 overflow-hidden"
      style={{
        background: accent
          ? "linear-gradient(135deg, var(--color-primary) 0%, var(--color-acento, #8B6914) 100%)"
          : "#fff",
        border: accent
          ? "none"
          : "1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)",
        boxShadow: accent
          ? "0 4px 24px color-mix(in srgb, var(--color-primary) 30%, transparent)"
          : "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
      }}
    >
      {/* Decoración de fondo */}
      {!accent && (
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-1/2 translate-x-1/2 opacity-[0.04]"
          style={{ background: "var(--color-primary)" }}
        />
      )}

      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: accent ? "rgba(255,255,255,0.70)" : "color-mix(in srgb, var(--color-texto, #1a1208) 45%, transparent)" }}
      >
        {label}
      </p>
      <p
        className="text-3xl font-black tracking-tight leading-none"
        style={{ color: accent ? "#fff" : "var(--color-texto, #1a1208)" }}
      >
        {value}
      </p>
      {hint && (
        <p
          className="mt-2 text-xs"
          style={{ color: accent ? "rgba(255,255,255,0.60)" : "color-mix(in srgb, var(--color-texto, #1a1208) 35%, transparent)" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
