"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ROLE_HOME } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type IconProps = { className?: string };

function Icon({ name, className }: IconProps & { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const shapes: Record<string, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
    check: <><path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="10" /></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="m3 3 18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3 3.8M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1 0 2-.2 2.8-.5" /></>,
    info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" /></>,
    loader: <><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...common}>{shapes[name]}</svg>;
}

const ArrowRight = (props: IconProps) => <Icon name="arrow" {...props} />;
const CheckCircle2 = (props: IconProps) => <Icon name="check" {...props} />;
const Eye = (props: IconProps) => <Icon name="eye" {...props} />;
const EyeOff = (props: IconProps) => <Icon name="eyeOff" {...props} />;
const Info = (props: IconProps) => <Icon name="info" {...props} />;
const Loader2 = (props: IconProps) => <Icon name="loader" {...props} />;
const Lock = (props: IconProps) => <Icon name="lock" {...props} />;
const Mail = (props: IconProps) => <Icon name="mail" {...props} />;
const Phone = (props: IconProps) => <Icon name="phone" {...props} />;
const User = (props: IconProps) => <Icon name="user" {...props} />;

type Status = "idle" | "loading" | "success";
type Feedback = { type: "error" | "info" | "success"; message: string };

const feedbackStyles: Record<Feedback["type"], { box: string; icon: string }> = {
  error: {
    box: "border-rose-500/30 bg-rose-500/10 text-rose-200",
    icon: "text-rose-400",
  },
  info: {
    box: "border-sky-500/30 bg-sky-500/10 text-sky-200",
    icon: "text-sky-400",
  },
  success: {
    box: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    icon: "text-emerald-400",
  },
};

const strengthMeta = [
  { label: "Lemah", bar: "bg-rose-500", text: "text-rose-400" },
  { label: "Cukup", bar: "bg-amber-500", text: "text-amber-400" },
  { label: "Kuat", bar: "bg-emerald-500", text: "text-emerald-400" },
  { label: "Sangat kuat", bar: "bg-teal-400", text: "text-teal-300" },
];

function getPasswordScore(value: string) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#121422] py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 transition focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/15 disabled:opacity-60";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.36 12.9c.02-2.16 1.77-3.2 1.85-3.25-1.01-1.48-2.59-1.68-3.15-1.7-1.34-.14-2.62.79-3.3.79-.68 0-1.73-.77-2.84-.75-1.46.02-2.81.85-3.56 2.16-1.52 2.63-.39 6.53 1.09 8.67.72 1.05 1.58 2.22 2.71 2.18 1.09-.04 1.5-.7 2.82-.7 1.31 0 1.68.7 2.83.68 1.17-.02 1.91-1.07 2.63-2.12.83-1.21 1.17-2.38 1.19-2.44-.03-.01-2.28-.87-2.3-3.47ZM14.2 6.36c.6-.73 1-1.74.89-2.75-.86.03-1.9.57-2.52 1.3-.55.64-1.04 1.67-.91 2.65.96.08 1.94-.48 2.54-1.2Z" />
    </svg>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const { register, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const busy = status !== "idle";
  const score = getPasswordScore(password);
  const strength = score > 0 ? strengthMeta[score - 1] : null;

  function showNotice(message: string) {
    setFeedback({ type: "info", message });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (name.trim().length < 2) {
      setFeedback({ type: "error", message: "Nama lengkap minimal 2 karakter." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFeedback({ type: "error", message: "Format email belum benar." });
      return;
    }

    if (phone.replace(/\D/g, "").length < 9) {
      setFeedback({ type: "error", message: "Nomor telepon minimal 9 digit." });
      return;
    }

    if (password.length < 8) {
      setFeedback({ type: "error", message: "Password minimal 8 karakter." });
      return;
    }

    if (password !== confirm) {
      setFeedback({ type: "error", message: "Konfirmasi password tidak sesuai." });
      return;
    }

    if (!agree) {
      setFeedback({
        type: "error",
        message: "Centang persetujuan Syarat & Ketentuan untuk melanjutkan.",
      });
      return;
    }

    setStatus("loading");

    try {
      await register({ name, email, phone, password });
      const user = await login(email, password);
      setStatus("success");
      setFeedback({
        type: "success",
        message: "Akun berhasil dibuat! Mengalihkan ke dashboard...",
      });
      window.setTimeout(
        () => router.replace(ROLE_HOME[user.role] ?? "/dashboard"),
        900,
      );
    } catch (error) {
      setStatus("idle");
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Registrasi gagal. Silakan coba lagi.",
      });
    }
  }

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-300">
            Nama lengkap
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={busy}
              placeholder="Nama sesuai identitas"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={busy}
              placeholder="nama@email.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-300">
            Nomor telepon
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={busy}
              placeholder="0812 3456 7890"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={busy}
              placeholder="Minimal 8 karakter"
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {password ? (
            <div className="mt-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500">Kekuatan password</span>
                <span className={`text-[11px] font-semibold ${strength?.text ?? ""}`}>
                  {strength?.label}
                </span>
              </div>
              <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                {strengthMeta.map((item, index) => (
                  <span
                    key={item.label}
                    className={`h-1.5 rounded-full transition ${
                      index < score ? item.bar : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-slate-300">
            Konfirmasi password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="confirm"
              name="confirm"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              disabled={busy}
              placeholder="Ulangi password"
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((value) => !value)}
              aria-label={
                showConfirm ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"
              }
              className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirm && confirm !== password ? (
            <p className="mt-1.5 text-[11px] text-rose-400">Password belum sama.</p>
          ) : null}
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-slate-400">
          <input
            type="checkbox"
            checked={agree}
            onChange={(event) => setAgree(event.target.checked)}
            disabled={busy}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-[#121422] accent-purple-600"
          />
          <span>
            Saya setuju dengan{" "}
            <button
              type="button"
              onClick={() => showNotice("Syarat & Ketentuan belum tersedia pada versi demo.")}
              className="font-medium text-purple-400 transition hover:text-purple-300"
            >
              Syarat & Ketentuan
            </button>{" "}
            serta{" "}
            <button
              type="button"
              onClick={() => showNotice("Kebijakan Privasi belum tersedia pada versi demo.")}
              className="font-medium text-purple-400 transition hover:text-purple-300"
            >
              Kebijakan Privasi
            </button>{" "}
            KONSERVIBE.
          </span>
        </label>

        {feedback ? (
          <div
            role={feedback.type === "error" ? "alert" : "status"}
            aria-live="polite"
            className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-xs leading-relaxed ${feedbackStyles[feedback.type].box}`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2
                className={`mt-0.5 h-4 w-4 shrink-0 ${feedbackStyles[feedback.type].icon}`}
              />
            ) : (
              <Info className={`mt-0.5 h-4 w-4 shrink-0 ${feedbackStyles[feedback.type].icon}`} />
            )}
            {feedback.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/40 transition hover:from-purple-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Membuat akun...
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Akun dibuat!
            </>
          ) : (
            <>
              Daftar sekarang
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-slate-600">
        <span className="h-px flex-1 bg-white/10" />
        atau daftar dengan
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => showNotice("Daftar dengan Google belum tersedia pada versi demo.")}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]"
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          onClick={() => showNotice("Daftar dengan Apple belum tersedia pada versi demo.")}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]"
        >
          <AppleIcon />
          Apple
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-purple-400 transition hover:text-purple-300">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
