"use client";

import { useEffect, useState } from "react";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

function getRemaining(target: number, now: number): Remaining {
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
    isPast: false,
  };
}

export function useCountdown(target: string) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const targetTime = new Date(target).getTime();

    const tick = () => setRemaining(getRemaining(targetTime, Date.now()));
    tick();

    const timer = setInterval(tick, SECOND);
    return () => clearInterval(timer);
  }, [target]);

  return remaining;
}

function TimeBlock({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center rounded-lg border border-white/5 bg-[#0f1122] py-2">
      <span className="text-lg font-bold tabular-nums text-white">
        {value === null ? "--" : String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ target }: { target: string }) {
  const remaining = useCountdown(target);

  if (remaining?.isPast) {
    return (
      <p className="rounded-lg border border-white/5 bg-[#0f1122] px-3 py-2 text-xs text-slate-400">
        Acara sudah berlangsung.
      </p>
    );
  }

  return (
    <div className="flex gap-2">
      <TimeBlock value={remaining?.days ?? null} label="Hari" />
      <TimeBlock value={remaining?.hours ?? null} label="Jam" />
      <TimeBlock value={remaining?.minutes ?? null} label="Menit" />
      <TimeBlock value={remaining?.seconds ?? null} label="Detik" />
    </div>
  );
}

export function CountdownBadge({ target }: { target: string }) {
  const remaining = useCountdown(target);

  if (remaining === null) {
    return (
      <span className="rounded-full bg-purple-600/15 px-3 py-1 text-xs font-medium text-purple-300">
        Menghitung...
      </span>
    );
  }

  return (
    <span className="rounded-full bg-purple-600/15 px-3 py-1 text-xs font-medium text-purple-300">
      {remaining.isPast ? "Sudah berlangsung" : `${remaining.days} hari lagi`}
    </span>
  );
}