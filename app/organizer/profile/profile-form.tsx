"use client";

import { useState } from "react";

import { OrganizerIcon } from "../icons";
import { organizerProfile } from "../organizer-data";
import { Card, Pill } from "../ui";

type Tab = "profil" | "rekening" | "keamanan";

const tabs: { id: Tab; label: string; icon: "user" | "creditCard" | "shield" }[] = [
  { id: "profil", label: "Profil Organizer", icon: "user" },
  { id: "rekening", label: "Rekening & Pajak", icon: "creditCard" },
  { id: "keamanan", label: "Keamanan", icon: "shield" },
];

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#070910] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60";

export function ProfileForm() {
  const [tab, setTab] = useState<Tab>("profil");
  const [profile, setProfile] = useState({ ...organizerProfile });
  const [bank, setBank] = useState({
    bankName: organizerProfile.bankName,
    bankAccount: organizerProfile.bankAccount,
    accountName: organizerProfile.accountName,
    npwp: organizerProfile.npwp,
  });
  const [twoFactor, setTwoFactor] = useState(true);
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function updateProfile<K extends keyof typeof profile>(key: K, value: (typeof profile)[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("Profil organizer berhasil disimpan.");
  }

  function saveBank(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("Data rekening dan pajak berhasil diperbarui.");
  }

  function savePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.next.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }

    if (password.next !== password.confirm) {
      setError("Konfirmasi password tidak sesuai.");
      return;
    }

    setPassword({ current: "", next: "", confirm: "" });
    setNotice("Password berhasil diperbarui.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <div className="space-y-6">
        <Card>
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-2xl font-bold text-white">
                {profile.initials}
              </span>
              {profile.verified ? (
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0f1320] bg-emerald-500 text-white">
                  <OrganizerIcon name="check" className="h-3.5 w-3.5" />
                </span>
              ) : null}
            </div>
            <h2 className="mt-4 text-lg font-semibold">{profile.companyName}</h2>
            <p className="text-xs text-slate-500">{profile.picName}</p>
            <div className="mt-3 flex items-center gap-2">
              <Pill className="bg-emerald-500/10 text-emerald-400">Terverifikasi</Pill>
              <Pill className="bg-purple-500/10 text-purple-300">Organizer</Pill>
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              Bergabung sejak {profile.memberSince}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/5 pt-4 text-center">
            <div>
              <p className="text-base font-bold">19</p>
              <p className="text-[10px] text-slate-500">Konser</p>
            </div>
            <div>
              <p className="text-base font-bold">53,6k</p>
              <p className="text-[10px] text-slate-500">Tiket</p>
            </div>
            <div>
              <p className="text-base font-bold text-amber-300">4,9</p>
              <p className="text-[10px] text-slate-500">Rating</p>
            </div>
          </div>
        </Card>

        <Card title="Kontak Publik">
          <ul className="mt-4 space-y-3 text-xs">
            <li className="flex items-center gap-2.5 text-slate-300">
              <OrganizerIcon name="mail" className="h-4 w-4 text-slate-500" />
              <span className="truncate">{profile.email}</span>
            </li>
            <li className="flex items-center gap-2.5 text-slate-300">
              <OrganizerIcon name="phone" className="h-4 w-4 text-slate-500" />
              {profile.phone}
            </li>
            <li className="flex items-center gap-2.5 text-slate-300">
              <OrganizerIcon name="globe" className="h-4 w-4 text-slate-500" />
              <span className="truncate">{profile.website}</span>
            </li>
            <li className="flex items-center gap-2.5 text-slate-300">
              <OrganizerIcon name="mapPin" className="h-4 w-4 text-slate-500" />
              {profile.city}
            </li>
          </ul>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id);
                setNotice("");
                setError("");
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                tab === item.id
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <OrganizerIcon name={item.icon} className="h-4 w-4" />
              {item.label}
            </button>
          ))}
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
          <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
            {error}
          </p>
        ) : null}

        {tab === "profil" ? (
          <Card
            title="Informasi Organizer"
            description="Data ini tampil pada halaman publik konser Anda"
          >
            <form onSubmit={saveProfile} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Nama perusahaan
                  </span>
                  <input
                    required
                    value={profile.companyName}
                    onChange={(event) => updateProfile("companyName", event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Nama PIC
                  </span>
                  <input
                    required
                    value={profile.picName}
                    onChange={(event) => updateProfile("picName", event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">Email</span>
                  <input
                    required
                    type="email"
                    value={profile.email}
                    onChange={(event) => updateProfile("email", event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Nomor telepon
                  </span>
                  <input
                    required
                    value={profile.phone}
                    onChange={(event) => updateProfile("phone", event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">Kota</span>
                  <input
                    required
                    value={profile.city}
                    onChange={(event) => updateProfile("city", event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Instagram
                  </span>
                  <input
                    value={profile.instagram}
                    onChange={(event) => updateProfile("instagram", event.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Website</span>
                <input
                  value={profile.website}
                  onChange={(event) => updateProfile("website", event.target.value)}
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Alamat</span>
                <input
                  required
                  value={profile.address}
                  onChange={(event) => updateProfile("address", event.target.value)}
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">
                  Deskripsi organizer
                </span>
                <textarea
                  required
                  rows={4}
                  value={profile.bio}
                  onChange={(event) => updateProfile("bio", event.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </label>

              <div className="flex justify-end border-t border-white/5 pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-500"
                >
                  <OrganizerIcon name="check" className="h-4 w-4" />
                  Simpan Profil
                </button>
              </div>
            </form>
          </Card>
        ) : null}

        {tab === "rekening" ? (
          <Card
            title="Rekening Pencairan"
            description="Dana withdraw akan dikirim ke rekening ini"
          >
            <form onSubmit={saveBank} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">Bank</span>
                  <select
                    value={bank.bankName}
                    onChange={(event) =>
                      setBank((current) => ({ ...current, bankName: event.target.value }))
                    }
                    className={inputClass}
                  >
                    <option>Bank Central Asia (BCA)</option>
                    <option>Bank Mandiri</option>
                    <option>Bank Negara Indonesia (BNI)</option>
                    <option>Bank Rakyat Indonesia (BRI)</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Nomor rekening
                  </span>
                  <input
                    required
                    value={bank.bankAccount}
                    onChange={(event) =>
                      setBank((current) => ({ ...current, bankAccount: event.target.value }))
                    }
                    className={`${inputClass} font-mono`}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Nama pemilik rekening
                  </span>
                  <input
                    required
                    value={bank.accountName}
                    onChange={(event) =>
                      setBank((current) => ({ ...current, accountName: event.target.value }))
                    }
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">NPWP</span>
                  <input
                    required
                    value={bank.npwp}
                    onChange={(event) =>
                      setBank((current) => ({ ...current, npwp: event.target.value }))
                    }
                    className={`${inputClass} font-mono`}
                  />
                </label>
              </div>

              <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-[11px] text-amber-200/80">
                Perubahan rekening memerlukan verifikasi ulang dan berlaku 1x24 jam.
              </p>

              <div className="flex justify-end border-t border-white/5 pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-500"
                >
                  <OrganizerIcon name="check" className="h-4 w-4" />
                  Simpan Rekening
                </button>
              </div>
            </form>
          </Card>
        ) : null}

        {tab === "keamanan" ? (
          <div className="space-y-6">
            <Card title="Ubah Password" description="Gunakan password kuat dan unik">
              <form onSubmit={savePassword} className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-300">
                    Password saat ini
                  </span>
                  <input
                    required
                    type="password"
                    value={password.current}
                    onChange={(event) =>
                      setPassword((current) => ({ ...current, current: event.target.value }))
                    }
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-slate-300">
                      Password baru
                    </span>
                    <input
                      required
                      type="password"
                      value={password.next}
                      onChange={(event) =>
                        setPassword((current) => ({ ...current, next: event.target.value }))
                      }
                      placeholder="Minimal 8 karakter"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-slate-300">
                      Konfirmasi password
                    </span>
                    <input
                      required
                      type="password"
                      value={password.confirm}
                      onChange={(event) =>
                        setPassword((current) => ({ ...current, confirm: event.target.value }))
                      }
                      placeholder="Ulangi password baru"
                      className={inputClass}
                    />
                  </label>
                </div>
                <div className="flex justify-end border-t border-white/5 pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-500"
                  >
                    <OrganizerIcon name="lock" className="h-4 w-4" />
                    Perbarui Password
                  </button>
                </div>
              </form>
            </Card>

            <Card title="Autentikasi Dua Faktor" description="Lapisan keamanan tambahan akun">
              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                    <OrganizerIcon name="shield" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Verifikasi 2 langkah</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Minta kode OTP saat login dari perangkat baru.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={twoFactor}
                  aria-label="Aktifkan verifikasi dua langkah"
                  onClick={() => {
                    setTwoFactor((current) => !current);
                    setNotice(
                      twoFactor
                        ? "Verifikasi dua langkah dinonaktifkan."
                        : "Verifikasi dua langkah diaktifkan.",
                    );
                  }}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    twoFactor ? "bg-emerald-500" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                      twoFactor ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
