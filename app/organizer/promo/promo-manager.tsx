"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";
import { OrganizerIcon } from "../icons";
import type {
  OrganizerConcert,
  Promo,
  PromoStatus,
} from "../organizer-data";
import { Card, Pill, ProgressBar, StatCard, promoStatusStyles } from "../ui";
import { formatNumber, formatRupiah } from "../utils";

type StatusFilter = "Semua" | PromoStatus;

type PromoRow = Promo & {
  eventId: string | null;
  validUntilISO: string;
};

type PromoForm = {
  id: string;
  code: string;
  eventId: string;
  type: "Persentase" | "Nominal";
  value: string;
  minSpend: string;
  quota: string;
  validUntilISO: string;
  status: PromoStatus;
};

const statusFilters: StatusFilter[] = ["Semua", "Aktif", "Dijadwalkan", "Berakhir"];

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#070910] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function PromoManager() {
  const [promos, setPromos] = useState<PromoRow[]>([]);
  const [concerts, setConcerts] = useState<OrganizerConcert[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<PromoForm | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [promoRows, concertRows] = await Promise.all([
      api.get<PromoRow[]>("/organizer/promos"),
      api.get<OrganizerConcert[]>("/organizer/concerts"),
    ]);
    setPromos(promoRows ?? []);
    setConcerts(concertRows ?? []);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    load()
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Gagal memuat promo.");
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

    return promos.filter((promo) => {
      const matchesStatus = statusFilter === "Semua" || promo.status === statusFilter;
      const matchesQuery =
        keyword.length === 0 ||
        [promo.code, promo.concert, promo.type].some((value) =>
          value.toLowerCase().includes(keyword),
        );

      return matchesStatus && matchesQuery;
    });
  }, [promos, statusFilter, query]);

  const totalUsed = promos.reduce((sum, promo) => sum + promo.used, 0);
  const totalQuota = promos.reduce((sum, promo) => sum + promo.quota, 0);

  function openCreate() {
    setError(null);
    setForm({
      id: "",
      code: "",
      eventId: concerts[0]?.id ?? "",
      type: "Persentase",
      value: "10",
      minSpend: "500000",
      quota: "1000",
      validUntilISO: todayISO(),
      status: "Dijadwalkan",
    });
  }

  function openEdit(promo: PromoRow) {
    setError(null);
    setForm({
      id: promo.id,
      code: promo.code,
      eventId: promo.eventId ?? "",
      type: promo.type,
      value: String(promo.value),
      minSpend: String(promo.minSpend),
      quota: String(promo.quota),
      validUntilISO: promo.validUntilISO,
      status: promo.status,
    });
  }

  function updateForm<K extends keyof PromoForm>(key: K, value: PromoForm[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    if (!form.validUntilISO) {
      setError("Tanggal berlaku wajib diisi.");
      return;
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      event_id: form.eventId || null,
      type: form.type,
      value: Math.max(0, Number(form.value) || 0),
      min_spend: Math.max(0, Number(form.minSpend) || 0),
      quota: Math.max(1, Number(form.quota) || 1),
      valid_until: form.validUntilISO,
      status: form.status,
    };

    setSaving(true);
    setError(null);
    try {
      if (form.id) {
        await api.put(`/organizer/promos/${form.id}`, payload);
        setNotice(`Promo ${payload.code} berhasil diperbarui.`);
      } else {
        await api.post("/organizer/promos", payload);
        setNotice(`Promo ${payload.code} berhasil dibuat.`);
      }
      await load();
      setForm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan promo.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(promo: PromoRow) {
    const nextStatus: PromoStatus = promo.status === "Aktif" ? "Berakhir" : "Aktif";
    const previous = promos;

    setPromos((current) =>
      current.map((item) => (item.id === promo.id ? { ...item, status: nextStatus } : item)),
    );

    try {
      await api.put(`/organizer/promos/${promo.id}`, { status: nextStatus });
      setNotice(
        `Promo ${promo.code} ${nextStatus === "Aktif" ? "diaktifkan" : "dinonaktifkan"}.`,
      );
      await load();
    } catch (err) {
      setPromos(previous);
      setError(err instanceof Error ? err.message : "Gagal mengubah status promo.");
    }
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setNotice(`Kode ${code} disalin ke clipboard.`);
    } catch {
      setNotice(`Kode promo: ${code}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Promo Aktif"
          value={String(promos.filter((promo) => promo.status === "Aktif").length)}
          hint={`dari ${promos.length} total promo`}
          icon={<OrganizerIcon name="tag" className="h-5 w-5" />}
          tone="purple"
        />
        <StatCard
          label="Total Penggunaan"
          value={formatNumber(totalUsed)}
          hint="Kode promo terpakai"
          icon={<OrganizerIcon name="ticket" className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Sisa Kuota"
          value={formatNumber(Math.max(0, totalQuota - totalUsed))}
          hint={`dari ${formatNumber(totalQuota)} kuota`}
          icon={<OrganizerIcon name="percent" className="h-5 w-5" />}
          tone="sky"
        />
        <StatCard
          label="Berakhir"
          value={String(promos.filter((promo) => promo.status === "Berakhir").length)}
          hint="Promo tidak aktif"
          icon={<OrganizerIcon name="clock" className="h-5 w-5" />}
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
                  ? promos.length
                  : promos.filter((item) => item.status === status).length;

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
              <label className="relative min-w-0 flex-1 sm:max-w-52">
                <span className="sr-only">Cari promo</span>
                <OrganizerIcon
                  name="search"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari kode promo..."
                  className="w-full rounded-lg border border-white/10 bg-[#070910] py-2 pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60"
                />
              </label>
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-purple-500"
              >
                <OrganizerIcon name="plus" className="h-3.5 w-3.5" />
                Buat Promo
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <p className="col-span-full py-8 text-center text-xs text-slate-500">
                Memuat promo...
              </p>
            ) : null}
            {filtered.map((promo) => {
              const percent = Math.round((promo.used / promo.quota) * 100);

              return (
                <article
                  key={promo.id}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-purple-500/25"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-fuchsia-500/15 text-fuchsia-300">
                        <OrganizerIcon name="tag" className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-mono text-sm font-bold tracking-wide">{promo.code}</p>
                        <p className="max-w-36 truncate text-[10px] text-slate-500">
                          {promo.concert}
                        </p>
                      </div>
                    </div>
                    <Pill className={promoStatusStyles[promo.status]}>{promo.status}</Pill>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[10px] text-slate-500">Potongan</p>
                      <p className="text-lg font-bold text-fuchsia-300">
                        {promo.type === "Persentase"
                          ? `${promo.value}%`
                          : formatRupiah(promo.value)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500">Min. belanja</p>
                      <p className="text-xs font-medium text-slate-300">
                        {formatRupiah(promo.minSpend)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">
                        {formatNumber(promo.used)} / {formatNumber(promo.quota)} terpakai
                      </span>
                      <span className="text-slate-500">{percent}%</span>
                    </div>
                    <ProgressBar value={percent} />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Berlaku s.d. {promo.validUntil}</span>
                    <span>{promo.id}</span>
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-white/5 pt-3">
                    <button
                      type="button"
                      onClick={() => void copyCode(promo.code)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white"
                    >
                      <OrganizerIcon name="copy" className="h-3 w-3" />
                      Salin
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(promo)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white"
                    >
                      <OrganizerIcon name="edit" className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(promo)}
                      className={`ml-auto rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition ${
                        promo.status === "Aktif"
                          ? "bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                      }`}
                    >
                      {promo.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
              <p className="text-sm font-medium text-slate-300">Promo tidak ditemukan</p>
              <p className="mt-1 text-xs text-slate-500">
                Ubah filter atau buat kode promo baru.
              </p>
            </div>
          ) : null}
        </div>
      </Card>

      {form ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Tutup form promo"
            onClick={() => setForm(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={form.id ? "Edit promo" : "Buat promo"}
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#0f1320] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/5 p-5">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500">Promo</p>
                <p className="mt-0.5 font-semibold">
                  {form.id ? "Edit kode promo" : "Buat kode promo"}
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
                  Kode promo
                </span>
                <input
                  required
                  value={form.code}
                  onChange={(event) => updateForm("code", event.target.value.toUpperCase())}
                  placeholder="Contoh: EARLYBIRD10"
                  className={`${inputClass} font-mono uppercase`}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Konser</span>
                <select
                  value={form.eventId}
                  onChange={(event) => updateForm("eventId", event.target.value)}
                  className={inputClass}
                >
                  <option value="">Semua konser</option>
                  {concerts.map((concert) => (
                    <option key={concert.id} value={concert.id}>
                      {concert.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Tipe potongan
                  </span>
                  <select
                    value={form.type}
                    onChange={(event) =>
                      updateForm("type", event.target.value as PromoForm["type"])
                    }
                    className={inputClass}
                  >
                    <option value="Persentase">Persentase</option>
                    <option value="Nominal">Nominal</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Nilai potongan
                  </span>
                  <div className="relative">
                    {form.type === "Nominal" ? (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                        Rp
                      </span>
                    ) : null}
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.value}
                      onChange={(event) => updateForm("value", event.target.value)}
                      className={`${inputClass} ${form.type === "Nominal" ? "pl-9" : "pr-9"}`}
                    />
                    {form.type === "Persentase" ? (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                        %
                      </span>
                    ) : null}
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Min. belanja
                  </span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                      Rp
                    </span>
                    <input
                      required
                      type="number"
                      min="0"
                      step="50000"
                      value={form.minSpend}
                      onChange={(event) => updateForm("minSpend", event.target.value)}
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
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Berlaku sampai
                  </span>
                  <input
                    required
                    type="date"
                    value={form.validUntilISO}
                    onChange={(event) => updateForm("validUntilISO", event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">Status</span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value as PromoStatus)
                    }
                    className={inputClass}
                  >
                    <option value="Dijadwalkan">Dijadwalkan</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Berakhir">Berakhir</option>
                  </select>
                </label>
              </div>

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
                      : "Buat Promo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
