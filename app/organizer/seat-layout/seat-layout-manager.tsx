"use client";

import { useState } from "react";

import { OrganizerIcon } from "../icons";
import {
  organizerConcerts,
  seatLayouts as initialLayouts,
  type SeatLayout,
  type SeatLayoutStatus,
  type SeatSection,
} from "../organizer-data";
import { Card, Pill, StatCard, seatStatusStyles } from "../ui";
import { formatNumber, formatRupiah } from "../utils";

type LayoutForm = {
  name: string;
  concert: string;
  venue: string;
  status: SeatLayoutStatus;
};

type SectionForm = {
  id: string;
  name: string;
  rows: string;
  seatsPerRow: string;
  price: string;
  color: string;
};

const palette = ["#8b5cf6", "#22d3ee", "#f472b6", "#f59e0b", "#34d399", "#a78bfa"];

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#070910] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60";

function seatCount(section: SeatSection) {
  return section.rows * section.seatsPerRow;
}

function SeatPreview({ section }: { section: SeatSection }) {
  const rows = Math.min(section.rows, 8);
  const cols = Math.min(section.seatsPerRow, 16);

  return (
    <div className="rounded-xl border border-white/5 bg-[#070910] p-4">
      <div className="mx-auto mb-5 w-44 rounded-full border border-purple-500/30 bg-purple-500/15 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-purple-300">
        Panggung
      </div>

      <div className="flex flex-col items-center gap-1.5 overflow-x-auto pb-1">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="flex items-center gap-1.5">
            <span className="w-4 shrink-0 text-[9px] font-medium text-slate-600">
              {String.fromCharCode(65 + row)}
            </span>
            {Array.from({ length: cols }).map((__, col) => {
              const seed = (row * cols + col + section.rows + section.seatsPerRow) % 13;
              const status = seed === 0 ? "sold" : seed === 1 ? "held" : "available";

              return (
                <span
                  key={col}
                  title={`Baris ${String.fromCharCode(65 + row)} · Kursi ${col + 1} · ${
                    status === "sold" ? "Terjual" : status === "held" ? "Ditahan" : "Tersedia"
                  }`}
                  className={`h-4 w-4 rounded-t-[4px] transition ${
                    status === "sold"
                      ? "bg-white/10"
                      : status === "held"
                        ? "border border-amber-400/60 bg-amber-400/10"
                        : "opacity-80 hover:opacity-100"
                  }`}
                  style={status === "available" ? { backgroundColor: section.color } : undefined}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-t-sm" style={{ backgroundColor: section.color }} />
          Tersedia
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-t-sm bg-white/10" />
          Terjual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-t-sm border border-amber-400/60 bg-amber-400/10" />
          Ditahan
        </span>
      </div>
      <p className="mt-3 text-center text-[10px] text-slate-600">
        Preview layout · menampilkan maksimal 8 baris × 16 kursi
      </p>
    </div>
  );
}

export function SeatLayoutManager() {
  const [layouts, setLayouts] = useState<SeatLayout[]>(initialLayouts);
  const [selectedId, setSelectedId] = useState(initialLayouts[0].id);
  const [activeSectionId, setActiveSectionId] = useState(
    initialLayouts[0].sections[0]?.id ?? "",
  );
  const [layoutForm, setLayoutForm] = useState<LayoutForm | null>(null);
  const [sectionForm, setSectionForm] = useState<SectionForm | null>(null);
  const [notice, setNotice] = useState("");

  const selected = layouts.find((layout) => layout.id === selectedId) ?? layouts[0];
  const activeSection =
    selected.sections.find((section) => section.id === activeSectionId) ?? selected.sections[0];

  const totalSeats = layouts.reduce(
    (sum, layout) =>
      sum + layout.sections.reduce((sectionSum, section) => sectionSum + seatCount(section), 0),
    0,
  );

  function selectLayout(layout: SeatLayout) {
    setSelectedId(layout.id);
    setActiveSectionId(layout.sections[0]?.id ?? "");
  }

  function openCreateLayout() {
    setLayoutForm({
      name: "",
      concert: organizerConcerts[0].title,
      venue: organizerConcerts[0].venue,
      status: "Draft",
    });
  }

  function openCreateSection() {
    setSectionForm({
      id: "",
      name: "",
      rows: "6",
      seatsPerRow: "16",
      price: "500000",
      color: palette[selected.sections.length % palette.length],
    });
  }

  function openEditSection(section: SeatSection) {
    setSectionForm({
      id: section.id,
      name: section.name,
      rows: String(section.rows),
      seatsPerRow: String(section.seatsPerRow),
      price: String(section.price),
      color: section.color,
    });
  }

  function handleLayoutSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!layoutForm) return;

    const newLayout: SeatLayout = {
      id: `SL-${String(layouts.length + 1).padStart(2, "0")}`,
      name: layoutForm.name,
      concert: layoutForm.concert,
      venue: layoutForm.venue,
      status: layoutForm.status,
      updatedAt: "Baru saja",
      sections: [],
    };

    setLayouts((current) => [...current, newLayout]);
    setSelectedId(newLayout.id);
    setActiveSectionId("");
    setLayoutForm(null);
    setNotice(`${newLayout.name} berhasil dibuat. Tambahkan section kursi sekarang.`);
  }

  function handleSectionSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sectionForm) return;

    const rows = Math.max(1, Number(sectionForm.rows) || 1);
    const seatsPerRow = Math.max(1, Number(sectionForm.seatsPerRow) || 1);
    const price = Math.max(0, Number(sectionForm.price) || 0);

    if (sectionForm.id) {
      setLayouts((current) =>
        current.map((layout) =>
          layout.id !== selected.id
            ? layout
            : {
                ...layout,
                updatedAt: "Baru saja",
                sections: layout.sections.map((section) =>
                  section.id === sectionForm.id
                    ? {
                        ...section,
                        name: sectionForm.name,
                        rows,
                        seatsPerRow,
                        price,
                        color: sectionForm.color,
                      }
                    : section,
                ),
              },
        ),
      );
      setActiveSectionId(sectionForm.id);
      setNotice(`Section ${sectionForm.name} berhasil diperbarui.`);
    } else {
      const totalSections = layouts.reduce((sum, layout) => sum + layout.sections.length, 0);
      const newSection: SeatSection = {
        id: `SC-${String(totalSections + 1).padStart(2, "0")}`,
        name: sectionForm.name,
        rows,
        seatsPerRow,
        price,
        color: sectionForm.color,
      };

      setLayouts((current) =>
        current.map((layout) =>
          layout.id === selected.id
            ? {
                ...layout,
                updatedAt: "Baru saja",
                sections: [...layout.sections, newSection],
              }
            : layout,
        ),
      );
      setActiveSectionId(newSection.id);
      setNotice(`Section ${newSection.name} berhasil ditambahkan.`);
    }

    setSectionForm(null);
  }

  function removeSection(section: SeatSection) {
    const nextSections = selected.sections.filter((item) => item.id !== section.id);

    setLayouts((current) =>
      current.map((layout) =>
        layout.id === selected.id
          ? { ...layout, updatedAt: "Baru saja", sections: nextSections }
          : layout,
      ),
    );
    setActiveSectionId(nextSections[0]?.id ?? "");
    setNotice(`Section ${section.name} dihapus dari layout.`);
  }

  function toggleLayoutStatus() {
    const nextStatus: SeatLayoutStatus = selected.status === "Aktif" ? "Draft" : "Aktif";

    setLayouts((current) =>
      current.map((layout) =>
        layout.id === selected.id ? { ...layout, status: nextStatus } : layout,
      ),
    );
    setNotice(
      `${selected.name} ${nextStatus === "Aktif" ? "diaktifkan" : "dijadikan draft"}.`,
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Layout"
          value={String(layouts.length)}
          hint={`${layouts.filter((item) => item.status === "Aktif").length} layout aktif`}
          icon={<OrganizerIcon name="grid" className="h-5 w-5" />}
          tone="purple"
        />
        <StatCard
          label="Total Section"
          value={String(layouts.reduce((sum, layout) => sum + layout.sections.length, 0))}
          hint="Zona duduk di semua layout"
          icon={<OrganizerIcon name="seat" className="h-5 w-5" />}
          tone="sky"
        />
        <StatCard
          label="Total Kursi"
          value={formatNumber(totalSeats)}
          hint="Kapasitas seluruh layout"
          icon={<OrganizerIcon name="ticket" className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Layout Draft"
          value={String(layouts.filter((item) => item.status === "Draft").length)}
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

      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Layout Kursi</p>
              <p className="text-[11px] text-slate-500">Pilih layout untuk diedit</p>
            </div>
            <button
              type="button"
              onClick={openCreateLayout}
              aria-label="Buat layout baru"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white transition hover:bg-purple-500"
            >
              <OrganizerIcon name="plus" className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {layouts.map((layout) => {
              const isSelected = layout.id === selected.id;
              const seats = layout.sections.reduce(
                (sum, section) => sum + seatCount(section),
                0,
              );

              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => selectLayout(layout)}
                  className={`rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? "border-purple-500/50 bg-purple-500/10"
                      : "border-white/5 bg-white/[0.02] hover:border-purple-500/25"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 truncate text-xs font-semibold">{layout.name}</p>
                    <Pill className={seatStatusStyles[layout.status]}>{layout.status}</Pill>
                  </div>
                  <p className="mt-1 truncate text-[10px] text-slate-500">{layout.venue}</p>
                  <p className="mt-2 text-[10px] text-slate-500">
                    {layout.sections.length} section · {formatNumber(seats)} kursi
                  </p>
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold">{selected.name}</p>
                <Pill className={seatStatusStyles[selected.status]}>{selected.status}</Pill>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {selected.concert} · {selected.venue} · diperbarui {selected.updatedAt}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleLayoutStatus}
                className="rounded-lg border border-white/10 px-3 py-2 text-[11px] font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white"
              >
                {selected.status === "Aktif" ? "Jadikan Draft" : "Aktifkan Layout"}
              </button>
              <button
                type="button"
                onClick={openCreateSection}
                className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-purple-500"
              >
                <OrganizerIcon name="plus" className="h-3.5 w-3.5" />
                Section
              </button>
            </div>
          </div>

          {selected.sections.length > 0 ? (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                {selected.sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSectionId(section.id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      activeSection?.id === section.id
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: section.color }}
                    />
                    {section.name}
                    <span className="text-[10px] text-slate-500">
                      {formatNumber(seatCount(section))}
                    </span>
                  </button>
                ))}
              </div>

              {activeSection ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
                  <SeatPreview section={activeSection} />

                  <div className="space-y-3">
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">
                        Section aktif
                      </p>
                      <p className="mt-1 text-sm font-semibold">{activeSection.name}</p>
                      <dl className="mt-3 space-y-2 text-[11px]">
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-500">Harga</dt>
                          <dd className="font-medium text-slate-200">
                            {formatRupiah(activeSection.price)}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-500">Baris</dt>
                          <dd className="text-slate-300">{activeSection.rows}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-500">Kursi / baris</dt>
                          <dd className="text-slate-300">{activeSection.seatsPerRow}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-500">Kapasitas</dt>
                          <dd className="font-semibold text-emerald-400">
                            {formatNumber(seatCount(activeSection))}
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditSection(activeSection)}
                          className="flex-1 rounded-lg border border-white/10 px-2 py-1.5 text-[10px] font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSection(activeSection)}
                          className="flex-1 rounded-lg border border-rose-500/30 px-2 py-1.5 text-[10px] font-medium text-rose-300 transition hover:bg-rose-500/10"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-purple-500/15 bg-purple-500/5 p-3">
                      <p className="text-[11px] font-medium text-purple-200">Tips layout</p>
                      <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                        Pastikan jumlah kursi per baris sesuai denah venue sebelum
                        mempublikasikan layout.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {selected.sections.map((section) => (
                  <div
                    key={section.id}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: section.color }}
                      />
                      <p className="min-w-0 truncate text-xs font-semibold">{section.name}</p>
                    </div>
                    <p className="mt-1.5 text-[10px] text-slate-500">
                      {section.rows} baris × {section.seatsPerRow} kursi
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-slate-300">
                      {formatRupiah(section.price)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-white/10 px-4 py-12 text-center">
              <p className="text-sm font-medium text-slate-300">Layout belum punya section</p>
              <p className="mt-1 text-xs text-slate-500">
                Tambahkan section kursi untuk mulai mengatur denah.
              </p>
              <button
                type="button"
                onClick={openCreateSection}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-purple-500"
              >
                <OrganizerIcon name="plus" className="h-3.5 w-3.5" />
                Tambah Section
              </button>
            </div>
          )}
        </Card>
      </div>

      {layoutForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Tutup form layout"
            onClick={() => setLayoutForm(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Buat layout kursi"
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1320] p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500">Seat layout</p>
                <p className="mt-0.5 font-semibold">Buat layout baru</p>
              </div>
              <button
                type="button"
                onClick={() => setLayoutForm(null)}
                aria-label="Tutup"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <OrganizerIcon name="close" className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleLayoutSubmit} className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">
                  Nama layout
                </span>
                <input
                  required
                  value={layoutForm.name}
                  onChange={(event) =>
                    setLayoutForm((current) =>
                      current ? { ...current, name: event.target.value } : current,
                    )
                  }
                  placeholder="Contoh: JIS Stadium - Coldplay"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Konser</span>
                <select
                  value={layoutForm.concert}
                  onChange={(event) => {
                    const concert = organizerConcerts.find(
                      (item) => item.title === event.target.value,
                    );
                    setLayoutForm((current) =>
                      current
                        ? {
                            ...current,
                            concert: event.target.value,
                            venue: concert?.venue ?? current.venue,
                          }
                        : current,
                    );
                  }}
                  className={inputClass}
                >
                  {organizerConcerts.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Venue</span>
                <input
                  required
                  value={layoutForm.venue}
                  onChange={(event) =>
                    setLayoutForm((current) =>
                      current ? { ...current, venue: event.target.value } : current,
                    )
                  }
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Status</span>
                <select
                  value={layoutForm.status}
                  onChange={(event) =>
                    setLayoutForm((current) =>
                      current
                        ? { ...current, status: event.target.value as SeatLayoutStatus }
                        : current,
                    )
                  }
                  className={inputClass}
                >
                  <option value="Draft">Draft</option>
                  <option value="Aktif">Aktif</option>
                </select>
              </label>

              <div className="flex justify-end gap-2 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => setLayoutForm(null)}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-500"
                >
                  <OrganizerIcon name="check" className="h-4 w-4" />
                  Buat Layout
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {sectionForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Tutup form section"
            onClick={() => setSectionForm(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={sectionForm.id ? "Edit section" : "Tambah section"}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1320] p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500">
                  {selected.name}
                </p>
                <p className="mt-0.5 font-semibold">
                  {sectionForm.id ? "Edit section" : "Tambah section"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSectionForm(null)}
                aria-label="Tutup"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <OrganizerIcon name="close" className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSectionSubmit} className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">
                  Nama section
                </span>
                <input
                  required
                  value={sectionForm.name}
                  onChange={(event) =>
                    setSectionForm((current) =>
                      current ? { ...current, name: event.target.value } : current,
                    )
                  }
                  placeholder="Contoh: VIP A"
                  className={inputClass}
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Jumlah baris
                  </span>
                  <input
                    required
                    type="number"
                    min="1"
                    value={sectionForm.rows}
                    onChange={(event) =>
                      setSectionForm((current) =>
                        current ? { ...current, rows: event.target.value } : current,
                      )
                    }
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Kursi per baris
                  </span>
                  <input
                    required
                    type="number"
                    min="1"
                    value={sectionForm.seatsPerRow}
                    onChange={(event) =>
                      setSectionForm((current) =>
                        current ? { ...current, seatsPerRow: event.target.value } : current,
                      )
                    }
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">
                  Harga per kursi
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                    Rp
                  </span>
                  <input
                    required
                    type="number"
                    min="0"
                    step="10000"
                    value={sectionForm.price}
                    onChange={(event) =>
                      setSectionForm((current) =>
                        current ? { ...current, price: event.target.value } : current,
                      )
                    }
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </label>

              <div>
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Warna</span>
                <div className="flex flex-wrap gap-2">
                  {palette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Pilih warna ${color}`}
                      onClick={() =>
                        setSectionForm((current) =>
                          current ? { ...current, color } : current,
                        )
                      }
                      className={`h-7 w-7 rounded-full transition ${
                        sectionForm.color === color
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#0f1320]"
                          : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => setSectionForm(null)}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-500"
                >
                  <OrganizerIcon name="check" className="h-4 w-4" />
                  {sectionForm.id ? "Simpan" : "Tambah Section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
