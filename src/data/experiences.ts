import { ExperiencePackage } from "@/types";

export const EXPERIENCES: ExperiencePackage[] = [
  {
    id: "jalak-bali-master-encounter",
    title: "Audiensi Fajar",
    subtitle: "Gardu Pandang Kanopi Privat & Observasi Sarang Liar",
    tagline: "Penjelajahan hening pagi hari ke sektor suaka terlarang Teluk Brumbun di Taman Nasional Bali Barat.",
    duration: "4,5 Jam · 06:00 – 10:30 WITA",
    location: "Sektor Suaka Teluk Brumbun, Semenanjung Prapat Agung",
    groupSize: "Maksimal 2 hingga 4 Tamu per Pagi",
    price: 3850000,
    formattedPrice: "IDR 3.850.000",
    isFocal: true,
    description:
      "Saksikan Curik Bali di satu-satunya sudut bumi tempat mereka masih terbang bebas di alam liar. Dilakukan secara eksklusif saat fajar menyingsing dari gardu kayu ramah lingkungan yang tersembunyi di dalam kanopi hutan gugur kering, ditemani etolog suaka dan jagawana taman nasional.",
    highlights: [
      "Akses ke zona 1 suaka terbatas yang tidak terjangkau izin wisata umum",
      "Pengamatan fajar prima selama peragaan teritorial dan duet kicauan pagi",
      "Teleskop spotting Swarovski Optik ATX 30-70x95 disediakan untuk setiap rombongan",
      "Kontribusi langsung mendanai 30 hari patroli hutan bersenjata anti-perburuan liar",
    ],
    inclusions: [
      "Perjalanan privat dengan 4x4 atau perahu kayu tradisional menuju pos Teluk Brumbun",
      "Pemanduan lapangan personal oleh ornitolog bersertifikat TNBB",
      "Sarapan lapangan: kopi cold brew single-origin Kintamani, buah musiman, kue hangat khas Bali",
      "Optik lapangan berdaya tinggi dan headphone pendengar akustik terarah",
      "Pencatatan resmi buku tamu suaka & sertifikat peringatan terdaftar di TNBB",
    ],
    schedule: [
      { time: "06:00 WITA", activity: "Kedatangan hening di dermaga Labuan Lalang; penyeberangan perahu privat ke Teluk Brumbun" },
      { time: "06:40 WITA", activity: "Menaiki gardu kanopi pohon pilang sebelum kilatan sinar matahari pertama" },
      { time: "07:10 WITA", activity: "Observasi manuver terbang berkicau & peragaan mahkota teritorial (puncak aktivitas)" },
      { time: "08:45 WITA", activity: "Studi teleskop lapangan terhadap pasang liar yang mencari makan buah ara alami dan serangga" },
      { time: "09:30 WITA", activity: "Santapan hutan artisanal & penandatanganan resmi Buku Sensus Unggas" },
    ],
    preparationNotes: [
      "Busana: Wajib mengenakan warna hutan teredam (zaitun, khaki, hijau hutan gelap). Hindari putih terang dan warna sintetis berpendar.",
      "Aroma: Bebas dari wewangian sintetis atau deodoran beraroma kuat agar tidak mengganggu indra penciuman sarang.",
      "Akustik: Keheningan mutlak dijaga dalam radius 100 meter dari pohon tenggeran yang teridentifikasi.",
      "Optik: Lensa telefoto prima (400mm–600mm) dipersilakan; fotografi kilat (flash) dilarang keras.",
    ],
  },
  {
    id: "private-collector-expedition",
    title: "Studi Etologis",
    subtitle: "Imersif Ornitologis & Penangkaran Konservasi Sehari Penuh",
    tagline: "Studi mendalam di balik layar yang mencakup habitat sarang liar dan aviari pra-rilis penangkaran.",
    duration: "8,5 Jam · Fajar hingga Senja",
    location: "Teluk Brumbun & Aviari Tegal Bunder, Bali Barat",
    groupSize: "Alokasi Privat Solo atau Pasang Saja",
    price: 7200000,
    formattedPrice: "IDR 7.200.000",
    isFocal: false,
    description:
      "Dirancang untuk naturalis serius, sinematografer satwa liar, dan donor institusional. Ikuti lintasan lengkap spesies ini mulai dari manajemen genetik dan aviari pelatihan pra-rilis hingga koridor jelajah liar aktif.",
    highlights: [
      "Akses ke pusat penangkaran dan repositori genetik Tegal Bunder yang dijaga ketat",
      "Diskusi privat dengan kepala ahli genetika unggas dan staf dokter hewan taman nasional",
      "Sesi perekaman lanskap suara parabola akustik di pohon tenggeran saat matahari terbenam",
    ],
    inclusions: [
      "Transportasi ber-AC privat dengan supir ke seluruh penjuru pulau Bali",
      "Izin eksklusif siang hari di fasilitas penangkaran aktif maupun wilayah jelajah liar",
      "Makan siang privat disajikan di pos jagawana hutan terpencil",
      "Folio fotografi arsip dan litograf botani bertandatangan dari Leucopsar rothschildi",
    ],
    schedule: [
      { time: "05:30 WITA", activity: "Keberangkatan menuju koridor alam liar Bali Barat" },
      { time: "06:30 WITA", activity: "Sesi pengamatan kanopi fajar di Teluk Brumbun" },
      { time: "11:00 WITA", activity: "Inspeksi berpemandu ke kandang pra-rilis Tegal Bunder" },
      { time: "13:00 WITA", activity: "Makan siang lapangan disiapkan oleh koki perkemahan privat" },
      { time: "16:30 WITA", activity: "Pengamatan terbang pulang senja dan sensus tenggeran malam" },
    ],
    preparationNotes: [
      "Memerlukan stamina fisik sedang untuk berjalan santai di hutan melintasi jalur batu kapur karang",
      "Persetujuan biometrik awal diperlukan 72 jam sebelumnya untuk akses ke pusat penangkaran",
    ],
  },
];

