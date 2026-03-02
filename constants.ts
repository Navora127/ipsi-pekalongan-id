import { Official } from "./types";

export const OFFICIALS: Official[] = [
  { id: 'admin', name: 'Admin', perguruan: 'IPSI KAB PEKALONGAN', uniqueCode: 'ADMIN_IPSI', isAdmin: true },
  { id: '1', name: 'Budi Santoso', perguruan: 'Persaudaraan Setia Hati Terate', uniqueCode: 'IPSI-PKL-P3-001' },
  { id: '2', name: 'Dewi Sartika', perguruan: 'Pagar Nusa', uniqueCode: 'IPSI-PKL-P2-002' },
  { id: '3', name: 'Ahmad Fauzi', perguruan: 'Tapak Suci', uniqueCode: 'IPSI-PKL-P4-003' },
  { id: '4', name: 'Nafisah Amalina', perguruan: 'Merpati Putih', uniqueCode: 'IPSI-PKL-P5-004' },
];

export const EVENTS = [
  { id: 'ipsi-cup-3', title: 'IPSI Cup 3', date: 'April 2026', type: 'Kejuaraan' },
  { id: 'prabu-cup-2', title: 'Prabu Cup 2', date: 'Mei 2026', type: 'Kejuaraan' },
  { id: 'kapolres-cup', title: 'Kapolres Cup', date: 'Juli 2026', type: 'Kejuaraan' },
  { id: 'o2sn-2026', title: 'O2SN 2026', date: 'Agustus 2026', type: 'Kejuaraan' },
];

export const TRAINING = [
  { id: 'wasit-juri', title: 'Penataran & Pelatihan Wasit Juri', date: 'Maret 2026' },
  { id: 'upgrading-wasit', title: 'Upgrading Wasit Juri', date: 'Juni 2026' },
  { id: 'penataran-pelatih', title: 'Penataran Pelatih', date: 'September 2026' },
];

export const GPU_ADDRESS = "Gedung Pertemuan Umum (GPU) Kajen, Jl. Alun-Alun Utara No.1, Kajen, Kec. Kajen, Kabupaten Pekalongan, Jawa Tengah 51161";

export const REGISTRATION_FEE = 150000; // Per athlete
export const BANK_INFO = {
  bankName: "Bank Jateng",
  accountNumber: "1-023-04567-8",
  accountHolder: "IPSI KAB PEKALONGAN"
};
