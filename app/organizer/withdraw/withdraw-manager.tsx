"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";
import { OrganizerIcon } from "../icons";
import type { Withdrawal, WithdrawalStatus } from "../organizer-data";
import { Card, Pill, StatCard, withdrawalStatusStyles } from "../ui";
import { formatRupiah } from "../utils";

type StatusFilter = "Semua" | WithdrawalStatus;

type WithdrawalsResponse = {
  items: Withdrawal[];
  availableBalance: number;
  pendingWithdrawal: number;
  totalWithdrawn: number;
  minimumWithdrawal: number;
};

type ProfileResponse = {
  bankName: string;
  bankAccount: string;
};

const statusFilters: StatusFilter[] = ["Semua", "Diproses", "Berhasil", "Ditolak"];
const banks = ["BCA", "Mandiri", "BNI", "BRI"];
const quickAmounts = [500_000, 1_000_000, 2_000_000];

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#070910] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60";

function detectBank(value: string) {
  const upper = value.toUpperCase();
  return banks.find((bank) => upper.includes(bank)) ?? "BCA";
}

export function WithdrawManager() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [balance, setBalance] = useState(0);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [minimumWithdrawal, setMinimumWithdrawal] = useState(500_000);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("BCA");
  const [account, setAccount] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await api.get<WithdrawalsResponse>("/organizer/withdrawals");
    if (!data) return;
    setWithdrawals(data.items ?? []);
    setBalance(data.availableBalance ?? 0);
    setPendingTotal(data.pendingWithdrawal ?? 0);
    setTotalWithdrawn(data.totalWithdrawn ?? 0);
    setMinimumWithdrawal(data.minimumWithdrawal ?? 500_000);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      api.get<WithdrawalsResponse>("/organizer/withdrawals"),
      api.get<ProfileResponse>("/organizer/profile"),
    ])
      .then(([data, profile]) => {
        if (!active) return;
        setWithdrawals(data.items ?? []);
        setBalance(data.availableBalance ?? 0);
        setPendingTotal(data.pendingWithdrawal ?? 0);
        setTotalWithdrawn(data.totalWithdrawn ?? 0);
        setMinimumWithdrawal(data.minimumWithdrawal ?? 500_000);
        setMethod(detectBank(profile?.bankName ?? ""));
        setAccount(profile?.bankAccount ?? "");
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Gagal memuat data pencairan.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      withdrawals.filter(
        (item) => statusFilter === "Semua" || item.status === statusFilter,
      ),
    [withdrawals, statusFilter],
  );

  const numericAmount = Math.max(0, Number(amount) || 0);
  const fee = Math.round(numericAmount * 0.005);
  const net = Math.max(0, numericAmount - fee);
  const canSubmit =
    numericAmount >= minimumWithdrawal &&
    numericAmount <= balance &&
    account.replace(/\D/g, "").length >= 8;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (numericAmount < minimumWithdrawal) {
      setError(`Minimum pencairan adalah ${formatRupiah(minimumWithdrawal)}.`);
      return;
    }

    if (numericAmount > balance) {
      setError("Nominal pencairan melebihi saldo yang tersedia.");
      return;
    }

    setSaving(true);
    try {
      const result = await api.post<{ id: string }>("/organizer/withdrawals", {
        amount: numericAmount,
        method,
        account: account.trim(),
      });
      setAmount("");
      setNotice(
        `Pengajuan ${result?.id ?? ""} sebesar ${formatRupiah(numericAmount)} sedang diproses.`,
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengajukan pencairan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Saldo Tersedia"
          value={formatRupiah(balance)}
          hint="Siap dicairkan"
          icon={<OrganizerIcon name="wallet" className="h-5 w-5" />}
          tone="purple"
        />
        <StatCard
          label="Sedang Diproses"
          value={formatRupiah(pendingTotal)}
          hint="Menunggu persetujuan admin"
          icon={<OrganizerIcon name="clock" className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          label="Total Dicairkan"
          value={formatRupiah(totalWithdrawn)}
          hint="Sejak bergabung"
          icon={<OrganizerIcon name="landmark" className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Minimum Withdraw"
          value={formatRupiah(minimumWithdrawal)}
          hint="Per pengajuan"
          icon={<OrganizerIcon name="alert" className="h-5 w-5" />}
          tone="sky"
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

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Ajukan Pencairan" description="Dana dikirim ke rekening terdaftar">
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <p className="text-[10px] uppercase tracking-wider text-purple-200/70">
                Saldo tersedia
              </p>
              <p className="mt-1 text-2xl font-bold">{formatRupiah(balance)}</p>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">
                Nominal pencairan
              </span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                  Rp
                </span>
                <input
                  required
                  type="number"
                  min={minimumWithdrawal}
                  max={balance}
                  step="50000"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </label>

            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  disabled={value > balance}
                  onClick={() => setAmount(String(value))}
                  className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {formatRupiah(value)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount(String(balance))}
                className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1.5 text-[10px] font-semibold text-purple-300 transition hover:bg-purple-500/20"
              >
                Semua saldo
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Bank</span>
                <select
                  value={method}
                  onChange={(event) => setMethod(event.target.value)}
                  className={inputClass}
                >
                  {banks.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">
                  Nomor rekening
                </span>
                <input
                  required
                  value={account}
                  onChange={(event) => setAccount(event.target.value)}
                  placeholder="1234567890"
                  className={`${inputClass} font-mono`}
                />
              </label>
            </div>

            <dl className="space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Nominal</dt>
                <dd className="font-medium text-slate-200">{formatRupiah(numericAmount)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Biaya admin (0,5%)</dt>
                <dd className="font-medium text-amber-300">- {formatRupiah(fee)}</dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-white/5 pt-2">
                <dt className="font-medium text-slate-300">Dana diterima</dt>
                <dd className="font-bold text-emerald-400">{formatRupiah(net)}</dd>
              </div>
            </dl>

            {error ? (
              <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-300">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit || saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <OrganizerIcon name="arrowDownLeft" className="h-4 w-4" />
              {saving ? "Memproses..." : "Ajukan Withdraw"}
            </button>
            <p className="text-center text-[10px] text-slate-500">
              Pencairan diproses dalam 1–3 hari kerja setelah disetujui admin.
            </p>
          </form>
        </Card>

        <Card
          title="Riwayat Pencairan"
          description="Status pengajuan dana organizer"
          action={<span className="text-[11px] text-slate-500">{withdrawals.length} pengajuan</span>}
        >
          <div className="mt-4 flex flex-wrap gap-2">
            {statusFilters.map((status) => {
              const count =
                status === "Semua"
                  ? withdrawals.length
                  : withdrawals.filter((item) => item.status === status).length;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ${
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
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Tanggal</th>
                  <th className="pb-3 font-medium">Nominal</th>
                  <th className="pb-3 font-medium">Diterima</th>
                  <th className="pb-3 font-medium">Rekening</th>
                  <th className="pb-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                      Memuat riwayat pencairan...
                    </td>
                  </tr>
                ) : null}
                {filtered.map((item) => (
                  <tr key={item.id} className="transition hover:bg-white/[0.02]">
                    <td className="py-3 pr-4 font-mono text-[11px] text-white">{item.id}</td>
                    <td className="py-3 pr-4 text-[11px] text-slate-400">{item.date}</td>
                    <td className="py-3 pr-4">
                      <p className="text-xs font-semibold text-white">
                        {formatRupiah(item.amount)}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Fee {formatRupiah(item.fee)}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-xs font-medium text-emerald-400">
                      {formatRupiah(item.net)}
                    </td>
                    <td className="py-3 pr-4 text-[11px] text-slate-400">
                      {item.method} •••• {item.account.slice(-4)}
                    </td>
                    <td className="py-3 text-right">
                      <Pill className={withdrawalStatusStyles[item.status]}>{item.status}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
              <p className="text-sm font-medium text-slate-300">Belum ada pengajuan</p>
              <p className="mt-1 text-xs text-slate-500">
                Pengajuan dengan status ini tidak ditemukan.
              </p>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
