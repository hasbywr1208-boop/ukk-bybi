import { AdminPageHeading } from "../page-heading";
import { UsersTable } from "./users-table";

export default function SuperadminUsersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeading
        eyebrow="Manage User"
        title="Kelola Pengguna"
        description="Cari, tinjau, dan atur status akun pengguna maupun organizer KONSERVIBE."
      />
      <UsersTable />
    </div>
  );
}
