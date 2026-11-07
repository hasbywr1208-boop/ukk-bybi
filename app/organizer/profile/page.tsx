import { OrganizerPageHeading } from "../page-heading";
import { ProfileForm } from "./profile-form";

export default function OrganizerProfilePage() {
  return (
    <div className="space-y-6">
      <OrganizerPageHeading
        eyebrow="Profil"
        title="Profil Organizer"
        description="Kelola informasi perusahaan, rekening pencairan, dan keamanan akun organizer."
      />
      <ProfileForm />
    </div>
  );
}
