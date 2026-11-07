import { OrganizerPageHeading } from "../page-heading";
import { WithdrawManager } from "./withdraw-manager";

export default function OrganizerWithdrawPage() {
  return (
    <div className="space-y-6">
      <OrganizerPageHeading
        eyebrow="Withdraw"
        title="Pencairan Dana"
        description="Ajukan pencairan saldo pendapatan dan pantau status transfer ke rekening organizer."
      />
      <WithdrawManager />
    </div>
  );
}
