import { OrganizerPageHeading } from "../page-heading";
import { OrdersTable } from "./orders-table";

export default function OrganizerOrdersPage() {
  return (
    <div className="space-y-6">
      <OrganizerPageHeading
        eyebrow="Orders"
        title="Pesanan Tiket"
        description="Pantau pembayaran, konfirmasi pesanan, batalkan transaksi, dan proses refund."
      />
      <OrdersTable />
    </div>
  );
}
