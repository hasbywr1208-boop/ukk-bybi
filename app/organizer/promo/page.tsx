import { OrganizerPageHeading } from "../page-heading";
import { PromoManager } from "./promo-manager";

export default function OrganizerPromoPage() {
  return (
    <div className="space-y-6">
      <OrganizerPageHeading
        eyebrow="Promo"
        title="Kelola Promo"
        description="Buat kode diskon, atur kuota, dan pantau penggunaan promo per konser."
      />
      <PromoManager />
    </div>
  );
}
