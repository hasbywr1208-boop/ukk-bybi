"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { api } from "@/lib/api";
import { OrganizerIcon } from "./icons";

type OrganizerNotification = {
  id: string;
  text: string;
  time: string;
  unread: boolean;
  tone: "info" | "warning" | "success";
};

const toneStyles: Record<OrganizerNotification["tone"], string> = {
  info: "bg-sky-500/15 text-sky-300",
  warning: "bg-amber-500/15 text-amber-300",
  success: "bg-emerald-500/15 text-emerald-300",
};

const toneIcons: Record<OrganizerNotification["tone"], "activity" | "alert" | "check"> = {
  info: "activity",
  warning: "alert",
  success: "check",
};

export function OrganizerNotifications() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<OrganizerNotification[]>([]);

  const unread = useMemo(() => items.filter((item) => item.unread).length, [items]);

  useEffect(() => {
    let active = true;
    api
      .get<OrganizerNotification[]>("/notifications")
      .then((data) => {
        if (active) setItems(data ?? []);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, []);

  async function markAllRead() {
    setItems((current) => current.map((item) => ({ ...item, unread: false })));
    try {
      await api.patch("/notifications/read-all");
    } catch {
      // biarkan tampilan optimistis
    }
  }

  async function markRead(id: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    );
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      // biarkan tampilan optimistis
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={unread > 0 ? `Notifikasi, ${unread} belum dibaca` : "Notifikasi"}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-white/5 bg-[#0f1320] text-slate-400 transition hover:border-purple-500/40 hover:text-white"
      >
        <OrganizerIcon name="bell" className="h-5 w-5" />
        {unread > 0 ? (
          <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#0f1320]">
            {unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Tutup notifikasi"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div
            role="dialog"
            aria-label="Daftar notifikasi"
            className="absolute right-0 z-50 mt-2 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#0f1320] shadow-2xl shadow-black/60"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Notifikasi</p>
                <p className="text-[11px] text-slate-500">
                  {unread > 0 ? `${unread} belum dibaca` : "Semua sudah dibaca"}
                </p>
              </div>
              <button
                type="button"
                onClick={markAllRead}
                disabled={unread === 0}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-fuchsia-300 transition hover:bg-fuchsia-500/10 disabled:cursor-not-allowed disabled:text-slate-600"
              >
                <OrganizerIcon name="check" className="h-3.5 w-3.5" />
                Tandai semua
              </button>
            </div>

            <ul className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <li className="px-4 py-6 text-center text-xs text-slate-500">
                  Belum ada notifikasi.
                </li>
              ) : null}
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => markRead(item.id)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-white/[0.04]"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneStyles[item.tone]}`}
                    >
                      <OrganizerIcon name={toneIcons[item.tone]} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-xs leading-relaxed ${
                          item.unread ? "font-medium text-white" : "text-slate-400"
                        }`}
                      >
                        {item.text}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">{item.time}</span>
                    </span>
                    {item.unread ? (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-fuchsia-400" />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-white/5 p-2">
              <Link
                href="/organizer/orders"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-center text-xs font-medium text-fuchsia-300 transition hover:bg-fuchsia-500/10"
              >
                Buka pesanan terbaru
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
