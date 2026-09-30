import { Review } from "@/types";

export const EDITORIAL_REVIEWS: Review[] = [
  {
    id: "rev-01",
    quote:
      "Transparansi catatan silsilah dan proses verifikasi yang teliti memberi kami keyakinan mutlak. Menerima pasang penangkaran dengan riwayat kesehatan lengkap dan asal-usul yang jelas adalah tolok ukur avikultur yang bertanggung jawab.",
    patronName: "Dr. Hendra W.",
    patronTitle: "Pengelola Aviari Berlisensi & Dokter Hewan",
    location: "Bandung, Jawa Barat",
    date: "Agustus 2026",
    rating: 5,
    verified: true,
    individualRef: "PAIR-2025-004",
  },
  {
    id: "rev-02",
    quote:
      "Berbeda dengan pasar burung umum, platform ini memperlakukan Jalak Bali dengan martabat dan ketelitian hukum yang selayaknya. Verifikasi bertahap dan serah terima berfasilitas khusus ditangani dengan profesionalisme luar biasa.",
    patronName: "Bramantyo Kusuma",
    patronTitle: "Paviliun Flora & Fauna Privat",
    location: "Jakarta Selatan",
    date: "Juli 2026",
    rating: 5,
    verified: true,
    individualRef: "JB-2025-011",
  },
  {
    id: "rev-03",
    quote:
      "Dari pemesanan dalam rilis mingguan hingga penyerahan foto aviari untuk audit habitat, setiap langkah berjalan sangat teratur. Inisiatif penangkaran teladan yang menjunjung tinggi integritas sejati.",
    patronName: "Arya Daniswara",
    patronTitle: "Penangkar Satwa Terdaftar & Biolog",
    location: "Surabaya, Jawa Timur",
    date: "September 2026",
    rating: 5,
    verified: true,
    individualRef: "JB-2025-018",
  },
];

export const SOCIAL_PROOF_STATS = [
  {
    value: "100",
    suffix: "%",
    label: "Hasil Penangkaran",
    detail: "Nol penangkapan liar · Murni breeding studbook tertutup",
  },
  {
    value: "F2/F3",
    suffix: "Gen",
    label: "Silsilah Terlacak",
    detail: "Catatan indukan terdokumentasi dan gelang cincin permanen",
  },
  {
    value: "1–2",
    suffix: "Ekor",
    label: "Batas Rilis Mingguan",
    detail: "Kohort sangat terbatas untuk perhatian dokter hewan secara individual",
  },
  {
    value: "Multi-Tahap",
    suffix: "Audit",
    label: "Verifikasi Pemilik",
    detail: "Identitas, kelayakan habitat, dan transfer legal yang patuh",
  },
];
