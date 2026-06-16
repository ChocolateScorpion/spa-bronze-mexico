type BreakdownItem = {
  label: string;
  value: number;
};

type BreakdownProps = {
  title: string;
  items: BreakdownItem[];
  formatValue?: (value: number) => string;
};

export default function Breakdown({ title, items, formatValue }: BreakdownProps) {
  const max = Math.max(...items.map((i) => i.value), 1);
  const total = items.reduce((sum, i) => sum + i.value, 0);
  const format = formatValue ?? ((v: number) => String(v));

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-gray-900">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">Sin datos disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => {
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
            const width = (item.value / max) * 100;
            const showInnerLabel = width > 28;
            return (
              <li key={item.label}>
                <div className="mb-1.5 flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium capitalize text-gray-800">{item.label}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      {pct}%
                    </span>
                    <span className="font-semibold text-gray-900">{format(item.value)}</span>
                  </div>
                </div>
                <div className="relative h-8 w-full overflow-hidden rounded-lg bg-gray-50">
                  <div
                    className="flex h-full items-center rounded-lg transition-all duration-500"
                    style={{
                      width: `${width}%`,
                      background:
                        "linear-gradient(90deg, var(--color-primary) 0%, var(--color-acento, var(--color-primary)) 100%)",
                    }}
                  >
                    {showInnerLabel && (
                      <span className="truncate pl-3 text-xs font-medium text-white capitalize">
                        {item.label}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
