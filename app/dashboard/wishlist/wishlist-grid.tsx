"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { api } from "@/lib/api";
import { fetchWishlist, type WishlistRow } from "@/lib/customer";

type IconProps = { className?: string };

function HeartIcon({ className, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function CloseIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 6-12 12M6 6l12 12" />
    </svg>
  );
}

function TicketIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 0 0 6v3h20v-3a3 3 0 0 1 0-6V6H2z" />
      <path d="M13 6v2m0 4v2m0 4v1" />
    </svg>
  );
}

export function WishlistGrid() {
  const [items, setItems] = useState<WishlistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchWishlist()
      .then((rows) => {
        if (active) {
          setItems(rows ?? []);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Gagal memuat wishlist.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function remove(id: string) {
    const previous = items;
    setItems((current) => current.filter((item) => item.id !== id));
    try {
      await api.delete(`/wishlist/${id}`);
    } catch (err) {
      setItems(previous);
      setError(err instanceof Error ? err.message : "Gagal menghapus dari wishlist.");
    }
  }

  if (loading) {
    return (
      <div className="mt-6 rounded-2xl border border-white/5 bg-[#121422] px-6 py-14 text-center text-sm text-slate-500">
        Memuat wishlist...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-[#121422] px-6 py-16 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-600/15 text-purple-300">
          <HeartIcon className="h-7 w-7" />
        </span>
        <p className="mt-4 text-base font-semibold">Wishlist kamu masih kosong</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
          Simpan konser favorit dengan menekan ikon hati, lalu kembali ke sini untuk membelinya.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
        >
          <TicketIcon className="h-4 w-4" />
          Jelajahi Konser
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-6 text-xs text-slate-500">
        {items.length} konser tersimpan di wishlist kamu.
      </p>

      {error ? (
        <p className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((concert) => (
          <article
            key={concert.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#121422] transition hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-950/30"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={concert.poster}
                alt={concert.posterAlt}
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 92vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur">
                {concert.genre}
              </span>
              <button
                type="button"
                onClick={() => remove(concert.id)}
                aria-label={`Hapus ${concert.title} dari wishlist`}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-pink-400 backdrop-blur transition hover:bg-pink-500 hover:text-white"
              >
                <HeartIcon className="h-4 w-4" filled />
              </button>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h2 className="text-base font-semibold leading-snug">{concert.title}</h2>
              <p className="mt-1 text-xs text-slate-400">{concert.date}</p>
              <p className="mt-0.5 truncate text-xs text-slate-500">{concert.venue}</p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-base font-bold text-purple-400">{concert.price}</p>
                <span className="rounded-full border border-white/5 px-2 py-0.5 text-[10px] text-slate-500">
                  {concert.addedAt}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/events/${concert.id}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-500"
                >
                  <TicketIcon className="h-4 w-4" />
                  Beli Tiket
                </Link>
                <button
                  type="button"
                  onClick={() => remove(concert.id)}
                  aria-label={`Hapus ${concert.title}`}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-rose-500/40 hover:text-rose-400"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
