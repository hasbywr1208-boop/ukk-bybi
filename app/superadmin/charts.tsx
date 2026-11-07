import type { ChartPoint, ShareItem } from "./superadmin-data";
import { ProgressBar } from "./ui";

export function BarChart({
  data,
  color = "#8b5cf6",
  formatValue,
  height = "h-56",
}: {
  data: ChartPoint[];
  color?: string;
  formatValue?: (value: number) => string;
  height?: string;
}) {
  const max = Math.max(...data.map((point) => point.value), 1);

  return (
    <div className={`flex items-end gap-2 sm:gap-3 ${height}`}>
      {data.map((point) => {
        const percent = Math.max(4, (point.value / max) * 100);

        return (
          <div key={point.label} className="group flex h-full flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end">
              <div
                title={formatValue ? formatValue(point.value) : String(point.value)}
                className="w-full rounded-t-md transition hover:opacity-80"
                style={{ height: `${percent}%`, backgroundColor: color }}
              />
            </div>
            <span className="text-[10px] text-slate-500">{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function HorizontalBreakdown({ items }: { items: ShareItem[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
            <span className="font-medium text-slate-400">{item.value}%</span>
          </div>
          <ProgressBar value={item.value} color={item.color} />
        </div>
      ))}
    </div>
  );
}

export function DonutChart({
  items,
  centerLabel,
  centerValue,
}: {
  items: ShareItem[];
  centerLabel: string;
  centerValue: string;
}) {
  const stops = items
    .map((item, index) => {
      const start = items
        .slice(0, index)
        .reduce((sum, previous) => sum + previous.value, 0);
      return `${item.color} ${start}% ${start + item.value}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <div
        className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
        style={{ background: `conic-gradient(${stops})` }}
        role="img"
        aria-label={items.map((item) => `${item.label} ${item.value}%`).join(", ")}
      >
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#0f1320]">
          <span className="text-xl font-bold">{centerValue}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            {centerLabel}
          </span>
        </div>
      </div>

      <ul className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="text-slate-300">{item.label}</span>
            <span className="ml-auto font-medium text-slate-500">{item.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
