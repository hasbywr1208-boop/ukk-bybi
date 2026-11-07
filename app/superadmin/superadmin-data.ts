export type AdminRole = "User" | "Organizer" | "Superadmin";
export type UserStatus = "Aktif" | "Nonaktif" | "Ditangguhkan";
export type OrganizerStatus = "Menunggu" | "Terverifikasi" | "Ditolak";
export type ConcertStatus = "Aktif" | "Menunggu" | "Selesai" | "Dibatalkan";
export type PaymentStatus = "Berhasil" | "Menunggu" | "Gagal" | "Refund";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: UserStatus;
  city: string;
  joined: string;
  orders: number;
  spent: number;
  initials: string;
}

export interface Organizer {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  events: number;
  status: OrganizerStatus;
  submittedAt: string;
  documents: number;
  initials: string;
}

export interface AdminConcert {
  id: string;
  title: string;
  organizer: string;
  venue: string;
  city: string;
  date: string;
  status: ConcertStatus;
  ticketsSold: number;
  capacity: number;
  revenue: number;
}

export interface AdminPayment {
  id: string;
  user: string;
  email: string;
  concert: string;
  method: string;
  amount: number;
  fee: number;
  status: PaymentStatus;
  date: string;
}

export interface OrganizerRevenue {
  id: string;
  organizer: string;
  events: number;
  tickets: number;
  gross: number;
  fee: number;
  net: number;
  growth: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ShareItem {
  label: string;
  value: number;
  color: string;
}

export interface AdminNotification {
  id: string;
  text: string;
  time: string;
  unread: boolean;
  tone: "info" | "warning" | "success";
}

export const adminProfile = {
  name: "Raka Pratama",
  role: "Superadmin",
  email: "raka@konservibe.id",
  initials: "RP",
};

export const adminUsers: AdminUser[] = [
  { id: "USR-001", name: "Chiara Anindya", email: "chiara@konservibe.id", role: "User", status: "Aktif", city: "Jakarta", joined: "12 Jan 2025", orders: 12, spent: 3_400_000, initials: "CA" },
  { id: "USR-002", name: "Bagas Saputra", email: "bagas@konservibe.id", role: "User", status: "Aktif", city: "Bandung", joined: "3 Feb 2025", orders: 5, spent: 2_100_000, initials: "BS" },
  { id: "USR-003", name: "Nadia Putri", email: "nadia@euphorialive.id", role: "Organizer", status: "Aktif", city: "Jakarta", joined: "18 Feb 2025", orders: 0, spent: 0, initials: "NP" },
  { id: "USR-004", name: "Rizky Maulana", email: "rizky@konservibe.id", role: "User", status: "Ditangguhkan", city: "Surabaya", joined: "7 Mar 2025", orders: 8, spent: 4_200_000, initials: "RM" },
  { id: "USR-005", name: "Sinta Dewi", email: "sinta@konservibe.id", role: "User", status: "Aktif", city: "Yogyakarta", joined: "21 Mar 2025", orders: 3, spent: 1_100_000, initials: "SD" },
  { id: "USR-006", name: "Fajar Nugroho", email: "fajar@urbanstage.id", role: "Organizer", status: "Aktif", city: "Semarang", joined: "2 Apr 2025", orders: 0, spent: 0, initials: "FN" },
  { id: "USR-007", name: "Alya Ramadhani", email: "alya@konservibe.id", role: "User", status: "Aktif", city: "Medan", joined: "19 Apr 2025", orders: 6, spent: 2_750_000, initials: "AR" },
  { id: "USR-008", name: "Dimas Prakoso", email: "dimas@konservibe.id", role: "User", status: "Nonaktif", city: "Bali", joined: "5 Mei 2025", orders: 1, spent: 550_000, initials: "DP" },
  { id: "USR-009", name: "Kirana Larasati", email: "kirana@konservibe.id", role: "User", status: "Aktif", city: "Jakarta", joined: "23 Mei 2025", orders: 9, spent: 5_250_000, initials: "KL" },
  { id: "USR-010", name: "Yoga Pratama", email: "yoga@soundwave.id", role: "Organizer", status: "Aktif", city: "Bandung", joined: "11 Jun 2025", orders: 0, spent: 0, initials: "YP" },
  { id: "USR-011", name: "Melati Sari", email: "melati@konservibe.id", role: "User", status: "Aktif", city: "Malang", joined: "28 Jun 2025", orders: 2, spent: 800_000, initials: "MS" },
  { id: "USR-012", name: "Raka Pratama", email: "raka@konservibe.id", role: "Superadmin", status: "Aktif", city: "Jakarta", joined: "1 Jan 2025", orders: 0, spent: 0, initials: "RP" },
];

export const organizers: Organizer[] = [
  { id: "ORG-001", name: "Soundwave Nusantara", contact: "Yoga Pratama", email: "hello@soundwave.id", phone: "+62 812 1100 2200", city: "Bandung", category: "Music Festival", events: 2, status: "Menunggu", submittedAt: "2 hari lalu", documents: 4, initials: "SN" },
  { id: "ORG-002", name: "Euphoria Live", contact: "Nadia Putri", email: "nadia@euphorialive.id", phone: "+62 811 2233 4455", city: "Jakarta", category: "Concert Promoter", events: 14, status: "Terverifikasi", submittedAt: "12 Jan 2025", documents: 6, initials: "EL" },
  { id: "ORG-003", name: "Prambanan Music", contact: "Aditya Seno", email: "team@prambananmusic.id", phone: "+62 813 9988 7766", city: "Yogyakarta", category: "Cultural Event", events: 1, status: "Menunggu", submittedAt: "5 hari lalu", documents: 3, initials: "PM" },
  { id: "ORG-004", name: "Urban Stage", contact: "Fajar Nugroho", email: "fajar@urbanstage.id", phone: "+62 812 5566 7788", city: "Bandung", category: "Concert Promoter", events: 9, status: "Terverifikasi", submittedAt: "2 Apr 2025", documents: 5, initials: "US" },
  { id: "ORG-005", name: "Nusantara Fest", contact: "Bimo Hartono", email: "info@nusantarafest.id", phone: "+62 811 3344 5566", city: "Surabaya", category: "Music Festival", events: 0, status: "Ditolak", submittedAt: "9 hari lalu", documents: 2, initials: "NF" },
  { id: "ORG-006", name: "Blue Horizon Entertainment", contact: "Ayu Lestari", email: "ayu@bluehorizon.id", phone: "+62 813 2211 4455", city: "Bali", category: "Concert Promoter", events: 6, status: "Terverifikasi", submittedAt: "7 Jul 2025", documents: 5, initials: "BH" },
  { id: "ORG-007", name: "Gemilang Production", contact: "Hendra Wijaya", email: "hendra@gemilang.id", phone: "+62 812 7788 9900", city: "Medan", category: "Event Organizer", events: 3, status: "Menunggu", submittedAt: "1 hari lalu", documents: 4, initials: "GP" },
  { id: "ORG-008", name: "Suara Kita", contact: "Maya Anggraini", email: "maya@suarakita.id", phone: "+62 811 6677 8899", city: "Semarang", category: "Community Event", events: 4, status: "Terverifikasi", submittedAt: "15 Sep 2025", documents: 3, initials: "SK" },
];

export const adminConcerts: AdminConcert[] = [
  { id: "KNS-001", title: "Coldplay World Tour", organizer: "Euphoria Live", venue: "Jakarta International Stadium", city: "Jakarta", date: "20 Des 2026", status: "Aktif", ticketsSold: 42_000, capacity: 45_000, revenue: 31_500_000_000 },
  { id: "KNS-002", title: "LANY Soft World Tour", organizer: "Urban Stage", venue: "Istora Senayan", city: "Jakarta", date: "29 Okt 2026", status: "Aktif", ticketsSold: 8_500, capacity: 10_000, revenue: 4_250_000_000 },
  { id: "KNS-003", title: "NIKI Nicole World Tour", organizer: "Prambanan Music", venue: "Candi Prambanan", city: "Yogyakarta", date: "12 Agt 2026", status: "Selesai", ticketsSold: 6_000, capacity: 6_000, revenue: 3_300_000_000 },
  { id: "KNS-004", title: "Taeyong City Light Tour", organizer: "Euphoria Live", venue: "JIS Hall", city: "Jakarta", date: "6 Des 2026", status: "Aktif", ticketsSold: 7_200, capacity: 8_000, revenue: 7_920_000_000 },
  { id: "KNS-005", title: "Ariana Grande Summertime Ball", organizer: "Blue Horizon Entertainment", venue: "Gelora Bung Karno", city: "Jakarta", date: "22 Apr 2026", status: "Selesai", ticketsSold: 15_000, capacity: 15_000, revenue: 18_750_000_000 },
  { id: "KNS-006", title: "Jazz Night 2026", organizer: "Soundwave Nusantara", venue: "Plenary Hall", city: "Jakarta", date: "14 Nov 2026", status: "Menunggu", ticketsSold: 0, capacity: 5_000, revenue: 0 },
  { id: "KNS-007", title: "Rock Fest Indonesia", organizer: "Urban Stage", venue: "Lapangan Gasibu", city: "Bandung", date: "5 Jan 2027", status: "Aktif", ticketsSold: 12_000, capacity: 15_000, revenue: 6_000_000_000 },
  { id: "KNS-008", title: "K-Pop Nation", organizer: "Euphoria Live", venue: "Indonesia Arena", city: "Jakarta", date: "18 Feb 2027", status: "Menunggu", ticketsSold: 0, capacity: 20_000, revenue: 0 },
  { id: "KNS-009", title: "Indie Weekend", organizer: "Suara Kita", venue: "Kota Lama", city: "Semarang", date: "22 Nov 2026", status: "Aktif", ticketsSold: 3_200, capacity: 4_000, revenue: 960_000_000 },
  { id: "KNS-010", title: "Dangdut Academy Live", organizer: "Gemilang Production", venue: "Istana Kesenian", city: "Medan", date: "10 Des 2026", status: "Dibatalkan", ticketsSold: 1_500, capacity: 6_000, revenue: 450_000_000 },
  { id: "KNS-011", title: "EDM Pulse Bali", organizer: "Blue Horizon Entertainment", venue: "GWK Cultural Park", city: "Bali", date: "30 Des 2026", status: "Aktif", ticketsSold: 5_400, capacity: 6_000, revenue: 2_700_000_000 },
];

export const adminPayments: AdminPayment[] = [
  { id: "TRX-8821", user: "Chiara Anindya", email: "chiara@konservibe.id", concert: "Coldplay World Tour", method: "GoPay", amount: 1_500_000, fee: 22_500, status: "Berhasil", date: "6 Nov 2026, 14:22" },
  { id: "TRX-8820", user: "Bagas Saputra", email: "bagas@konservibe.id", concert: "LANY Soft World Tour", method: "Virtual Account BCA", amount: 1_000_000, fee: 15_000, status: "Berhasil", date: "6 Nov 2026, 13:05" },
  { id: "TRX-8819", user: "Sinta Dewi", email: "sinta@konservibe.id", concert: "Taeyong City Light Tour", method: "QRIS", amount: 1_100_000, fee: 16_500, status: "Menunggu", date: "6 Nov 2026, 11:48" },
  { id: "TRX-8818", user: "Rizky Maulana", email: "rizky@konservibe.id", concert: "Rock Fest Indonesia", method: "Kartu Kredit", amount: 500_000, fee: 11_500, status: "Gagal", date: "6 Nov 2026, 10:32" },
  { id: "TRX-8817", user: "Kirana Larasati", email: "kirana@konservibe.id", concert: "Coldplay World Tour", method: "OVO", amount: 2_250_000, fee: 33_750, status: "Berhasil", date: "5 Nov 2026, 20:15" },
  { id: "TRX-8816", user: "Alya Ramadhani", email: "alya@konservibe.id", concert: "Indie Weekend", method: "Dana", amount: 300_000, fee: 4_500, status: "Berhasil", date: "5 Nov 2026, 18:40" },
  { id: "TRX-8815", user: "Melati Sari", email: "melati@konservibe.id", concert: "LANY Soft World Tour", method: "Virtual Account Mandiri", amount: 500_000, fee: 7_500, status: "Refund", date: "5 Nov 2026, 16:12" },
  { id: "TRX-8814", user: "Dimas Prakoso", email: "dimas@konservibe.id", concert: "EDM Pulse Bali", method: "GoPay", amount: 750_000, fee: 11_250, status: "Menunggu", date: "5 Nov 2026, 14:55" },
  { id: "TRX-8813", user: "Chiara Anindya", email: "chiara@konservibe.id", concert: "Taeyong City Light Tour", method: "QRIS", amount: 1_100_000, fee: 16_500, status: "Berhasil", date: "4 Nov 2026, 21:08" },
  { id: "TRX-8812", user: "Bagas Saputra", email: "bagas@konservibe.id", concert: "Rock Fest Indonesia", method: "Kartu Debit", amount: 500_000, fee: 10_000, status: "Berhasil", date: "4 Nov 2026, 19:33" },
  { id: "TRX-8811", user: "Nadia Putri", email: "nadia@euphorialive.id", concert: "Coldplay World Tour", method: "Virtual Account BNI", amount: 3_000_000, fee: 45_000, status: "Berhasil", date: "4 Nov 2026, 10:20" },
  { id: "TRX-8810", user: "Sinta Dewi", email: "sinta@konservibe.id", concert: "Indie Weekend", method: "QRIS", amount: 300_000, fee: 4_500, status: "Gagal", date: "3 Nov 2026, 17:45" },
];

export const organizerRevenue: OrganizerRevenue[] = [
  { id: "REV-01", organizer: "Euphoria Live", events: 14, tickets: 68_000, gross: 42_500_000_000, fee: 2_125_000_000, net: 40_375_000_000, growth: 18.4 },
  { id: "REV-02", organizer: "Urban Stage", events: 9, tickets: 43_000, gross: 24_800_000_000, fee: 1_240_000_000, net: 23_560_000_000, growth: 12.1 },
  { id: "REV-03", organizer: "Blue Horizon Entertainment", events: 6, tickets: 28_000, gross: 16_200_000_000, fee: 810_000_000, net: 15_390_000_000, growth: 9.8 },
  { id: "REV-04", organizer: "Suara Kita", events: 4, tickets: 12_500, gross: 6_400_000_000, fee: 320_000_000, net: 6_080_000_000, growth: 4.2 },
  { id: "REV-05", organizer: "Prambanan Music", events: 1, tickets: 6_000, gross: 3_300_000_000, fee: 165_000_000, net: 3_135_000_000, growth: -1.5 },
  { id: "REV-06", organizer: "Gemilang Production", events: 3, tickets: 7_200, gross: 2_900_000_000, fee: 145_000_000, net: 2_755_000_000, growth: -6.2 },
];

export const revenueByMonth: ChartPoint[] = [
  { label: "Jan", value: 1_250_000_000 },
  { label: "Feb", value: 1_480_000_000 },
  { label: "Mar", value: 1_320_000_000 },
  { label: "Apr", value: 1_860_000_000 },
  { label: "Mei", value: 2_050_000_000 },
  { label: "Jun", value: 1_720_000_000 },
  { label: "Jul", value: 2_240_000_000 },
  { label: "Agu", value: 2_680_000_000 },
  { label: "Sep", value: 2_410_000_000 },
  { label: "Okt", value: 2_950_000_000 },
  { label: "Nov", value: 3_240_000_000 },
  { label: "Des", value: 3_860_000_000 },
];

export const ticketsByMonth: ChartPoint[] = [
  { label: "Jan", value: 8_200 },
  { label: "Feb", value: 9_400 },
  { label: "Mar", value: 8_800 },
  { label: "Apr", value: 11_600 },
  { label: "Mei", value: 12_900 },
  { label: "Jun", value: 10_700 },
  { label: "Jul", value: 14_200 },
  { label: "Agu", value: 16_800 },
  { label: "Sep", value: 15_100 },
  { label: "Okt", value: 18_400 },
  { label: "Nov", value: 20_300 },
  { label: "Des", value: 24_600 },
];

export const trafficSources: ShareItem[] = [
  { label: "Instagram", value: 42, color: "#ec4899" },
  { label: "TikTok", value: 26, color: "#22d3ee" },
  { label: "Google Search", value: 14, color: "#38bdf8" },
  { label: "Referral", value: 10, color: "#a78bfa" },
  { label: "Direct", value: 8, color: "#34d399" },
];

export const genreSplit: ShareItem[] = [
  { label: "Pop", value: 38, color: "#8b5cf6" },
  { label: "K-Pop", value: 24, color: "#ec4899" },
  { label: "Rock", value: 16, color: "#f59e0b" },
  { label: "EDM", value: 12, color: "#22d3ee" },
  { label: "Jazz", value: 6, color: "#34d399" },
  { label: "Lainnya", value: 4, color: "#64748b" },
];

export const topCities: ShareItem[] = [
  { label: "Jakarta", value: 46, color: "#8b5cf6" },
  { label: "Bandung", value: 18, color: "#a78bfa" },
  { label: "Surabaya", value: 12, color: "#f472b6" },
  { label: "Yogyakarta", value: 9, color: "#22d3ee" },
  { label: "Bali", value: 7, color: "#34d399" },
  { label: "Medan", value: 5, color: "#fbbf24" },
  { label: "Lainnya", value: 3, color: "#64748b" },
];

export const deviceSplit: ShareItem[] = [
  { label: "Mobile", value: 68, color: "#8b5cf6" },
  { label: "Desktop", value: 24, color: "#22d3ee" },
  { label: "Tablet", value: 8, color: "#f472b6" },
];

export const adminNotifications: AdminNotification[] = [
  { id: "an1", text: "3 organizer baru menunggu verifikasi dokumen.", time: "10 menit lalu", unread: true, tone: "warning" },
  { id: "an2", text: "Pembayaran TRX-8819 senilai Rp1.100.000 perlu diverifikasi.", time: "45 menit lalu", unread: true, tone: "info" },
  { id: "an3", text: "Laporan pendapatan organizer Oktober sudah tersedia.", time: "2 jam lalu", unread: true, tone: "success" },
  { id: "an4", text: "Konser K-Pop Nation menunggu persetujuan publikasi.", time: "1 hari lalu", unread: false, tone: "info" },
];
