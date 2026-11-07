import { AdminPageHeading } from "../page-heading";
import { SettingsForm } from "./settings-form";

export default function SuperadminSettingsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeading
        eyebrow="Sistem Settings"
        title="Pengaturan Platform"
        description="Konfigurasi identitas, komisi, payout, dan preferensi operasional KONSERVIBE."
      />
      <SettingsForm />
    </div>
  );
}
