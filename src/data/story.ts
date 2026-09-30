export interface FeaturePoint {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  detailNote: string;
}

export const JALAK_BALI_FEATURES: FeaturePoint[] = [
  {
    id: "plumage",
    tag: "01 · ARSITEKTUR BULU",
    title: "Bulu Porselen Putih Kapur",
    subtitle: "Kontras bercahaya di balik kulit pohon pesisir yang gelap",
    description:
      "Berbeda dengan hampir semua jenis jalak Asia lainnya, Curik Bali tidak memproduksi melanin di seluruh bulu tubuhnya, menghasilkan lapisan bulu putih pekat yang sehalus sutra. Hanya ujung bulu sayap primer dan ujung ekor luar yang memiliki aksen hitam beludru pekat yang tampak saat terbang.",
    detailNote: "Batang bulu bebas melanin memantulkan 96% cahaya hutan sekitar, menciptakan efek suar alami di kanopi pagi yang lebat.",
  },
  {
    id: "orbital",
    tag: "02 · KULIT TERBUKA",
    title: "Topeng Orbital Kobalt Elektrik",
    subtitle: "Ciri khas unggas Bali yang tak tertandingi",
    description:
      "Lingkaran kulit tanpa bulu berwarna biru kobalt cerah membingkai setiap iris mata gelapnya. Pada spesimen liar, intensitas warna safir ini semakin pekat selama musim kawin seiring aliran darah kapiler yang mengalir di bawah membran kulit tipis.",
    detailNote: "Ciri identifikasi lapangan: tidak ada burung lain di paparan Sunda yang memiliki warna dermis orbital safir spesifik seperti ini.",
  },
  {
    id: "crest",
    tag: "03 · MAHKOTA",
    title: "Jambul Masa Birahi yang Mempesona",
    subtitle: "Hingga 70mm helaian bulu putih berkibar",
    description:
      "Kedua jenis kelamin memiliki bulu mahkota yang panjang dan anggun, yang terbaring di tengkuk saat terbang. Saat bersuara atau menandai dahan tenggeran, sang jantan menegakkan jambul ini sepenuhnya membentuk mahkota mirip kipas agung yang bergoyang tertiup angin laut.",
    detailNote: "Ditegakkan selama ritual percumbuan khas 'membungkuk-dan-bersiul' yang biasa teramati antara pukul 06:45 hingga 07:30 WITA.",
  },
  {
    id: "endemic",
    tag: "04 · HABITAT",
    title: "Endemik Eksklusif di Bali Barat",
    subtitle: "Wilayah jelajah liar yang diukur hanya dalam hitungan kilometer persegi",
    description:
      "Spesies ini tidak pernah hidup secara alami di tempat lain di Bumi. Seluruh wilayah leluhurnya terbatas pada sabana monsun kering dan hutan pilang pesisir (*Acacia leucophloea*) di Semenanjung Prapat Agung.",
    detailNote: "Pernah menyusut hingga tersisa kurang dari 15 individu liar pada tahun 2001; kini pulih secara bertahap berkat dedikasi penjaga suaka komunitas.",
  },
];
