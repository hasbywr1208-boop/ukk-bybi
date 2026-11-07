"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { api } from "@/lib/api";
import { OrganizerIcon } from "../icons";
import {
  type OrganizerConcert,
  type OrganizerConcertStatus,
} from "../organizer-data";
import {
  Card,
  Pill,
  ProgressBar,
  StatCard,
  concertStatusStyles,
} from "../ui";
import { formatCompactRupiah, formatNumber } from "../utils";

type StatusFilter = "Semua" | OrganizerConcertStatus;

type Category = { id: string; name: string };

type EventDetail = {
  id: string;
  title: string;
  description: string;
  venue: string;
  location: string;
  city: string;
  date: string;
  start_time: string;
  end_time: string;
  category_id: string;
  poster_url: string | null;
  status: "draft" | "published" | "cancelled" | "completed";
};

type ConcertForm = {
  id: string;
  title: string;
  description: string;
  venue: string;
  location: string;
  city: string;
  categoryId: string;
  dateISO: string;
  startTime: string;
  endTime: string;
  status: OrganizerConcertStatus;
};

const statusFilters: StatusFilter[] = ["Semua", "Aktif", "Draft", "Selesai", "Dibatalkan"];

const emptyForm: ConcertForm = {
  id: "",
  title: "",
  description: "",
  venue: "",
  location: "",
  city: "",
  categoryId: "",
  dateISO: "2027-01-01",
  startTime: "19:00",
  endTime: "22:00",
  status: "Draft",
};

const statusToRaw: Record<OrganizerConcertStatus, EventDetail["status"]> = {
  Aktif: "published",
  Draft: "draft",
  Selesai: "completed",
  Dibatalkan: "cancelled",
};

