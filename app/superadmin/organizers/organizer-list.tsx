"use client";

import { useMemo, useState } from "react";

import { AdminIcon } from "../icons";
import {
  organizers as initialOrganizers,
  type Organizer,
  type OrganizerStatus,
} from "../superadmin-data";
import { Card, EmptyState, Pill, StatCard, organizerStatusStyles } from "../ui";

type TabFilter = "Menunggu" | "Terverifikasi" | "Ditolak" | "Semua";

const tabs: TabFilter[] = ["Menunggu", "Terverifikasi", "Ditolak", "Semua"];

export function OrganizerList() {
  const [items, setItems] = useState<Organizer[]>(initialOrganizers);
  const [tab, setTab] = useState<TabFilter>("Menunggu");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  const counts = useMemo(
    () => ({
      Menunggu: items.filter((item) => item.status === "Menunggu").length,
      Terverifikasi: items.filter((item) => item.status === "Terverifikasi").length,
      Ditolak: items.filter((item) => item.status === "Ditolak").length,
      Semua: items.length,
    }),
    [items],
  );

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesTab = tab === "Semua" || item.status === tab;
      const matchesQuery =
        keyword.length === 0 ||
        [item.name, item.contact, item.email, item.city, item.id].some((value) =>
          value.toLowerCase().includes(keyword),
        );

      return matchesTab && matchesQuery;
    });
  }, [items, tab, query]);

  function updateStatus(organizer: Organizer, status: OrganizerStatus) {
    setItems((current) =>
      current.map((item) => (item.id === organizer.id ? { ...item, status } : item)),
    );
    setNotice(
      status === "Terverifikasi"
        ? `${organizer.name} berhasil diverifikasi.`
        : `${organizer.name} ditolak. Organizer dapat mengajukan ulang.`,
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Menunggu Verifikasi"
          value={String(counts.Menunggu)}
          hint="Perlu ditinjau hari ini"
          icon={<AdminIcon name="clock" className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          label="Terverifikasi"
          value={String(counts.Terverifikasi)}
          hint="Mitra aktif di platform"
          icon={<AdminIcon name="shield" className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Ditolak"
          value={String(counts.Ditolak)}
          hint="Dokumen tidak memenuhi syarat"
          icon={<AdminIcon name="ban" className="h-5 w-5" />}
          tone="rose"
        />
      </div>

      {notice ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-xs text-purple-200">
          <span className="flex items-center gap-2">
            <AdminIcon name="check" className="h-4 w-4" />
            {notice}
          </span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Tutup pemberitahuan"
            className="text-purple-300/70 transition hover:text-purple-200"
          >
            <AdminIcon name="close" className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  tab === item
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item}
                <span
                  className={`rounded-full px-1.5 text-[10px] ${
                    tab === item ? "bg-white/20" : "bg-white/10 text-slate-400"
                  }`}
                >
                  {counts[item]}
                </span>
              </button>
            ))}

            <label className="relative ml-auto min-w-0 flex-1 sm:max-w-xs">
              <span className="sr-only">Cari organizer</span>
              <AdminIcon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari organizer atau kontak..."
                className="w-full rounded-lg border border-white/10 bg-[#070910] py-2 pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60"
              />
            </label>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<AdminIcon name="shield" className="h-5 w-5" />}
              title="Tidak ada organizer di kategori ini"
              description="Semua pengajuan pada kategori ini sudah ditinjau. Coba pilih tab lain atau ubah kata kunci pencarian."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((organizer) => (
                <article
                  key={organizer.id}
                  className="flex flex-col rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-purple-500/25"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/40 to-indigo-500/20 text-xs font-bold text-purple-200">
                        {organizer.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{organizer.name}</p>
                        <p className="truncate text-[11px] text-slate-500">
                          {organizer.category}
                        </p>
                      </div>
                    </div>
                    <Pill className={organizerStatusStyles[organizer.status]}>
                      {organizer.status}
                    </Pill>
                  </div>

                  <dl className="mt-4 space-y-2 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-400">
                      <AdminIcon name="user" className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                      <dt className="sr-only">Kontak</dt>
                      <dd className="truncate">{organizer.contact}</dd>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <AdminIcon name="mail" className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                      <dt className="sr-only">Email</dt>
                      <dd className="truncate">{organizer.email}</dd>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <AdminIcon name="phone" className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                      <dt className="sr-only">Telepon</dt>
                      <dd className="truncate">{organizer.phone}</dd>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <AdminIcon name="mapPin" className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                      <dt className="sr-only">Kota</dt>
                      <dd className="truncate">{organizer.city}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="rounded-lg bg-white/[0.03] px-2 py-2">
                      <p className="font-semibold text-white">{organizer.documents}</p>
                      <p className="text-slate-500">Dokumen</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] px-2 py-2">
                      <p className="font-semibold text-white">{organizer.events}</p>
                      <p className="text-slate-500">Event</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] px-2 py-2">
                      <p className="truncate font-semibold text-white">{organizer.submittedAt}</p>
                      <p className="text-slate-500">Diajukan</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-1 items-end gap-2">
                    {organizer.status === "Menunggu" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => updateStatus(organizer, "Ditolak")}
                          className="flex-1 rounded-lg border border-rose-500/30 px-3 py-2 text-[11px] font-semibold text-rose-300 transition hover:bg-rose-500/10"
                        >
                          Tolak
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(organizer, "Terverifikasi")}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-emerald-500"
                        >
                          <AdminIcon name="check" className="h-3.5 w-3.5" />
                          Verifikasi
                        </button>
                      </>
                    ) : organizer.status === "Ditolak" ? (
                      <button
                        type="button"
                        onClick={() => updateStatus(organizer, "Menunggu")}
                        className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-[11px] font-semibold text-slate-300 transition hover:border-purple-500/40 hover:text-white"
                      >
                        Tinjau ulang
                      </button>
                    ) : (
                      <div className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[11px] font-medium text-emerald-300">
                        <AdminIcon name="shield" className="h-3.5 w-3.5" />
                        Mitra terverifikasi
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
