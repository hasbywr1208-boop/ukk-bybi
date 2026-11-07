import type { ReactNode } from "react";

import type { PurchaseStatus } from "./dashboard-data";

export const statusStyles: Record<PurchaseStatus, string> = {
  Selesai: "bg-emerald-500/10 text-emerald-400",
  Diproses: "bg-amber-500/10 text-amber-400",
  Dibatalkan: "bg-rose-500/10 text-rose-400",
};

export function Card({
  title,
  icon,
  action,
  children,
  className = "",
}: {
  title: string;
  icon: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-white/5 bg-[#121422] p-5 sm:p-6 ${className}`}
    >
      <header className="flex items-center gap-2.5">
        <span className="text-purple-400">{icon}</span>
        <h2 className="text-base font-semibold">{title}</h2>
        {action ? <div className="ml-auto">{action}</div> : null}
      </header>
      {children}
    </section>
  );
}

const QR_SIZE = 21;

function buildQrCells(seed: number): boolean[] {
  const cells: boolean[] = [];
  let value = seed;

  const next = () => {
    value = (value * 1103515245 + 12345) % 2147483648;
    return value / 2147483648;
  };

  const inFinder = (row: number, col: number) => {
    const zones: [number, number][] = [
      [0, 0],
      [0, QR_SIZE - 7],
      [QR_SIZE - 7, 0],
    ];
    return zones.some(([r, c]) => row >= r && row < r + 7 && col >= c && col < c + 7);
  };

  for (let row = 0; row < QR_SIZE; row += 1) {
    for (let col = 0; col < QR_SIZE; col += 1) {
      if (inFinder(row, col)) {
        const finderOrigins: [number, number][] = [
          [0, 0],
          [0, QR_SIZE - 7],
          [QR_SIZE - 7, 0],
        ];
        const origin = finderOrigins.find(
          ([r, c]) => row >= r && row < r + 7 && col >= c && col < c + 7,
        )!;
        const ring = Math.max(Math.abs(row - origin[0] - 3), Math.abs(col - origin[1] - 3));
        cells.push(ring !== 2);
        continue;
      }
      cells.push(next() > 0.52);
    }
  }

  return cells;
}

export function QrBlock({ value, label }: { value: string; label: string }) {
  const cells = buildQrCells(13);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-lg border border-white/10 bg-white p-2">
        <svg
          width={84}
          height={84}
          viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
          role="img"
          aria-label={label}
          shapeRendering="crispEdges"
        >
          {cells.map((filled, index) =>
            filled ? (
              <rect
                key={index}
                x={index % QR_SIZE}
                y={Math.floor(index / QR_SIZE)}
                width={1}
                height={1}
                fill="#0b0d18"
              />
            ) : null,
          )}
        </svg>
      </div>
      <p className="text-[11px] font-medium tracking-wider text-slate-500">{value}</p>
    </div>
  );
}