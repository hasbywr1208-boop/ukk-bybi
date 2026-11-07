import { AdminPageHeading } from "../page-heading";
import { PaymentTable } from "./payment-table";

export default function SuperadminPaymentsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeading
        eyebrow="Manage Payment"
        title="Kelola Pembayaran"
        description="Verifikasi transaksi, tangani kegagalan pembayaran, dan proses refund tiket."
      />
      <PaymentTable />
    </div>
  );
}
