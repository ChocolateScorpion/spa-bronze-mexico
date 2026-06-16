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
  const max = Math.max(...items.map((item) => item.value), 1);
  const format = formatValue ?? ((value: number) => String(value));

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">Sin datos disponibles.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium capitalize text-gray-700">{item.label}</span>
                <span className="text-gray-500">{format(item.value)}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-[var(--color-primary)]"
                  style={{ width: `${(item.value / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
