"use client";

import { useState } from "react";

import { api } from "@/lib/api";
import { OrganizerIcon } from "../icons";

type ExportRow = {
  id: string;
  konser: string;
  tanggal: string;
  tiketTerjual: number;
  kapasitas: number;
  pendapatan: string;
};

function escapeCell(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function RevenueExportButton() {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setExporting(true);
    setError(null);
    try {
      const rows = await api.get<ExportRow[]>("/organizer/revenue/export");
      const header = [
        "ID",
        "Konser",
        "Tanggal",
        "Tiket Terjual",
        "Kapasitas",
        "Pendapatan",
      ];
      const body = (rows ?? []).map((row) => [
        row.id,
        row.konser,
        row.tanggal,
        row.tiketTerjual,
        row.kapasitas,
        row.pendapatan,
      ]);

      const csv = [header, ...body]
        .map((row) => row.map((cell) => escapeCell(cell)).join(","))
        .join("\r\n");

      const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "laporan-pendapatan.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengekspor laporan.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleExport}
        disabled={exporting}
        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <OrganizerIcon name="download" className="h-4 w-4" />
        {exporting ? "Mengekspor..." : "Export CSV"}
      </button>
      {error ? <span className="text-[11px] text-rose-300">{error}</span> : null}
    </div>
  );
}
