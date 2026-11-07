"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { api, formatDateID, formatRupiah, type PublicEvent } from "@/lib/api";

export default function Home() {
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0A0714] font-sans text-white">
      <Navbar />
      <main>
        <Hero onSearch={setSearchKeyword} />
        <StatsStrip />
        <UpcomingConcerts keyword={searchKeyword} />
        <PopularGenres />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                        */
/* ------------------------------------------------------------------ */

const dotsPattern = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
  backgroundSize: "14px 14px",
};

function Dots({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`} style={dotsPattern} />
  );
}

function LogoMark() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M9 18V5l12-2v13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="18" r="3" stroke="white" strokeWidth="2" />
        <circle cx="18" cy="16" r="3" stroke="white" strokeWidth="2" />
      </svg>
    </div>
  );
}

function GenreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 18V5l12-2v13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <circle cx="6" cy="18" r="3" stroke="white" strokeWidth="1.8" opacity="0.9" />
      <circle cx="18" cy="16" r="3" stroke="white" strokeWidth="1.8" opacity="0.9" />
    </svg>
  );
}

function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function StarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5l2.9 5.88 6.5.95-4.7 4.58 1.11 6.47L12 17.58l-5.81 3.05 1.11-6.47-4.7-4.58 6.5-.95L12 2.5Z" />
    </svg>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-10 ${center ? "mx-auto max-w-2xl text-center" : ""}`}>
      <p className="text-xs font-bold tracking-[0.25em] text-pink-400">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className={`mt-3 max-w-xl ${center ? "mx-auto" : ""} text-gray-400`}>{subtitle}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

const navLinks = [
  { label: "Beranda", href: "#beranda" },
  { label: "Konser", href: "#konser" },
  { label: "Genre", href: "#genre" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Tentang", href: "#tentang" },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0714]/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#beranda" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-lg font-extrabold tracking-[0.2em]">KONSERVIBE</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium transition hover:bg-white/10"
          >
            Log-In
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2 text-sm font-semibold transition hover:opacity-90"
          >
            Daftar
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-300 md:hidden"
        >
          {open ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-[#0A0714] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium text-gray-300">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="transition hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-5 flex items-center gap-3">
            <Link
              href="/login"
              className="flex-1 rounded-full border border-white/20 py-2.5 text-center text-sm font-medium transition hover:bg-white/10"
            >
              Log-In
            </Link>
            <Link
              href="/register"
              className="flex-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 py-2.5 text-center text-sm font-semibold transition hover:opacity-90"
            >
              Daftar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const heroAvatars = [
  { initial: "A", cls: "from-pink-500 to-rose-600" },
  { initial: "R", cls: "from-sky-500 to-cyan-600" },
  { initial: "F", cls: "from-amber-500 to-orange-600" },
  { initial: "N", cls: "from-emerald-500 to-teal-600" },
];

const popularSearches = ["Coldplay", "NIKI", "K-Pop", "Jazz", "Hip Hop"];

function Hero({ onSearch }: { onSearch: (keyword: string) => void }) {
  const [keyword, setKeyword] = useState("");

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(keyword.trim());
    document.getElementById("konser")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="beranda" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
        <Dots className="left-8 top-10 hidden h-40 w-40 opacity-50 lg:block" />
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 pb-20 pt-14 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold text-pink-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pink-400" />
            Festival &amp; Konser Terbesar 2026
          </span>

          <h1 className="mt-5 text-5xl font-extrabold leading-[1.08] tracking-tight md:text-6xl">
            Experience Live Music{" "}
            <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Like Never Before
            </span>
          </h1>

          <p className="mt-5 max-w-md text-gray-400">
            Temukan dan pesan tiket konser favoritmu dengan mudah dan aman. Satu platform untuk semua
            event live terbaik.
          </p>

          <form onSubmit={submitSearch} className="relative mt-8 max-w-lg">
            <div className="pointer-events-none absolute -left-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-purple-600/30 blur-3xl" />
            <div className="relative flex items-center rounded-full bg-white p-1.5 shadow-2xl shadow-purple-950/50">
              <SearchIcon className="ml-4 mr-2 h-4 w-4 shrink-0 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Cari konser, artis, atau genre..."
                className="w-full bg-transparent px-2 py-2.5 text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
              />
              <button type="submit" className="shrink-0 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
                Cari
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <span className="mr-1">Populer:</span>
            {popularSearches.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setKeyword(t);
                  onSearch(t);
                  document.getElementById("konser")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full border border-white/10 px-3 py-1 transition hover:border-pink-500/40 hover:text-white"
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {heroAvatars.map((a) => (
                <div
                  key={a.initial}
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${a.cls} ring-2 ring-[#0A0714]`}
                >
                  <span className="text-xs font-bold">{a.initial}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-3.5 w-3.5" />
                ))}
                <span className="ml-1.5 text-sm font-semibold text-white">4.9/5</span>
              </div>
              <p className="text-xs text-gray-400">Dipercaya 150.000+ penggila musik</p>
            </div>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto hidden w-full max-w-md lg:block">
      <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-fuchsia-600/25 via-purple-600/15 to-transparent blur-2xl" />

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-purple-950/50 backdrop-blur">
        <div className="relative h-52 bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-900">
          <Dots className="inset-0 opacity-40" />
          <div className="absolute left-5 top-5 rounded-full bg-black/40 px-3 py-1 text-xs font-bold backdrop-blur">
            LIVE · SAB, 15 OKT 2026
          </div>
          <div className="absolute bottom-5 left-5">
            <h3 className="text-2xl font-extrabold tracking-wide">COLDPLAY</h3>
            <p className="text-sm text-white/80">Music of the Spheres World Tour</p>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm text-gray-400">Jakarta Internasional Stadium</p>
              <p className="mt-0.5 font-bold">Mulai dari Rp 750.000</p>
            </div>
            <button className="shrink-0 rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold transition hover:bg-pink-600">
              Beli Tiket
            </button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Tiket tersisa</span>
              <span className="text-pink-300">23%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[23%] rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-8 -top-6 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#15102b] px-4 py-3 shadow-xl">
        <span className="text-lg">🔥</span>
        <div>
          <p className="text-sm font-bold leading-none">85K+</p>
          <p className="mt-0.5 text-[11px] text-gray-400">Tiket terjual</p>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-10 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#15102b] px-4 py-3 shadow-xl">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
          <StarIcon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-bold leading-none">12rb+ Ulasan</p>
          <p className="mt-0.5 text-[11px] text-gray-400">Rating dari pengguna</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

const stats = [
  { value: "500+", label: "Event & Konser" },
  { value: "150K+", label: "Pengguna Terdaftar" },
  { value: "38", label: "Genre Musik" },
  { value: "24/7", label: "Layanan Pelanggan" },
];

function StatsStrip() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 text-center md:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="bg-gradient-to-r from-pink-500 to-fuchsia-400 bg-clip-text text-3xl font-extrabold text-transparent">
              {s.value}
            </p>
            <p className="mt-1 text-sm text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Concerts                                                            */
/* ------------------------------------------------------------------ */

function UpcomingConcerts({ keyword }: { keyword: string }) {
  const [response, setResponse] = useState<{
    keyword: string | null;
    events: PublicEvent[];
    error: string;
  }>({ keyword: null, events: [], error: "" });

  useEffect(() => {
    const controller = new AbortController();

    const query = new URLSearchParams({ limit: "6" });
    if (keyword) query.set("keyword", keyword);

    api
      .get<PublicEvent[]>(`/events?${query.toString()}`, {
        anonymous: true,
        signal: controller.signal,
      })
      .then((result) => {
        if (!controller.signal.aborted) {
          setResponse({ keyword, events: result ?? [], error: "" });
        }
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setResponse({
            keyword,
            events: [],
            error: requestError instanceof Error ? requestError.message : "Gagal memuat event.",
          });
        }
      });

    return () => controller.abort();
  }, [keyword]);

  const loading = response.keyword !== keyword;
  const events = loading ? [] : response.events;
  const error = loading ? "" : response.error;

  return (
    <section id="konser" className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <SectionHeader eyebrow="JADWAL" title="Konser Mendatang" subtitle="Jangan sampai kehabisan tiket, kuota terbatas untuk setiap event." />
          <a
          href="#konser"
          className="rounded-full border border-pink-500/40 px-5 py-2 text-sm font-semibold text-pink-400 transition hover:bg-pink-500/10"
        >
          Lihat Semua
        </a>
      </div>

      {loading ? (
        <p role="status" className="py-10 text-center text-sm text-gray-400">Memuat event...</p>
      ) : error ? (
        <p role="alert" className="py-10 text-center text-sm text-rose-300">{error}</p>
      ) : events.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">
          {keyword ? `Tidak ada event untuk "${keyword}".` : "Belum ada event yang tersedia."}
        </p>
      ) : (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {events.map((event) => (
          <article
            key={event.id}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-2xl hover:shadow-pink-950/40"
          >
            <div
              className="relative h-44 bg-gradient-to-br from-fuchsia-700 via-indigo-800 to-slate-950 bg-cover bg-center"
              style={event.poster_url ? { backgroundImage: `url("${event.poster_url}")` } : undefined}
            >
              <Dots className="inset-0 opacity-30" />
              <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-[11px] font-bold backdrop-blur">
                {event.category_name}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 text-xs font-bold text-white/90">
                {formatDateID(event.date)}
              </div>
            </div>

            <div className="p-5">
              <h3 className="truncate text-lg font-extrabold tracking-wide" title={event.title}>{event.title}</h3>
              <p className="text-sm text-gray-400">{event.organizer_name}</p>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-300">
                <LocationIcon className="h-4 w-4 text-pink-400" />
                <span className="truncate">{event.venue}, {event.city}</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <p className="text-[11px] text-gray-500">Mulai dari</p>
                  <p className="font-bold">{event.min_price == null ? "Belum tersedia" : formatRupiah(event.min_price)}</p>
                </div>
                <Link href={`/konser/${event.id}`} className="rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold transition hover:bg-pink-600">
                  Detail Event
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Genres                                                              */
/* ------------------------------------------------------------------ */

const genres = [
  { name: "POP", gradient: "from-pink-500 to-rose-600" },
  { name: "ROCK", gradient: "from-indigo-600 to-blue-800" },
  { name: "EDM", gradient: "from-cyan-400 to-blue-700" },
  { name: "HIP HOP", gradient: "from-amber-500 to-orange-700" },
  { name: "R&B", gradient: "from-purple-500 to-pink-700" },
  { name: "JAZZ", gradient: "from-yellow-600 to-amber-800" },
  { name: "K-POP", gradient: "from-fuchsia-500 to-purple-800" },
  { name: "METAL", gradient: "from-red-700 to-neutral-900" },
  { name: "INDIE", gradient: "from-teal-500 to-emerald-700" },
];

function PopularGenres() {
  return (
    <section id="genre" className="border-t border-white/5 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeader eyebrow="EKSPLORASI" title="Genre Populer" subtitle="Temukan event sesuai selera musikmu, dari Pop sampai Metal." />
          <a
            href="#genre"
            className="rounded-full border border-pink-500/40 px-5 py-2 text-sm font-semibold text-pink-400 transition hover:bg-pink-500/10"
          >
            Lihat Semua
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6 lg:grid-cols-9">
          {genres.map((g) => (
            <button
              key={g.name}
              className={`flex h-24 flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${g.gradient} shadow-lg transition hover:scale-105 hover:shadow-xl hover:shadow-black/40`}
            >
              <GenreIcon />
              <span className="text-xs font-bold tracking-wide">{g.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

const steps = [
  {
    title: "Cari Konser",
    desc: "Telusuri ribuan event dan artis favoritmu dalam satu platform.",
  },
  {
    title: "Pilih Tiket",
    desc: "Pilih kategori tiket dan kursi yang sesuai budget serta keinginanmu.",
  },
  {
    title: "Bayar & Masuk",
    desc: "Transaksi aman, e-tiket langsung di genggaman. Tinggal klaim di lokasi.",
  },
];

function HowItWorks() {
  return (
    <section id="cara-kerja" className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
      <SectionHeader
        center
        eyebrow="CARA KERJA"
        title="Pesan Tiket Semudah 1-2-3"
        subtitle="Tidak perlu antre lagi. Ikuti tiga langkah sederhana ini untuk mendapatkan tiket konser impianmu."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-pink-500/40"
          >
            <span className="pointer-events-none absolute -right-2 -top-6 bg-gradient-to-br from-white/15 to-transparent bg-clip-text text-8xl font-black text-transparent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-sm font-bold">
              {i + 1}
            </div>
            <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-gray-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA                                                                 */
/* ------------------------------------------------------------------ */

function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-800 px-6 py-16 text-center md:px-12">
        <Dots className="inset-0 opacity-25" />
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />

        <div className="relative">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Siap Jadi Bagian dari Festival?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Daftar sekarang dan nikmati akses pre-sale, notifikasi artis, serta rekomendasi konser
            yang personal sesuai seleramu.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-white px-7 py-3 text-sm font-bold text-purple-700 transition hover:bg-purple-50"
            >
              Daftar Gratis
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Jadilah Event Organizer
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

const footerCols = [
  {
    title: "Perusahaan",
    links: ["Tentang Kami", "Karier", "Blog", "Menjadi Mitra"],
  },
  {
    title: "Bantuan",
    links: ["FAQ", "Pusat Bantuan", "Kebijakan Privasi", "Syarat & Ketentuan"],
  },
  {
    title: "Kontak",
    links: ["halo@konservibe.id", "+62 21 1234 5678", "Jakarta, Indonesia"],
  },
];

function Footer() {
  return (
    <footer id="tentang" className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <a href="#beranda" className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-lg font-extrabold tracking-[0.2em]">KONSERVIBE</span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-gray-400">
              Platform tiket konser &amp; event live terpercaya untuk semua pecinta musik Indonesia.
            </p>
            <div className="mt-5 flex gap-3">
              {["IG", "X", "TT", "YT"].map((s) => (
                <a
                  key={s}
                  href="#beranda"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xs font-bold transition hover:border-pink-500/50 hover:text-pink-400"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {footerCols.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300">{col.title}</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#beranda" className="transition hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-gray-500 md:flex-row">
          <p>© 2026 KONSERVIBE. Semua hak dilindungi.</p>
          <p>Dibuat dengan 💜 untuk musik</p>
        </div>
      </div>
    </footer>
  );
}