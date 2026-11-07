import { AdminPageHeading } from "../page-heading";
import { ConcertMonitor } from "./concert-monitor";

export default function SuperadminKonserPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeading
        eyebrow="Monitor Konser"
        title="Monitoring Konser"
        description="Pantau seluruh konser, kapasitas tiket, dan pendapatan secara real-time."
      />
      <ConcertMonitor />
    </div>
  );
}
