"use client";

import { useMemo, useState } from "react";

import { AdminIcon } from "../icons";
import {
  adminUsers as initialUsers,
  type AdminRole,
  type AdminUser,
  type UserStatus,
} from "../superadmin-data";
import { Card, Pill, StatCard, roleStyles, userStatusStyles } from "../ui";
import { formatRupiah } from "../utils";

type RoleFilter = "Semua" | AdminRole;
type StatusFilter = "Semua" | UserStatus;

const roleFilters: RoleFilter[] = ["Semua", "User", "Organizer", "Superadmin"];
const statusFilters: StatusFilter[] = ["Semua", "Aktif", "Nonaktif", "Ditangguhkan"];

export function UsersTable() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("Semua");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesQuery =
        keyword.length === 0 ||
        [user.name, user.email, user.id, user.city].some((value) =>
          value.toLowerCase().includes(keyword),
        );
      const matchesRole = roleFilter === "Semua" || user.role === roleFilter;
      const matchesStatus = statusFilter === "Semua" || user.status === statusFilter;

      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, query, roleFilter, statusFilter]);

  const selected = users.find((user) => user.id === selectedId) ?? null;

  const totalActive = users.filter((user) => user.status === "Aktif").length;
  const totalSuspended = users.filter((user) => user.status === "Ditangguhkan").length;
  const totalOrganizers = users.filter((user) => user.role === "Organizer").length;

  function toggleStatus(user: AdminUser) {
    if (user.role === "Superadmin") return;

    const nextStatus: UserStatus = user.status === "Aktif" ? "Ditangguhkan" : "Aktif";

    setUsers((current) =>
      current.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item)),
    );
    setNotice(
      `${user.name} ${nextStatus === "Aktif" ? "diaktifkan kembali" : "ditangguhkan"}.`,
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Pengguna"
          value={String(users.length)}
          hint="Terdaftar di platform"
          icon={<AdminIcon name="users" className="h-5 w-5" />}
          tone="purple"
        />
        <StatCard
          label="Akun Aktif"
          value={String(totalActive)}
          hint="Dapat mengakses platform"
          icon={<AdminIcon name="check" className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Organizer"
          value={String(totalOrganizers)}
          hint="Akun mitra penyelenggara"
          icon={<AdminIcon name="building" className="h-5 w-5" />}
          tone="sky"
        />
        <StatCard
          label="Ditangguhkan"
          value={String(totalSuspended)}
          hint="Akses dibatasi sementara"
          icon={<AdminIcon name="ban" className="h-5 w-5" />}
          tone="rose"
        />
      </div>

      {notice ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
          <span className="flex items-center gap-2">
            <AdminIcon name="check" className="h-4 w-4" />
            {notice}
          </span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Tutup pemberitahuan"
            className="text-emerald-300/70 transition hover:text-emerald-200"
          >
            <AdminIcon name="close" className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {roleFilters.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  roleFilter === role
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {role}
              </button>
            ))}

            <div className="ml-auto flex flex-1 flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
              <label className="relative min-w-0 flex-1 sm:max-w-xs">
                <span className="sr-only">Cari pengguna</span>
                <AdminIcon
                  name="search"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari nama, email, atau ID..."
                  className="w-full rounded-lg border border-white/10 bg-[#070910] py-2 pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60"
                />
              </label>

              <label className="relative">
                <span className="sr-only">Filter status</span>
                <AdminIcon
                  name="filter"
                  className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="appearance-none rounded-lg border border-white/10 bg-[#070910] py-2 pl-8 pr-8 text-xs text-slate-300 outline-none transition focus:border-purple-500/60"
                >
                  {statusFilters.map((status) => (
                    <option key={status} value={status}>
                      {status === "Semua" ? "Semua status" : status}
                    </option>
                  ))}
                </select>
                <AdminIcon
                  name="chevronRight"
                  className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-slate-500"
                />
              </label>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-medium">Pengguna</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Kota</th>
                  <th className="pb-3 font-medium">Pesanan</th>
                  <th className="pb-3 font-medium">Total Belanja</th>
                  <th className="pb-3 font-medium">Bergabung</th>
                  <th className="pb-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((user) => (
                  <tr key={user.id} className="transition hover:bg-white/[0.02]">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/40 to-indigo-500/20 text-[11px] font-bold text-purple-200">
                          {user.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">{user.name}</p>
                          <p className="truncate text-[11px] text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Pill className={roleStyles[user.role]}>{user.role}</Pill>
                    </td>
                    <td className="py-3 pr-4">
                      <Pill className={userStatusStyles[user.status]}>{user.status}</Pill>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-400">{user.city}</td>
                    <td className="py-3 pr-4 text-xs text-slate-400">
                      {user.orders > 0 ? `${user.orders} tiket` : "—"}
                    </td>
                    <td className="py-3 pr-4 text-xs font-medium text-slate-300">
                      {user.spent > 0 ? formatRupiah(user.spent) : "—"}
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-500">{user.joined}</td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedId(user.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white"
                      >
                        <AdminIcon name="settings" className="h-3.5 w-3.5" />
                        Kelola
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
              <p className="text-sm font-medium text-slate-300">Pengguna tidak ditemukan</p>
              <p className="mt-1 text-xs text-slate-500">
                Coba ubah kata kunci atau filter yang digunakan.
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              Menampilkan {filtered.length} dari {users.length} pengguna
            </p>
          )}
        </div>
      </Card>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Tutup detail pengguna"
            onClick={() => setSelectedId(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detail ${selected.name}`}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0f1320] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/5 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-bold">
                  {selected.initials}
                </span>
                <div>
                  <p className="font-semibold">{selected.name}</p>
                  <p className="text-xs text-slate-500">{selected.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Tutup"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <AdminIcon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex flex-wrap gap-2">
                <Pill className={roleStyles[selected.role]}>{selected.role}</Pill>
                <Pill className={userStatusStyles[selected.status]}>{selected.status}</Pill>
                <Pill className="bg-white/5 text-slate-400">{selected.id}</Pill>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-slate-500">Kota</p>
                  <p className="mt-1 font-medium text-slate-200">{selected.city}</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-slate-500">Bergabung</p>
                  <p className="mt-1 font-medium text-slate-200">{selected.joined}</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-slate-500">Total pesanan</p>
                  <p className="mt-1 font-medium text-slate-200">{selected.orders} tiket</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-slate-500">Total belanja</p>
                  <p className="mt-1 font-medium text-slate-200">
                    {formatRupiah(selected.spent)}
                  </p>
                </div>
              </div>

              {selected.role === "Superadmin" ? (
                <p className="rounded-xl border border-purple-500/20 bg-purple-500/5 px-3 py-2.5 text-[11px] text-purple-300">
                  Akun superadmin dilindungi dan tidak dapat diubah statusnya.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleStatus(selected)}
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                      selected.status === "Aktif"
                        ? "bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
                        : "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                    }`}
                  >
                    <AdminIcon
                      name={selected.status === "Aktif" ? "ban" : "check"}
                      className="h-4 w-4"
                    />
                    {selected.status === "Aktif" ? "Tangguhkan pengguna" : "Aktifkan pengguna"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-white/5"
                  >
                    Selesai
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
