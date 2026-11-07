import type { Metadata } from "next";

import { OrderHistory } from "./order-history";

export const metadata: Metadata = {
  title: "Riwayat Pembelian — KONSERVIBE",
  description: "Semua transaksi tiket konser yang pernah kamu lakukan.",
};

export default function OrderHistoryPage() {
  return <OrderHistory />;
}
