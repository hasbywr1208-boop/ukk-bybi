import type { Metadata } from "next";

import { PageHeading } from "../page-heading";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Pengaturan — KONSERVIBE",
  description: "Atur preferensi akun, notifikasi, dan keamanan KONSERVIBE kamu.",
};

export default function SettingsPage() {
  return (
    <>
      <PageHeading
        eyebrow="Preferensi"
        title="Pengaturan"
        description="Sesuaikan data akun, notifikasi, dan keamanan sesuai kebutuhanmu."
      />
      <SettingsForm />
    </>
  );
}
