import type { Metadata } from "next";

import { PageHeading } from "../page-heading";
import { TicketList } from "./ticket-list";

export const metadata: Metadata = {
  title: "Tiket Saya — KONSERVIBE",
  description: "Kelola semua e-ticket konser milikmu dalam satu tempat.",
};

export default function MyTicketsPage() {
  return (
    <>
      <PageHeading
        eyebrow="E-Ticket"
        title="Tiket Saya"
        description="Lihat, unduh, dan tunjukkan e-ticket konser milikmu saat hari-H."
      />
      <TicketList />
    </>
  );
}
