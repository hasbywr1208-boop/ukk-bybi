import type { Metadata } from "next";

import { PageHeading } from "../page-heading";
import { WishlistGrid } from "./wishlist-grid";

export const metadata: Metadata = {
  title: "Wishlist — KONSERVIBE",
  description: "Konser favorit yang kamu simpan untuk dibeli nanti.",
};

export default function WishlistPage() {
  return (
    <>
      <PageHeading
        eyebrow="Favorit Saya"
        title="Wishlist"
        description="Simpan konser incaranmu supaya tidak ketinggalan saat tiket dibuka."
      />
      <WishlistGrid />
    </>
  );
}
