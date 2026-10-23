import { Review } from "@/types";

export const EDITORIAL_REVIEWS: Review[] = [
  {
    id: "rev-01",
    quote:
      "Transparansi silsilah indukan dan sertifikat DNA PCR memberikan kepastian mutlak. Pasangan indukan tiba dalam kondisi sangat prima, aktif, dan dokumen SATS-DN diterbitkan resmi tanpa kendala birokrasi.",
    patronName: "Dr. Hendra W.",
    patronTitle: "Pemilik Aviari & Praktisi Hewan",
    location: "Bandung, Jawa Barat",
    date: "Agustus 2026",
    rating: 5,
    verified: true,
    individualRef: "PAIR-2025-004",
  },
  {
    id: "rev-02",
    quote:
      "Bukan sekadar transaksi, proses verifikasi kelayakan kandang dan konsultasi nutrisinya sangat profesional. Senang bisa merawat Jalak Bali generasi F2 yang 100% legal dan bersertifikat cincin tertutup resmi.",
    patronName: "Bramantyo Kusuma",
    patronTitle: "Pelestari Aviari Mandiri",
    location: "Jakarta Selatan",
    date: "Juli 2026",
    rating: 5,
    verified: true,
    individualRef: "JB-2025-011",
  },
  {
    id: "rev-03",
    quote:
      "Dari booking rilis mingguan, audit foto kandang, hingga ekspedisi satwa ber-SOP ketat, semuanya tertata rapi. Komitmen konservasi dan etika penangkaran mereka benar-benar patut diapresiasi.",
    patronName: "Arya Daniswara",
    patronTitle: "Penangkar Burung Terdaftar BKSDA",
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
    label: "Penangkaran Legal",
    detail: "Murni hasil penangkaran ex-situ · Bukan tangkapan alam liar",
  },
  {
    value: "F2/F3",
    suffix: "Gen",
    label: "Silsilah Resmi",
    detail: "Tercatat dalam studbook resmi & gelang cincin tertutup permanen",
  },
  {
    value: "1–2",
    suffix: "Pasang",
    label: "Kuota Rilis Berkala",
    detail: "Jumlah terbatas demi memastikan kontrol kesehatan individual",
  },
  {
    value: "Resmi",
    suffix: "BKSDA",
    label: "Legalitas Terjamin",
    detail: "Dilengkapi SATS-DN & sertifikasi uji jenis kelamin DNA",
  },
];