const rawToStatus: Record<EventDetail["status"], OrganizerConcertStatus> = {
  published: "Aktif",
  draft: "Draft",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#070910] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60";

function formatDateID(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function posterForCategory(category: string) {
  if (category === "K-Pop") return "/posters/ariana.svg";
  if (category === "Jazz") return "/posters/niki.svg";
  if (category === "Indie") return "/posters/lany.svg";
  return "/posters/coldplay.svg";
}

export function ConcertManager() {
  const [concerts, setConcerts] = useState<OrganizerConcert[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [details, setDetails] = useState<Record<string, EventDetail>>({});
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [form, setForm] = useState<ConcertForm | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [concertRows, categoryRows, eventRows] = await Promise.all([
      api.get<OrganizerConcert[]>("/organizer/concerts"),
      api.get<Category[]>("/categories", { anonymous: true }),
      api.get<EventDetail[]>("/events/mine"),
    ]);

    setConcerts(concertRows ?? []);
    setCategories(categoryRows ?? []);
    setDetails(
      Object.fromEntries((eventRows ?? []).map((event) => [event.id, event])),
    );
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    load()
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Gagal memuat konser.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [load]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return concerts.filter((concert) => {
      const matchesStatus = statusFilter === "Semua" || concert.status === statusFilter;
      const matchesQuery =
        keyword.length === 0 ||
        [concert.title, concert.venue, concert.city, concert.category].some((value) =>
          value.toLowerCase().includes(keyword),
        );

      return matchesStatus && matchesQuery;
    });
  }, [concerts, query, statusFilter]);

  const totalRevenue = concerts.reduce((sum, item) => sum + item.revenue, 0);
  const totalTickets = concerts.reduce((sum, item) => sum + item.ticketsSold, 0);

  function openCreate() {
    setError(null);
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id ?? "",
    });
  }

  function openEdit(concert: OrganizerConcert) {
    const detail = details[concert.id];
    setError(null);
    setForm({
      id: concert.id,
      title: detail?.title ?? concert.title,
      description: detail?.description ?? "",
      venue: detail?.venue ?? concert.venue,
      location: detail?.location ?? "",
      city: detail?.city ?? concert.city,
      categoryId: detail?.category_id ?? "",
      dateISO: detail?.date ? String(detail.date).slice(0, 10) : concert.dateISO,
      startTime: detail?.start_time ? String(detail.start_time).slice(0, 5) : "19:00",
      endTime: detail?.end_time ? String(detail.end_time).slice(0, 5) : "22:00",
      status: detail ? rawToStatus[detail.status] : concert.status,
    });
  }

  function updateForm<K extends keyof ConcertForm>(key: K, value: ConcertForm[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    if (!form.categoryId) {
      setError("Pilih kategori konser terlebih dahulu.");
      return;
    }
    if (!form.description.trim()) {
      setError("Deskripsi konser wajib diisi.");
      return;
    }

    const payload = {
      category_id: form.categoryId,
      title: form.title.trim(),
      description: form.description.trim(),
      venue: form.venue.trim(),
      location: form.location.trim() || form.venue.trim(),
      city: form.city.trim(),
      date: form.dateISO,
      start_time: form.startTime,
      end_time: form.endTime,
      poster_url: posterForCategory(
        categories.find((category) => category.id === form.categoryId)?.name ?? "",
      ),
    };

    setSaving(true);
    setError(null);
    try {
      let eventId = form.id;

      if (form.id) {
        await api.put(`/events/${form.id}`, payload);
        const current = details[form.id];
        if (!current || current.status !== statusToRaw[form.status]) {
          await api.patch(`/events/${form.id}/status`, {
            status: statusToRaw[form.status],
          });
        }
        setNotice(`${form.title} berhasil diperbarui.`);
      } else {
        const created = await api.post<{ id: string }>("/events", payload);
        eventId = created?.id ?? "";
        if (eventId && form.status !== "Draft") {
          await api.patch(`/events/${eventId}/status`, {
            status: statusToRaw[form.status],
          });
        }
        setNotice(`${form.title} berhasil dibuat sebagai ${form.status}.`);
      }

      await load();
      setForm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan konser.");
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(concert: OrganizerConcert, status: OrganizerConcertStatus) {
    const previous = concerts;
    setConcerts((current) =>
      current.map((item) => (item.id === concert.id ? { ...item, status } : item)),
    );

    const messages: Record<OrganizerConcertStatus, string> = {
      Aktif: `${concert.title} berhasil dipublikasikan.`,
      Draft: `${concert.title} dikembalikan ke draft.`,
      Selesai: `${concert.title} ditandai selesai.`,
      Dibatalkan: `${concert.title} dibatalkan.`,
    };

    try {
      await api.patch(`/events/${concert.id}/status`, {
        status: statusToRaw[status],
      });
      setNotice(messages[status]);
      await load();
    } catch (err) {
      setConcerts(previous);
      setError(err instanceof Error ? err.message : "Gagal mengubah status konser.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Konser"
          value={String(concerts.length)}
          hint={`${concerts.filter((item) => item.status === "Aktif").length} sedang aktif`}
          icon={<OrganizerIcon name="calendar" className="h-5 w-5" />}
          tone="purple"
        />
        <StatCard
          label="Tiket Terjual"
          value={formatNumber(totalTickets)}
          hint="Dari semua konser"
          icon={<OrganizerIcon name="ticket" className="h-5 w-5" />}
          tone="sky"
        />
        <StatCard
          label="Total Pendapatan"
          value={formatCompactRupiah(totalRevenue)}
          hint="Pendapatan tiket kotor"
          icon={<OrganizerIcon name="wallet" className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Draft"
          value={String(concerts.filter((item) => item.status === "Draft").length)}
          hint="Belum dipublikasikan"
          icon={<OrganizerIcon name="edit" className="h-5 w-5" />}
          tone="amber"
        />
      </div>

      {notice ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
          <span className="flex items-center gap-2">
            <OrganizerIcon name="check" className="h-4 w-4" />
            {notice}
          </span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Tutup pemberitahuan"
            className="text-emerald-300/70 transition hover:text-emerald-200"
          >
            <OrganizerIcon name="close" className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
          {error}
        </p>
      ) : null}

      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {statusFilters.map((status) => {
              const count =
                status === "Semua"
                  ? concerts.length
                  : concerts.filter((item) => item.status === status).length;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    statusFilter === status
                      ? "bg-purple-600 text-white"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {status}
                  <span
                    className={`rounded-full px-1.5 text-[10px] ${
                      statusFilter === status ? "bg-white/20" : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            <div className="ml-auto flex flex-1 flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
              <label className="relative min-w-0 flex-1 sm:max-w-56">
                <span className="sr-only">Cari konser</span>
                <OrganizerIcon
                  name="search"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari konser..."
                  className="w-full rounded-lg border border-white/10 bg-[#070910] py-2 pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60"
                />
              </label>
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-purple-500"
              >
                <OrganizerIcon name="plus" className="h-3.5 w-3.5" />
                Buat Konser
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {loading ? (
              <p className="col-span-full py-10 text-center text-sm text-slate-500">
                Memuat konser...
              </p>
            ) : null}
            {filtered.map((concert) => {
              const percent =
                concert.capacity > 0
                  ? Math.round((concert.ticketsSold / concert.capacity) * 100)
                  : 0;

              return (
                <article
                  key={concert.id}
                  className="flex flex-col rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-purple-500/25"
                >
                  <div className="flex gap-4">
                    <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={concert.poster}
                        alt={concert.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{concert.title}</p>
                          <p className="mt-0.5 truncate text-[11px] text-slate-500">
                            {concert.category} · {concert.id}
                          </p>
                        </div>
                        <Pill className={concertStatusStyles[concert.status]}>
                          {concert.status}
                        </Pill>
                      </div>
                      <div className="mt-2 space-y-1 text-[11px] text-slate-400">
                        <p className="flex items-center gap-1.5">
                          <OrganizerIcon name="mapPin" className="h-3.5 w-3.5 text-slate-600" />
                          {concert.venue}, {concert.city}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <OrganizerIcon name="calendar" className="h-3.5 w-3.5 text-slate-600" />
                          {concert.date} · {concert.time}
                        </p>
                      </div>
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">
                            {formatNumber(concert.ticketsSold)} / {formatNumber(concert.capacity)}
                          </span>
                          <span className="text-slate-500">{percent}%</span>
                        </div>
                        <ProgressBar value={percent} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/5 pt-3">
                    <div>
                      <p className="text-[10px] text-slate-500">Pendapatan</p>
                      <p className="text-xs font-semibold text-emerald-400">
                        {formatCompactRupiah(concert.revenue)}
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(concert)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white"
                      >
                        <OrganizerIcon name="edit" className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      {concert.status === "Draft" ? (
                        <button
                          type="button"
                          onClick={() => changeStatus(concert, "Aktif")}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-emerald-500"
                        >
                          <OrganizerIcon name="check" className="h-3.5 w-3.5" />
                          Publikasikan
                        </button>
                      ) : concert.status === "Aktif" ? (
                        <button
                          type="button"
                          onClick={() => changeStatus(concert, "Dibatalkan")}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 px-2.5 py-1.5 text-[11px] font-medium text-rose-300 transition hover:bg-rose-500/10"
                        >
                          <OrganizerIcon name="ban" className="h-3.5 w-3.5" />
                          Batalkan
                        </button>
                      ) : concert.status === "Dibatalkan" ? (
                        <button
                          type="button"
                          onClick={() => changeStatus(concert, "Aktif")}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
                        >
                          <OrganizerIcon name="refresh" className="h-3.5 w-3.5" />
                          Aktifkan
                        </button>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {!loading && filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
              <p className="text-sm font-medium text-slate-300">Konser tidak ditemukan</p>
              <p className="mt-1 text-xs text-slate-500">
                Ubah filter atau buat konser baru untuk memulai.
              </p>
            </div>
          ) : null}
        </div>
      </Card>

      {form ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Tutup form konser"
            onClick={() => setForm(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={form.id ? "Edit konser" : "Buat konser"}
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0f1320] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/5 p-5">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500">
                  {form.id ? "Edit konser" : "Konser baru"}
                </p>
                <p className="mt-0.5 font-semibold">
                  {form.id ? form.title : "Buat konser baru"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm(null)}
                aria-label="Tutup"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <OrganizerIcon name="close" className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">
                  Nama konser
                </span>
                <input
                  required
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="Contoh: Coldplay World Tour"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">
                  Deskripsi
                </span>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  placeholder="Ceritakan tentang konser ini..."
                  className={`${inputClass} resize-none`}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">Venue</span>
                  <input
                    required
                    value={form.venue}
                    onChange={(event) => updateForm("venue", event.target.value)}
                    placeholder="Nama venue"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">Kota</span>
                  <input
                    required
                    value={form.city}
                    onChange={(event) => updateForm("city", event.target.value)}
                    placeholder="Jakarta"
                    className={inputClass}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Alamat lengkap
                  </span>
                  <input
                    value={form.location}
                    onChange={(event) => updateForm("location", event.target.value)}
                    placeholder="Alamat venue (opsional, default nama venue)"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Tanggal
                  </span>
                  <input
                    required
                    type="date"
                    value={form.dateISO}
                    onChange={(event) => updateForm("dateISO", event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Kategori
                  </span>
                  <select
                    value={form.categoryId}
                    onChange={(event) => updateForm("categoryId", event.target.value)}
                    className={inputClass}
                  >
                    {categories.length === 0 ? (
                      <option value="">Memuat kategori...</option>
                    ) : null}
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Mulai
                  </span>
                  <input
                    required
                    type="time"
                    value={form.startTime}
                    onChange={(event) => updateForm("startTime", event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Selesai
                  </span>
                  <input
                    required
                    type="time"
                    value={form.endTime}
                    onChange={(event) => updateForm("endTime", event.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateForm("status", event.target.value as OrganizerConcertStatus)
                  }
                  className={inputClass}
                >
                  <option value="Draft">Draft</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </label>

              <p className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-[11px] text-slate-500">
                Kapasitas konser dihitung otomatis dari total kuota tiket yang kamu buat
                di menu Tiket Management.
              </p>

              <div className="flex justify-end gap-2 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => setForm(null)}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || categories.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <OrganizerIcon name="check" className="h-4 w-4" />
                  {saving
                    ? "Menyimpan..."
                    : form.id
                      ? "Simpan Perubahan"
                      : "Buat Konser"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
