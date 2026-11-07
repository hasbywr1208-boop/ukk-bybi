import type { Metadata } from "next";

import { ProfileContent } from "./profile-content";

export const metadata: Metadata = {
  title: "Profil — KONSERVIBE",
  description: "Lihat dan kelola informasi akun KONSERVIBE kamu.",
};

export default function ProfilePage() {
  return <ProfileContent />;
}
