"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";
import { OrganizerIcon } from "../icons";
import type {
  OrganizerConcert,
  TicketType,
  TicketTypeStatus,
} from "../organizer-data";
import {
  Card,
  Pill,
  ProgressBar,
  StatCard,
  ticketStatusStyles,
} from "../ui";
import { formatCompactRupiah, formatNumber, formatRupiah } from "../utils";

type TicketFormStatus = "Aktif" | "Nonaktif";

type TicketForm = {
  id: string;
  concertId: string;
  name: string;
  description: string;
  price: string;
  quota: string;
  status: TicketFormStatus;
};

type RawTicket = {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  price: string | number;
  quantity: number;
  sold: number;
  max_per_order: number;
  color: string | null;
  is_active: number;
};

const palette = ["#8b5cf6", "#22d3ee", "#f472b6", "#f59e0b", "#34d399", "#a78bfa"];

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#070910] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60";

function viewerStatus(ticket: RawTicket): TicketTypeStatus {
  if (Number(ticket.sold) >= Number(ticket.quantity)) return "Habis";
  return Number(ticket.is_active) === 1 ? "Aktif" : "Nonaktif";
}

function mapTicket(
  row: RawTicket,
  concertList: OrganizerConcert[],
  index: number,
): TicketType {
  const target = concertList.find((item) => item.id === row.event_id);
  return {
    id: row.id,
    concertId: row.event_id,
    concert: target?.title ?? "-",
    name: row.name,
    description: row.description ?? "",
    price: Number(row.price),
    quota: Number(row.quantity),
    sold: Number(row.sold),
    status: viewerStatus(row),
    color: row.color || palette[index % palette.length],
  };
}

function emptyForm(concertId: string): TicketForm {
  return {
    id: "",
    concertId,
    name: "",
    description: "",
    price: "500000",
    quota: "1000",
    status: "Nonaktif",
  };
}

