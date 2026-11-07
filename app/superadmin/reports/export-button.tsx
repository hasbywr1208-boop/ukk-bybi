"use client";

import { organizerRevenue } from "../superadmin-data";
import { AdminIcon } from "../icons";

function escapeCell(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function ReportExportButton() {
  function handleExport() {
    const header = [
      "Organizer",
      "Event",
      "Tiket Terjual",
      "Pendapatan Kotor",
      "Fee Platform",
      "Pendapatan Bersih",
      "Pertumbuhan (%)",
    ];
    const rows = organizerRevenue.map((row) => [
      row.organizer,
      row.events,
      row.tickets,
      row.gross,
      row.fee,
      row.net,
      row.growth,
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => escapeCell(cell)).join(","))
      .join("\r\n");

    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "laporan-pendapatan-organizer-2026.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
    >
      <AdminIcon name="download" className="h-4 w-4" />
      Export CSV
    </button>
  );
}
