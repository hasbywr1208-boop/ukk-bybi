import { AdminPageHeading } from "../page-heading";
import { OrganizerList } from "./organizer-list";

export default function SuperadminOrganizersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeading
        eyebrow="Verifikasi Organizer"
        title="Pusat Verifikasi Mitra"
        description="Tinjau dokumen, setujui, atau tolak pengajuan organizer yang ingin bergabung."
      />
      <OrganizerList />
    </div>
  );
}
