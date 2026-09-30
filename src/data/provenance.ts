export interface ProvenanceStage {
  step: string;
  stageName: string;
  badge: "Terverifikasi" | "Tunduk pada regulasi berlaku" | "Verifikasi diperlukan" | "Menunggu tinjauan" | "Verified" | "Subject to applicable regulations" | "Verification required" | "Pending review";
  headline: string;
  description: string;
  legalNote: string;
}

export const PROVENANCE_STAGES: ProvenanceStage[] = [
  {
    step: "TAHAP 01",
    stageName: "PROGRAM PENANGKARAN",
    badge: "Terverifikasi",
    headline: "Pencocokan Silsilah Terkontrol",
    description: "Individu indukan dipilih secara ketat dari garis keturunan penangkaran terdokumentasi (generasi F2+) untuk menjaga kesehatan genetik dan meniadakan ketergantungan tangkapan liar.",
    legalNote: "Stok penangkaran dipelihara di bawah standar avikultural yang diakui.",
  },
  {
    step: "TAHAP 02",
    stageName: "MENETAS",
    badge: "Terverifikasi",
    headline: "Registri Inkubasi & Penetasan",
    description: "Setiap penetasan dicatat waktu kelahirannya, ditimbang, dan didaftarkan ke dalam studbook permanen aviari bersama catatan cincin induk dan katalog fotografi.",
    legalNote: "Tunduk pada regulasi berlaku · Pemasangan cincin dilakukan pada jendela pertumbuhan anakan.",
  },
  {
    step: "TAHAP 03",
    stageName: "TUMBUH & PERAWATAN",
    badge: "Terverifikasi",
    headline: "Pengkondisian Terbang Luas",
    description: "Dibesarkan dengan nutrisi insektivora terformulasi, buah-buahan lokal, dan suplemen mineral di aviari terbuka luas untuk memastikan otot terbang yang kuat.",
    legalNote: "Pemeriksaan biometrik rutin dilakukan oleh dokter hewan unggas bersertifikat.",
  },
  {
    step: "TAHAP 04",
    stageName: "DOKUMENTASI",
    badge: "Verifikasi diperlukan",
    headline: "Pengarsipan Biometrik & DNA",
    description: "Pengambilan sampel bulu untuk uji lab DNA sexing, verifikasi cincin kaki logam tertutup, dan penanaman transponder microchip sesuai ketentuan.",
    legalNote: "Dokumentasi hukum tersedia setelah verifikasi · Tunduk pada regulasi berlaku.",
  },
  {
    step: "TAHAP 05",
    stageName: "TERSEDIA",
    badge: "Verifikasi diperlukan",
    headline: "Presentasi Rilis Mingguan",
    description: "Burung individu dan pasang bonding dikatalogkan dengan profil biometrik transparan dan ditempatkan ke dalam kohort rilis mingguan terbatas.",
    legalNote: "Ketersediaan dibatasi 1–2 individu atau 1 pasang per jadwal rilis mingguan.",
  },
  {
    step: "TAHAP 06",
    stageName: "RESERVASI",
    badge: "Verifikasi diperlukan",
    headline: "Izin Kelayakan Pemilik",
    description: "Calon pengelola mengikuti proses verifikasi legalitas, kelayakan fasilitas aviari, dan penyiapan dokumen sebelum serah terima resmi dijadwalkan.",
    legalNote: "Reservasi bukan merupakan pengalihan hak asuh sampai semua verifikasi regulasi terpenuhi.",
  },
];

