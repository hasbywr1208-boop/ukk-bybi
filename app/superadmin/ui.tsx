import type { ReactNode } from "react";

import type {
  AdminRole,
  ConcertStatus,
  OrganizerStatus,
  PaymentStatus,
  UserStatus,
} from "./superadmin-data";

export const userStatusStyles: Record<UserStatus, string> = {
  Aktif: "bg-emerald-500/10 text-emerald-400",
  Nonaktif: "bg-slate-500/10 text-slate-400",
  Ditangguhkan: "bg-rose-500/10 text-rose-400",
};

export const roleStyles: Record<AdminRole, string> = {
  User: "bg-sky-500/10 text-sky-300",
  Organizer: "bg-amber-500/10 text-amber-300",
  Superadmin: "bg-purple-500/10 text-purple-300",
};

export const organizerStatusStyles: Record<OrganizerStatus, string> = {
  Menunggu: "bg-amber-500/10 text-amber-400",
  Terverifikasi: "bg-emerald-500/10 text-emerald-400",
  Ditolak: "bg-rose-500/10 text-rose-400",
};

export const concertStatusStyles: Record<ConcertStatus, string> = {
  Aktif: "bg-emerald-500/10 text-emerald-400",
  Menunggu: "bg-amber-500/10 text-amber-400",
  Selesai: "bg-sky-500/10 text-sky-300",
  Dibatalkan: "bg-rose-500/10 text-rose-400",
};

export const paymentStatusStyles: Record<PaymentStatus, string> = {
  Berhasil: "bg-emerald-500/10 text-emerald-400",
  Menunggu: "bg-amber-500/10 text-amber-400",
  Gagal: "bg-rose-500/10 text-rose-400",
  Refund: "bg-sky-500/10 text-sky-300",
};

export function Pill({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${className}`}
    >
      {children}
    </span>
  );
}

export function Card({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-white/5 bg-[#0f1320] p-5 ${className}`}>
      {title ? (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">{title}</h2>
            {description ? <p className="mt-0.5 text-xs text-slate-500">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

const statTones = {
  purple: "bg-purple-600/15 text-purple-300",
  emerald: "bg-emerald-500/15 text-emerald-300",
  amber: "bg-amber-500/15 text-amber-300",
  sky: "bg-sky-500/15 text-sky-300",
  rose: "bg-rose-500/15 text-rose-300",
  indigo: "bg-indigo-500/15 text-indigo-300",
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "purple",
  trend,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
  tone?: keyof typeof statTones;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0f1320] p-4 transition hover:border-purple-500/30">
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${statTones[tone]}`}>
          {icon}
        </span>
        {trend ? (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              trend.positive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {trend.positive ? "+" : ""}
            {trend.value}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-xl font-bold">{value}</p>
      <p className="mt-0.5 truncate text-[11px] text-slate-500">{hint}</p>
    </div>
  );
}

export function ProgressBar({
  value,
  color = "#8b5cf6",
  className = "",
}: {
  value: number;
  color?: string;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-white/10 ${className}`}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#0f1320] px-6 py-14 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/15 text-purple-300">
        {icon}
      </span>
      <p className="mt-4 text-sm font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">{description}</p>
    </div>
  );
}