export const STORY_STAGES = [
  {
    number: "01",
    title: "PENYEBERANGAN",
    subtitle: "Menyeberangi Selat yang Hening Sebelum Fajar",
    description:
      "Pada pukul 06:00 pagi, laut antara daratan Bali dan semenanjung Prapat Agung tampak tenang bagaikan kaca. Perahu kayu melaju hening membelah air di kala kabut tipis terangkat dari tepian bakau. Tanpa suara sepeda motor, tanpa rombongan turis, tanpa musik. Anda melangkah ke atas kerikil batu kapur Teluk Brumbun saat fajar paling langka di pulau ini mulai mereka.",
    image: "/assets/pexels-photo-26754369.avif",
    meta: "06:00 WITA · Pos Pantau Teluk Brumbun",
  },
  {
    number: "02",
    title: "AUDIENSI",
    subtitle: "Putih Salju dan Kobalt di Dahan Ranting Pilang",
    description:
      "Dari balik gardu kayu, teropong memperlihatkan apa yang telah diimpikan para penjelajah selama berabad-abad: siluet porselen putih murni dari Curik Bali yang memukau. Begitu sang jantan merasakan kehangatan matahari pagi, ia menegakkan jambulnya yang khas, mendongakkan paruh ke angkasa, dan melantunkan siulan merdu mengalun yang menggema di seluruh hutan.",
    image: "/assets/jalak-portrait.png",
    meta: "07:15 WITA · Gardu Pandang Kanopi",
  },
  {
    number: "03",
    title: "SANTAPAN",
    subtitle: "Cita Rasa Dataran Tinggi di Bawah Naungan Beringin",
    description:
      "Pagi hari tidak ditutup dengan kepulangan tergesa-gesa, melainkan di meja kayu terbuka di bawah keteduhan pohon ara pesisir. Nikmati kopi Arabika Bali yang baru diseduh, camilan madu lokal, dan buah-buahan tropis segar selagi pemandu etolog mencatat perjumpaan teritorial pagi ke dalam arsip sensus nasional.",
    image: "/assets/jalak-bali.webp",
    meta: "09:30 WITA · Beranda Pos Jagawana",
  },
];
