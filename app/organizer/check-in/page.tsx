import { OrganizerPageHeading } from "../page-heading";
import { CheckInScanner } from "./check-in-scanner";

export default function OrganizerCheckInPage() {
  return (
    <div className="space-y-6">
      <OrganizerPageHeading
        eyebrow="Tiket Check-in"
        title="Check-in Pengunjung"
        description="Scan dan validasi e-ticket pengunjung secara real-time di setiap gate."
      />
      <CheckInScanner />
    </div>
  );
}
