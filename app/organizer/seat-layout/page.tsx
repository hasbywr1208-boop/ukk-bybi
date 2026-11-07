import { OrganizerPageHeading } from "../page-heading";
import { SeatLayoutManager } from "./seat-layout-manager";

export default function OrganizerSeatLayoutPage() {
  return (
    <div className="space-y-6">
      <OrganizerPageHeading
        eyebrow="Seat Layout"
        title="Pengaturan Layout Kursi"
        description="Buat denah venue, atur section, dan tentukan harga kursi per zona."
      />
      <SeatLayoutManager />
    </div>
  );
}
