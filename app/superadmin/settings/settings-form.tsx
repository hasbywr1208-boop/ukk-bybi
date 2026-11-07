"use client";

import { useState } from "react";

import { AdminIcon } from "../icons";
import { Card } from "../ui";
import { formatRupiah } from "../utils";

type ToggleKey =
  | "maintenance"
  | "autoApprove"
  | "emailNotifications"
  | "enforce2fa"
  | "allowRefund";

type SettingsState = {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  website: string;
  feePercent: string;
  minPayout: string;
  payoutSchedule: string;
  toggles: Record<ToggleKey, boolean>;
};

const initialState: SettingsState = {
  platformName: "KONSERVIBE",
  supportEmail: "support@konservibe.id",
  supportPhone: "+62 21 5060 7080",
  website: "https://konservibe.id",
  feePercent: "5",
  minPayout: "500000",
  payoutSchedule: "Mingguan",
  toggles: {
    maintenance: false,
    autoApprove: false,
    emailNotifications: true,
    enforce2fa: true,
    allowRefund: true,
  },
};

const toggleItems: Array<{
  key: ToggleKey;
  title: string;
  description: string;
}> = [
  {
    key: "maintenance",
    title: "Mode Maintenance",
    description: "Tampilkan halaman maintenance dan hentikan transaksi sementara.",
  },
  {
    key: "autoApprove",
    title: "Auto-approve Organizer",
    description: "Organizer dengan dokumen lengkap langsung terverifikasi otomatis.",
  },
  {
    key: "emailNotifications",
    title: "Notifikasi Email Admin",
    description: "Kirim ringkasan transaksi dan verifikasi ke email superadmin.",
  },
  {
    key: "enforce2fa",
    title: "Wajibkan 2FA Admin",
    description: "Semua akun admin wajib mengaktifkan autentikasi dua faktor.",
  },
  {
    key: "allowRefund",
    title: "Izinkan Refund Otomatis",
    description: "Refund hingga 24 jam sebelum konser diproses tanpa review manual.",
  },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-purple-600" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      {hint ? <span className="mt-0.5 block text-[11px] text-slate-500">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#070910] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60";

export function SettingsForm() {
  const [state, setState] = useState<SettingsState>(initialState);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setState((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function updateToggle(key: ToggleKey, value: boolean) {
    setState((current) => ({
      ...current,
      toggles: { ...current.toggles, [key]: value },
    }));
    setSaved(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  function handleReset() {
    setState(initialState);
    setSaved(false);
  }

  const feeValue = Number(state.feePercent) || 0;
  const minPayoutValue = Number(state.minPayout) || 0;

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {saved ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
            <span className="flex items-center gap-2">
              <AdminIcon name="check" className="h-4 w-4" />
              Pengaturan platform berhasil disimpan.
            </span>
            <button
              type="button"
              onClick={() => setSaved(false)}
              aria-label="Tutup pemberitahuan"
              className="text-emerald-300/70 transition hover:text-emerald-200"
            >
              <AdminIcon name="close" className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        <Card title="Informasi Platform" description="Identitas dan kontak resmi KONSERVIBE">
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Nama Platform">
              <input
                value={state.platformName}
                onChange={(event) => update("platformName", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Website">
              <input
                value={state.website}
                onChange={(event) => update("website", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Email Support">
              <input
                type="email"
                value={state.supportEmail}
                onChange={(event) => update("supportEmail", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Telepon Support">
              <input
                value={state.supportPhone}
                onChange={(event) => update("supportPhone", event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </Card>

        <Card title="Pendapatan & Payout" description="Atur komisi platform dan jadwal pencairan">
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Komisi Platform" hint="Persentase dari setiap transaksi tiket">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={state.feePercent}
                  onChange={(event) => update("feePercent", event.target.value)}
                  className={`${inputClass} pr-10`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                  %
                </span>
              </div>
            </Field>
            <Field label="Minimum Payout" hint="Batas minimal pencairan organizer">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                  Rp
                </span>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={state.minPayout}
                  onChange={(event) => update("minPayout", event.target.value)}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </Field>
            <Field label="Jadwal Payout">
              <div className="relative">
                <select
                  value={state.payoutSchedule}
                  onChange={(event) => update("payoutSchedule", event.target.value)}
                  className={`${inputClass} appearance-none pr-9`}
                >
                  <option>Harian</option>
                  <option>Mingguan</option>
                  <option>Dua Mingguan</option>
                  <option>Bulanan</option>
                </select>
                <AdminIcon
                  name="chevronRight"
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-500"
                />
              </div>
            </Field>
            <Field label="Pajak Layanan" hint="PPN yang dibebankan ke pembeli">
              <div className="flex h-[42px] items-center justify-between rounded-lg border border-white/10 bg-[#070910] px-3">
                <span className="text-sm text-slate-300">11%</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-600">
                  Tetap
                </span>
              </div>
            </Field>
          </div>
        </Card>

        <Card title="Preferensi & Keamanan" description="Kontrol operasional platform">
          <div className="mt-2 divide-y divide-white/5">
            {toggleItems.map((item) => (
              <div key={item.key} className="flex items-start justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200">{item.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
                <Toggle
                  checked={state.toggles[item.key]}
                  onChange={(value) => updateToggle(item.key, value)}
                  label={item.title}
                />
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5"
          >
            Reset
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
          >
            <AdminIcon name="check" className="h-4 w-4" />
            Simpan Perubahan
          </button>
        </div>
      </div>

      <aside className="space-y-6">
        <Card title="Status Platform">
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Operasional</span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                  state.toggles.maintenance
                    ? "bg-amber-500/10 text-amber-300"
                    : "bg-emerald-500/10 text-emerald-300"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    state.toggles.maintenance ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                />
                {state.toggles.maintenance ? "Maintenance" : "Normal"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Komisi</span>
              <span className="font-medium text-slate-200">{feeValue}%</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Minimum payout</span>
              <span className="font-medium text-slate-200">{formatRupiah(minPayoutValue)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Jadwal payout</span>
              <span className="font-medium text-slate-200">{state.payoutSchedule}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">2FA admin</span>
              <span className="font-medium text-slate-200">
                {state.toggles.enforce2fa ? "Wajib" : "Opsional"}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Informasi Sistem">
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Versi platform</span>
              <span className="font-mono text-slate-300">v2.4.0</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Environment</span>
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-300">
                Production
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Terakhir deploy</span>
              <span className="text-slate-300">6 Nov 2026</span>
            </div>
          </div>
        </Card>

        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-600/15 to-indigo-600/5 p-5">
          <AdminIcon name="shield" className="h-6 w-6 text-purple-300" />
          <p className="mt-3 text-sm font-semibold">Zona Superadmin</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            Perubahan pada halaman ini berdampak langsung ke seluruh pengguna platform.
            Tinjau kembali sebelum menyimpan.
          </p>
        </div>
      </aside>
    </form>
  );
}