export const RESPONSIBLE_BREEDING_PILLARS = [
  {
    id: "captive-breeding",
    number: "01",
    title: "100% Hasil Penangkaran",
    subtitle: "Nol Penangkapan Liar",
    description: "Setiap burung dalam registri kami lahir dan dibesarkan sepenuhnya di dalam fasilitas penangkaran terdaftar. Kami tidak pernah mengambil, menangkap, atau memperdagangkan spesimen liar.",
    tag: "Fondasi Etis",
  },
  {
    id: "welfare",
    number: "02",
    title: "Kesejahteraan Unggas Utama",
    subtitle: "Lingkungan Terbang Alami",
    description: "Fasilitas kami mereplikasi habitat muson barat laut Bali dengan vegetasi hidup, pencahayaan alami matahari, zona mandi pancuran air, dan pengayaan sosial alami.",
    tag: "Kualitas Habitat",
  },
  {
    id: "controlled-breeding",
    number: "03",
    title: "Silsilah Terkontrol",
    subtitle: "Keterlacakan Studbook",
    description: "Protokol penjodohan yang dipantau cermat mencegah depresi inbreeding, memastikan kesehatan fisik yang prima, struktur bulu yang murni, dan vitalitas tinggi.",
    tag: "Integritas Genetik",
  },
  {
    id: "traceability",
    number: "04",
    title: "Keterlacakan Penuh",
    subtitle: "Cincin Tertutup & Microchip",
    description: "Catatan asal usul tanpa celah dari hari penetasan hingga serah terima. Setiap individu memiliki gelang cincin permanen dan rekaman internal yang dapat dilacak.",
    tag: "Akuntabilitas",
  },
  {
    id: "documentation",
    number: "05",
    title: "Kepatuhan Transparan",
    subtitle: "Standar Verifikasi",
    description: "Kepatuhan penuh terhadap regulasi penangkaran satwa yang berlaku. Catatan kesehatan yang diwajibkan dan berkas transfer diverifikasi sebelum serah terima.",
    tag: "Ketaatan Hukum",
  },
  {
    id: "responsible-ownership",
    number: "06",
    title: "Seleksi Pemilik",
    subtitle: "Pengelolaan Berkomitmen",
    description: "Kami bekerja sama secara eksklusif dengan pengelola, aviari, dan institusi yang memenuhi syarat serta mampu menyediakan hunian jangka panjang, nutrisi, dan perawatan dokter hewan yang layak.",
    tag: "Kepemilikan Bertanggung Jawab",
  },
];

export const BREEDING_LIFECYCLE_TIMELINE = [
  {
    step: "01",
    phase: "PERJODOHAN",
    duration: "Bulan 1–3",
    summary: "Memilih individu dewasa generasi F2/F3 yang beragam secara genetik dan memperkenalkannya ke dalam aviari perjodohan khusus untuk memantau tanda-tanda bonding.",
  },
  {
    step: "02",
    phase: "PENETASAN",
    duration: "Hari 1–14",
    summary: "Telur diinkubasi dalam sarang dengan suhu terkontrol. Anakan yang baru menetas mendapatkan pemantauan suhu intensif dan pencatatan awal ke dalam studbook.",
  },
  {
    step: "03",
    phase: "PERAWATAN AWAL",
    duration: "Pekan 2–8",
    summary: "Rezim pakan berprotein tinggi dengan serangga hidup dan bubur khusus. Pemasangan gelang cincin logam tertutup permanen dilakukan pada pekan kedua.",
  },
  {
    step: "04",
    phase: "PERTUMBUHAN",
    duration: "Bulan 3–10",
    summary: "Anakan yang telah tumbuh bulu dipindahkan ke aviari terbang luas untuk melatih kekuatan otot dada, hierarki sosial, dan naluri mencari pakan alami.",
  },
  {
    step: "05",
    phase: "DOKUMENTASI",
    duration: "Bulan 11–12",
    summary: "Audit kesehatan dokter hewan unggas, pengujian lab DNA sexing, pemindaian microchip, dan penyusunan berkas kelayakan kepatuhan.",
  },
  {
    step: "06",
    phase: "TERSEDIA",
    duration: "Rilis Terjadwal",
    summary: "Dicatat dalam buku daftar rilis mingguan terbatas kami. Memenuhi syarat untuk direservasi setelah verifikasi identitas dan habitat calon pengelola.",
  },
];

export const TRUST_PRINCIPLES = [
  {
    title: "KETERLACAKAN",
    description: "Catatan terperinci yang melacak setiap individu mulai dari tanggal menetas, garis silsilah indukan, hingga dokumentasi kesehatan.",
    badge: "Asal Terjamin",
  },
  {
    title: "PENANGKARAN BERTANGGUNG JAWAB",
    description: "Etos penangkaran terstandarisasi yang mengutamakan perawatan etis, aviari penerbangan yang luas, dan perilaku alami.",
    badge: "Standar Kesejahteraan",
  },
  {
    title: "DOKUMENTASI",
    description: "Tanpa izin palsu atau klaim yang tidak sah. Seluruh berkas transfer yang dipersyaratkan diverifikasi dengan transparansi penuh.",
    badge: "Kepatuhan Hukum",
  },
  {
    title: "KEPEMILIKAN TERVERIFIKASI",
    description: "Proses verifikasi bertahap yang terstruktur untuk melindungi kesejahteraan burung di masa depan sekaligus kepatuhan hukum sang pengelola.",
    badge: "Transfer Terverifikasi",
  },
];
