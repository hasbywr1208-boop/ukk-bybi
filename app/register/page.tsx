import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { RegisterForm } from "./register-form";

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MusicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M9 18V6l10-2v12" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </svg>
  );
}

function TicketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path
        d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 6v12" strokeDasharray="2 3" strokeLinecap="round" />
    </svg>
  );
}

function BoltIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 21a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.8l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 2.8z" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Daftar — KONSERVIBE",
  description:
    "Buat akun KONSERVIBE gratis untuk membeli tiket konser, mengakses pre-sale, dan mendapatkan notifikasi artis favoritmu.",
};

const dotsPattern = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.28) 1px, transparent 1px)",
  backgroundSize: "16px 16px",
};

const benefits = [
  {
    icon: TicketIcon,
    title: "E-ticket instan",
    description: "Tiket langsung masuk ke akun setelah pembayaran terkonfirmasi.",
    tone: "bg-purple-500/15 text-purple-300",
  },
  {
    icon: BoltIcon,
    title: "Akses pre-sale",
    description: "Kesempatan lebih dulu membeli tiket event yang paling dicari.",
    tone: "bg-fuchsia-500/15 text-fuchsia-300",
  },
  {
    icon: BellIcon,
    title: "Notifikasi personal",
    description: "Dapatkan kabar konser dan artis favorit tanpa ketinggalan.",
    tone: "bg-sky-500/15 text-sky-300",
  },
];

function LogoMark() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-950/50">
      <MusicIcon className="h-5 w-5 text-white" />
    </span>
  );
}

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090b13] font-sans text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-fuchsia-700/20 blur-3xl" />
        <div className="absolute -bottom-52 left-1/4 h-[28rem] w-[28rem] rounded-full bg-purple-700/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:flex-row lg:gap-10 lg:px-10 lg:py-10">
        <aside className="relative order-2 mt-10 hidden w-[46%] shrink-0 lg:order-1 lg:mt-0 lg:flex">
          <div className="relative flex w-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#1b1138] via-[#120b26] to-[#0b0818] p-8 xl:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-25"
              style={dotsPattern}
            />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-600/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />

            <div className="relative flex items-center justify-between">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white/80 backdrop-blur">
                MEMBER BARU · 2026
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/70">
                <StarIcon className="h-3.5 w-3.5 text-amber-400" />
                4.9/5 dari 12rb ulasan
              </span>
            </div>

            <div className="relative mt-10">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight xl:text-4xl">
                Dari klik pertama,{" "}
                <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  sampai encore terakhir.
                </span>
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                Satu akun untuk semua pengalaman live music—beli tiket, simpan event, dan kelola
                e-ticket tanpa ribet.
              </p>
            </div>

            <ul className="relative mt-8 space-y-3">
              {benefits.map((benefit) => (
                <li
                  key={benefit.title}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${benefit.tone}`}
                  >
                    <benefit.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{benefit.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-white/50">
                      {benefit.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur">
              <div className="flex gap-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src="/posters/coldplay.svg"
                    alt="Poster Coldplay World Tour"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      PRESALE
                    </span>
                    <span className="text-[10px] text-white/50">20 Des 2026</span>
                  </div>
                  <h3 className="mt-1.5 truncate text-sm font-bold">Coldplay World Tour</h3>
                  <p className="truncate text-xs text-white/50">
                    Jakarta International Stadium
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-white">Rp 750.000</p>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-purple-700">
                      Mulai dari
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-auto pt-8">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="flex -space-x-2">
                  {[
                    { initial: "A", cls: "from-pink-500 to-rose-600" },
                    { initial: "R", cls: "from-sky-500 to-cyan-600" },
                    { initial: "N", cls: "from-emerald-500 to-teal-600" },
                  ].map((avatar) => (
                    <span
                      key={avatar.initial}
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${avatar.cls} text-[10px] font-bold ring-2 ring-[#120b26]`}
                    >
                      {avatar.initial}
                    </span>
                  ))}
                </div>
                <p className="text-xs leading-snug text-white/60">
                  <span className="font-semibold text-white">Bagas S.</span> — “Daftar cuma
                  sebentar, langsung bisa ikut pre-sale.”
                </p>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xl font-extrabold text-white">500+</p>
                  <p className="text-[10px] text-white/50">Event live</p>
                </div>
                <div className="border-x border-white/10">
                  <p className="text-xl font-extrabold text-white">150K+</p>
                  <p className="text-[10px] text-white/50">Pengguna</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-white">24/7</p>
                  <p className="text-[10px] text-white/50">Support</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="order-1 flex flex-1 flex-col lg:order-2">
          <header className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-base font-extrabold tracking-[0.2em]">KONSERVIBE</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-xs font-medium text-slate-400 transition hover:border-purple-500/40 hover:text-white"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              Beranda
            </Link>
          </header>

          <div className="flex flex-1 items-center justify-center py-10 lg:py-8">
            <div className="w-full max-w-md">
              <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-600/10 px-3 py-1 text-xs font-semibold text-fuchsia-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-400" />
                Gratis · kurang dari 1 menit
              </span>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Buat akun{" "}
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  KONSERVIBE
                </span>
              </h1>
              <p className="mt-2.5 text-sm text-slate-400">
                Mulai koleksi momen live-mu. Daftar gratis dan nikmati akses pre-sale lebih awal.
              </p>

              <RegisterForm />

              <p className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-slate-600">
                <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                Versi demo—data pendaftaran tidak dikirim ke server.
              </p>
            </div>
          </div>

          <footer className="text-center text-[11px] text-slate-600 lg:text-left">
            &copy; 2026 KONSERVIBE. Semua hak dilindungi.
          </footer>
        </div>
      </div>
    </div>
  );
}
