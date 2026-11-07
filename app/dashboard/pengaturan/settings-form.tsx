"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0f1122] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 transition focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/15";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/5 bg-[#121422] p-5">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-purple-600" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-[1.375rem]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsForm() {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [language, setLanguage] = useState("id");
  const [genre, setGenre] = useState("Pop & Indie");

  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setFullName(user.name ?? "");
    setEmail(user.email ?? "");
    setPhone(user.phone ?? "");
    setCity(user.city ?? "");
    setBio(user.bio ?? "");
    setGenre(user.favorite_genre || "Pop & Indie");
  }, [user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    if (!fullName.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    const wantsPasswordChange =
      currentPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0;

    if (wantsPasswordChange) {
      if (!currentPassword) {
        setError("Masukkan password saat ini untuk mengubah password.");
        return;
      }
      if (newPassword.length < 8) {
        setError("Password baru minimal 8 karakter.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Konfirmasi password tidak sama.");
        return;
      }
    }

    setSaving(true);
    try {
      await api.put("/auth/me", {
        name: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        bio,
        favorite_genre: genre,
      });

      if (wantsPasswordChange) {
        await api.put("/auth/change-password", { currentPassword, newPassword });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      await refreshUser();
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="flex flex-col gap-5 lg:col-span-2">
        <Section
          title="Informasi Akun"
          description="Data ini digunakan untuk kebutuhan pembelian dan e-ticket."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">Nama lengkap</span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">Email</span>
              <input
                type="email"
                value={email}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-70`}
              />
              <span className="mt-1 block text-[11px] text-slate-500">
                Email tidak dapat diubah dari halaman ini.
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">Nomor telepon</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">Domisili</span>
              <input
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">Bio</span>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={3}
                placeholder="Ceritakan sedikit tentang kamu..."
                className={`${inputClass} resize-none`}
              />
            </label>
          </div>
        </Section>

        <Section
          title="Notifikasi"
          description="Pilih kabar apa saja yang ingin kamu terima dari KONSERVIBE."
        >
          <div className="divide-y divide-white/5">
            <Toggle
              checked={emailNotif}
              onChange={setEmailNotif}
              label="Notifikasi email"
              description="E-ticket, status pembayaran, dan pengingat hari-H."
            />
            <Toggle
              checked={pushNotif}
              onChange={setPushNotif}
              label="Notifikasi push"
              description="Pemberitahuan real-time saat tiket favorit mulai dijual."
            />
            <Toggle
              checked={promoNotif}
              onChange={setPromoNotif}
              label="Promo & penawaran"
              description="Diskon eksklusif dan pre-sale khusus member."
            />
          </div>
        </Section>

        <Section
          title="Keamanan"
          description="Ganti password secara berkala agar akun tetap aman."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">
                Password saat ini
              </span>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Kosongkan jika tidak ingin mengganti password"
                autoComplete="current-password"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">
                Password baru
              </span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">
                Konfirmasi password
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Ulangi password baru"
                autoComplete="new-password"
                className={inputClass}
              />
            </label>
          </div>
        </Section>
      </div>

      <div className="flex flex-col gap-5">
        <Section
          title="Preferensi"
          description="Personalisasi pengalaman menjelajah konser."
        >
          <div className="flex flex-col gap-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">Bahasa</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className={inputClass}
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">
                Genre favorit
              </span>
              <select
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
                className={inputClass}
              >
                {Array.from(
                  new Set([
                    "Pop & Indie",
                    "K-Pop",
                    "Rock",
                    "EDM",
                    "Jazz",
                    "Hip Hop",
                    genre,
                  ]),
                )
                  .filter(Boolean)
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        </Section>

        <div className="rounded-2xl border border-white/5 bg-[#121422] p-5">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

          {error ? (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-center text-xs text-rose-200"
            >
              {error}
            </p>
          ) : null}

          {saved ? (
            <p
              role="status"
              aria-live="polite"
              className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-xs text-emerald-300"
            >
              Perubahan berhasil disimpan.
            </p>
          ) : (
            <p className="mt-3 text-center text-[11px] text-slate-500">
              Data akun tersimpan langsung ke server KONSERVIBE.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