export function TicketManager() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [concerts, setConcerts] = useState<OrganizerConcert[]>([]);
  const [concertId, setConcertId] = useState("");
  const [form, setForm] = useState<TicketForm | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadTickets = useCallback(async (eventId: string, concertList: OrganizerConcert[]) => {
    const rows = await api.get<RawTicket[]>(`/tickets/event/${eventId}`);
    return (rows ?? []).map((row, index) => mapTicket(row, concertList, index));
  }, []);

  useEffect(() => {
    let active = true;
    api
      .get<OrganizerConcert[]>("/organizer/concerts")
      .then((rows) => {
        if (!active) return;
        const list = rows ?? [];
        setConcerts(list);
        setConcertId((current) => current || list[0]?.id || "");
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Gagal memuat daftar konser.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!concertId) return;
    let active = true;
    setLoading(true);
    loadTickets(concertId, concerts)
      .then((rows) => {
        if (active) setTickets(rows);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Gagal memuat tipe tiket.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [concertId, concerts, loadTickets]);

  const concert = concerts.find((item) => item.id === concertId);
  const concertTickets = useMemo(
    () => tickets.filter((ticket) => ticket.concertId === concertId),
    [tickets, concertId],
  );

  const totalQuota = concertTickets.reduce((sum, ticket) => sum + ticket.quota, 0);
  const totalSold = concertTickets.reduce((sum, ticket) => sum + ticket.sold, 0);
  const totalRevenue = concertTickets.reduce(
    (sum, ticket) => sum + ticket.sold * ticket.price,
    0,
  );
  const available = Math.max(0, totalQuota - totalSold);

  function openCreate() {
    if (!concertId) return;
    setError(null);
    setForm(emptyForm(concertId));
  }

  function openEdit(ticket: TicketType) {
    setError(null);
    setForm({
      id: ticket.id,
      concertId: ticket.concertId,
      name: ticket.name,
      description: ticket.description,
      price: String(ticket.price),
      quota: String(ticket.quota),
      status: ticket.status === "Aktif" ? "Aktif" : "Nonaktif",
    });
  }

  function updateForm<K extends keyof TicketForm>(key: K, value: TicketForm[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  async function reload(targetConcertId: string) {
    const rows = await loadTickets(targetConcertId, concerts);
    setTickets(rows);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    const price = Math.max(0, Number(form.price) || 0);
    const quota = Math.max(1, Number(form.quota) || 1);

    setSaving(true);
    setError(null);
    try {
      if (form.id) {
        await api.put(`/tickets/${form.id}`, {
          name: form.name,
          description: form.description,
          price,
          quantity: quota,
          is_active: form.status === "Aktif" ? 1 : 0,
        });
        setNotice(`Tipe tiket ${form.name} berhasil diperbarui.`);
        await reload(form.concertId);
      } else {
        await api.post(`/tickets/event/${form.concertId}`, {
          name: form.name,
          description: form.description,
          price,
          quantity: quota,
          benefits: [],
        });
        setNotice(`Tipe tiket ${form.name} berhasil ditambahkan.`);
        if (form.concertId !== concertId) {
          setConcertId(form.concertId);
        } else {
          await reload(form.concertId);
        }
      }
      setForm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan tipe tiket.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(ticket: TicketType) {
    const nextActive = ticket.status !== "Aktif";
    const previous = tickets;

    setTickets((current) =>
      current.map((item) =>
        item.id === ticket.id
          ? { ...item, status: nextActive ? "Aktif" : "Nonaktif" }
          : item,
      ),
    );

    setError(null);
    try {
      await api.put(`/tickets/${ticket.id}`, { is_active: nextActive ? 1 : 0 });
      setNotice(
        `${ticket.name} ${nextActive ? "diaktifkan" : "dinonaktifkan"}.`,
      );
      await reload(ticket.concertId);
    } catch (err) {
      setTickets(previous);
      setError(err instanceof Error ? err.message : "Gagal mengubah status tiket.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Kuota"
          value={formatNumber(totalQuota)}
          hint={`${concertTickets.length} tipe tiket`}
          icon={<OrganizerIcon name="ticket" className="h-5 w-5" />}
          tone="purple"
        />
        <StatCard
          label="Terjual"
          value={formatNumber(totalSold)}
          hint={`${totalQuota > 0 ? Math.round((totalSold / totalQuota) * 100) : 0}% dari kuota`}
          icon={<OrganizerIcon name="trendUp" className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Tersedia"
          value={formatNumber(available)}
          hint="Siap dijual"
          icon={<OrganizerIcon name="tag" className="h-5 w-5" />}
          tone="sky"
        />
        <StatCard
          label="Pendapatan"
          value={formatCompactRupiah(totalRevenue)}
          hint={concert?.title ?? "-"}
          icon={<OrganizerIcon name="wallet" className="h-5 w-5" />}
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold">Daftar Tipe Tiket</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Atur harga, kuota, dan status penjualan tiket.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <span className="sr-only">Pilih konser</span>
              <select
                value={concertId}
                onChange={(event) => setConcertId(event.target.value)}
                className="appearance-none rounded-lg border border-white/10 bg-[#070910] py-2 pl-3 pr-8 text-xs text-slate-300 outline-none transition focus:border-purple-500/60"
              >
                {concerts.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
              <OrganizerIcon
                name="chevronRight"
                className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-slate-500"
              />
            </label>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-purple-500"
            >
              <OrganizerIcon name="plus" className="h-3.5 w-3.5" />
              Tambah Tipe
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="pb-3 font-medium">Tipe Tiket</th>
                <th className="pb-3 font-medium">Harga</th>
                <th className="pb-3 font-medium">Kuota</th>
                <th className="pb-3 font-medium">Terjual</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                    Memuat tipe tiket...
                  </td>
                </tr>
              ) : null}
              {concertTickets.map((ticket) => {
                const percent = Math.round((ticket.sold / ticket.quota) * 100);

                return (
                  <tr key={ticket.id} className="transition hover:bg-white/[0.02]">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-9 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: ticket.color }}
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-white">{ticket.name}</p>
                          <p className="truncate text-[11px] text-slate-500">
                            {ticket.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs font-medium text-slate-200">
                      {formatRupiah(ticket.price)}
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-400">
                      {formatNumber(ticket.quota)}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="w-36">
                        <div className="mb-1 flex items-center justify-between text-[10px]">
                          <span className="text-slate-300">{formatNumber(ticket.sold)}</span>
                          <span className="text-slate-500">{percent}%</span>
                        </div>
                        <ProgressBar value={percent} color={ticket.color} />
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Pill className={ticketStatusStyles[ticket.status]}>{ticket.status}</Pill>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(ticket)}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1.5 text-[10px] font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white"
                        >
                          <OrganizerIcon name="edit" className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStatus(ticket)}
                          className={`rounded-lg px-2 py-1.5 text-[10px] font-semibold transition ${
                            ticket.status === "Aktif"
                              ? "bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                          }`}
                        >
                          {ticket.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!loading && concertTickets.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
            <p className="text-sm font-medium text-slate-300">Belum ada tipe tiket</p>
            <p className="mt-1 text-xs text-slate-500">
              Tambahkan tipe tiket pertama untuk konser ini.
            </p>
          </div>
        ) : null}
      </Card>

      {form ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Tutup form tiket"
            onClick={() => setForm(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={form.id ? "Edit tipe tiket" : "Tambah tipe tiket"}
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#0f1320] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/5 p-5">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500">
                  Ticket management
                </p>
                <p className="mt-0.5 font-semibold">
                  {form.id ? "Edit tipe tiket" : "Tambah tipe tiket"}
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
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Konser</span>
                <select
                  value={form.concertId}
                  disabled={Boolean(form.id)}
                  onChange={(event) => updateForm("concertId", event.target.value)}
                  className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {concerts.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Nama tipe
                  </span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    placeholder="Contoh: VIP"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">Harga</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                      Rp
                    </span>
                    <input
                      required
                      type="number"
                      min="0"
                      step="10000"
                      value={form.price}
                      onChange={(event) => updateForm("price", event.target.value)}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">Kuota</span>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.quota}
                    onChange={(event) => updateForm("quota", event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">Status</span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value as TicketFormStatus)
                    }
                    className={inputClass}
                  >
                    <option value="Nonaktif">Nonaktif</option>
                    <option value="Aktif">Aktif</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">
                  Deskripsi
                </span>
                <input
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  placeholder="Fasilitas atau keterangan tiket"
                  className={inputClass}
                />
              </label>

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
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <OrganizerIcon name="check" className="h-4 w-4" />
                  {saving
                    ? "Menyimpan..."
                    : form.id
                      ? "Simpan Perubahan"
                      : "Tambah Tiket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
