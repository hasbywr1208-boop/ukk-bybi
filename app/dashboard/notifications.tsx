"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { api } from "@/lib/api";

type Notification = {
  id: string;
  text: string;
  time: string;
  unread: boolean;
};

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);

  const unread = useMemo(() => items.filter((item) => item.unread).length, [items]);

  useEffect(() => {
    let active = true;
    api
      .get<Notification[]>("/notifications")
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
        className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-white/5 bg-[#121422] text-slate-400 transition hover:border-purple-500/40 hover:text-white"
      >
        <BellIcon className="h-5 w-5" />
        {unread > 0 ? (
          <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#121422]">
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
            className="absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#121422] shadow-2xl shadow-black/60"
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
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-purple-300 transition hover:bg-purple-500/10 disabled:cursor-not-allowed disabled:text-slate-600"
              >
                <CheckIcon className="h-3.5 w-3.5" />
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
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        item.unread ? "bg-purple-400" : "bg-slate-700"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-xs leading-relaxed ${
                          item.unread ? "font-medium text-white" : "text-slate-400"
                        }`}
                      >
                        {item.text}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">
                        {item.time}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-white/5 p-2">
              <Link
                href="/dashboard/tiket-saya"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-center text-xs font-medium text-purple-300 transition hover:bg-purple-500/10"
              >
                Lihat tiket saya
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
