import { OrganizerPageHeading } from "../page-heading";
import { TicketManager } from "./ticket-manager";

export default function OrganizerTicketsPage() {
  return (
    <div className="space-y-6">
      <OrganizerPageHeading
        eyebrow="Tiket Management"
        title="Kelola Tiket"
        description="Atur tipe tiket, harga, kuota, dan ketersediaan untuk setiap konser."
      />
      <TicketManager />
    </div>
  );
}
