"use client";

import { useMemo, useState } from "react";

import { BarChart } from "../../superadmin/charts";
import { OrganizerIcon } from "../icons";
import {
  checkInRecords as initialRecords,
  hourlyCheckIns,
  validCheckInCodes,
  type CheckInRecord,
  type CheckInStatus,
} from "../organizer-data";
import { Card, Pill, ProgressBar, StatCard, checkInStatusStyles } from "../ui";
import { formatNumber } from "../utils";

type ScanResult = {
  status: CheckInStatus;
  code: string;
  holder: string;
  ticketType: string;
  gate: string;
  time: string;
};

const gates = [
  { name: "Gate A", count: 1_284, capacity: 1_400 },
  { name: "Gate B", count: 1_102, capacity: 1_400 },
  { name: "Gate C", count: 968, capacity: 1_400 },
  { name: "Gate D", count: 1_246, capacity: 1_400 },
];

function nowTime() {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function CheckInScanner() {
  const [records, setRecords] = useState<CheckInRecord[]>(initialRecords);
  const [code, setCode] = useState("");
  const [gate, setGate] = useState("Gate A");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scannedCodes, setScannedCodes] = useState<string[]>(
    initialRecords.filter((item) => item.status === "Valid").map((item) => item.code),
  );
  const [query, setQuery] = useState("");

  const filteredRecords = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return records.filter(
      (record) =>
        keyword.length === 0 ||
        [record.code, record.holder, record.concert, record.gate].some((value) =>
          value.toLowerCase().includes(keyword),
        ),
    );
  }, [records, query]);

  const validCount = records.filter((item) => item.status === "Valid").length;
  const failedCount = records.filter((item) => item.status !== "Valid").length;

  function handleScan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;

    const ticket = validCheckInCodes[normalized];
    const time = nowTime();

    let scan: ScanResult;

    if (!ticket) {
      scan = {
        status: "Tidak valid",
        code: normalized,
        holder: "Tidak dikenal",
        ticketType: "—",
        gate,
        time,
      };
    } else if (scannedCodes.includes(normalized)) {
      scan = {
        status: "Duplikat",
        code: normalized,
        holder: ticket.holder,
        ticketType: ticket.ticketType,
        gate,
        time,
      };
    } else {
      scan = {
        status: "Valid",
        code: normalized,
        holder: ticket.holder,
        ticketType: ticket.ticketType,
        gate,
        time,
      };
      setScannedCodes((current) => [...current, normalized]);
    }

    setResult(scan);

    if (scan.status !== "Tidak valid") {
      const record: CheckInRecord = {
        id: `CI-${Date.now()}`,
        code: scan.code,
        holder: scan.holder,
        concert: "Coldplay World Tour",
        ticketType: scan.ticketType,
        gate: scan.gate,
        time: scan.time,
        status: scan.status,
      };
      setRecords((current) => [record, ...current]);
    }

    setCode("");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Check-in Hari Ini"
          value={formatNumber(35_200 + Math.max(0, validCount - 4))}
          hint="Coldplay World Tour"
          icon={<OrganizerIcon name="check" className="h-5 w-5" />}
          tone="emerald"
          trend={{ value: "92%", positive: true }}
        />
        <StatCard
          label="Target Kehadiran"
          value={formatNumber(38_400)}
          hint="Total tiket terjual"
          icon={<OrganizerIcon name="ticket" className="h-5 w-5" />}
          tone="purple"
        />
        <StatCard
          label="Gate Aktif"
          value={String(gates.length)}
          hint="Semua gate beroperasi"
          icon={<OrganizerIcon name="scan" className="h-5 w-5" />}
          tone="sky"
        />
        <StatCard
          label="Scan Gagal"
          value={String(12 + Math.max(0, failedCount - 2))}
          hint="Duplikat & tiket tidak valid"
          icon={<OrganizerIcon name="alert" className="h-5 w-5" />}
          tone="rose"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card title="Scan E-Ticket" description="Validasi QR code pengunjung di gate">
          <div className="relative mt-4 flex h-44 items-center justify-center overflow-hidden rounded-xl border border-dashed border-purple-500/40 bg-[#070910]">
            <span className="absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-purple-400" />
            <span className="absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-purple-400" />
            <span className="absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-purple-400" />
            <span className="absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-purple-400" />
            <div className="flex flex-col items-center">
              <OrganizerIcon
                name="qr"
                className="h-16 w-16 animate-pulse text-purple-300/80"
              />
              <p className="mt-3 text-[10px] text-slate-500">
                Arahkan QR e-ticket ke kamera
              </p>
            </div>
          </div>

          <form onSubmit={handleScan} className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">
                Kode tiket
              </span>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Contoh: TKT-CP-8821"
                className="w-full rounded-lg border border-white/10 bg-[#070910] px-3 py-2.5 font-mono text-sm uppercase text-white outline-none transition placeholder:font-sans placeholder:normal-case placeholder:text-slate-600 focus:border-purple-500/60"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">Gate</span>
              <select
                value={gate}
                onChange={(event) => setGate(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#070910] px-3 py-2.5 text-sm text-white outline-none transition focus:border-purple-500/60"
              >
                {gates.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
            >
              <OrganizerIcon name="scan" className="h-4 w-4" />
              Scan Tiket
            </button>

            <button
              type="button"
              onClick={() => setCode("TKT-CP-8825")}
              className="w-full rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white"
            >
              Gunakan kode contoh
            </button>
          </form>

          {result ? (
            <div
              className={`mt-4 rounded-xl border px-4 py-3 ${
                result.status === "Valid"
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : result.status === "Duplikat"
                    ? "border-amber-500/30 bg-amber-500/10"
                    : "border-rose-500/30 bg-rose-500/10"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    result.status === "Valid"
                      ? "text-emerald-300"
                      : result.status === "Duplikat"
                        ? "text-amber-300"
                        : "text-rose-300"
                  }`}
                >
                  <OrganizerIcon
                    name={result.status === "Valid" ? "check" : "alert"}
                    className="h-4 w-4"
                  />
                  {result.status === "Valid"
                    ? "Tiket valid"
                    : result.status === "Duplikat"
                      ? "Tiket sudah dipakai"
                      : "Tiket tidak ditemukan"}
                </p>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  aria-label="Tutup hasil scan"
                  className="text-slate-400 transition hover:text-white"
                >
                  <OrganizerIcon name="close" className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 space-y-1 text-[11px] text-slate-300">
                <p className="font-mono">{result.code}</p>
                <p>{result.holder}</p>
                <p className="text-slate-500">
                  {result.ticketType} · {result.gate} · {result.time}
                </p>
              </div>
            </div>
          ) : null}
        </Card>

        <Card
          title="Riwayat Scan"
          description={`${records.length} scan terakhir`}
          action={
            <label className="relative">
              <span className="sr-only">Cari riwayat scan</span>
              <OrganizerIcon
                name="search"
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari kode..."
                className="w-40 rounded-lg border border-white/10 bg-[#070910] py-1.5 pl-8 pr-3 text-[11px] text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60"
              />
            </label>
          }
        >
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-medium">Tiket</th>
                  <th className="pb-3 font-medium">Gate</th>
                  <th className="pb-3 font-medium">Waktu</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="transition hover:bg-white/[0.02]">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-white">{record.holder}</p>
                      <p className="font-mono text-[10px] text-slate-500">{record.code}</p>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-400">
                      {record.gate}
                      <span className="block text-[10px] text-slate-600">
                        {record.ticketType}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-400">{record.time}</td>
                    <td className="py-3">
                      <Pill className={checkInStatusStyles[record.status]}>
                        {record.status}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
              <p className="text-sm font-medium text-slate-300">Belum ada hasil scan</p>
              <p className="mt-1 text-xs text-slate-500">
                Scan tiket pertama atau ubah kata kunci pencarian.
              </p>
            </div>
          ) : null}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Volume Check-in per Jam"
          description="Distribusi kedatangan pengunjung"
          action={<span className="text-[11px] text-slate-500">Gate A–D</span>}
        >
          <div className="mt-6">
            <BarChart
              data={hourlyCheckIns}
              color="#22d3ee"
              formatValue={formatNumber}
              height="h-44"
            />
          </div>
        </Card>

        <Card title="Status Gate" description="Kapasitas pemindaian per gate">
          <div className="mt-4 space-y-4">
            {gates.map((item) => {
              const percent = Math.round((item.count / item.capacity) * 100);

              return (
                <div key={item.name}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-2 text-slate-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {formatNumber(item.count)} / {formatNumber(item.capacity)}
                    </span>
                  </div>
                  <ProgressBar value={percent} color={percent > 90 ? "#f59e0b" : "#34d399"} />
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-3 py-2.5">
            <span className="text-[11px] text-slate-400">Estimasi antrean</span>
            <span className="text-xs font-semibold text-emerald-400">± 4 menit</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
