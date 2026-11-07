import { OrganizerPageHeading } from "../page-heading";
import { ConcertManager } from "./concert-manager";

export default function OrganizerConcertsPage() {
  return (
    <div className="space-y-6">
      <OrganizerPageHeading
        eyebrow="Manage Konser"
        title="Kelola Konser"
        description="Buat, edit, publikasikan, dan pantau seluruh konser yang Anda selenggarakan."
      />
      <ConcertManager />
    </div>
  );
}
