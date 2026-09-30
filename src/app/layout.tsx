import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jalakbali.breeding"),
  title: "Jalak Bali — Langka, Bertanggung Jawab, Memukau",
  description:
    "Eksplorasi penangkaran resmi Jalak Bali, ketersediaan terkini, rekam silsilah asal-usul, dan kesempatan reservasi legal.",
  keywords: [
    "Jalak Bali",
    "penangkaran Jalak Bali",
    "penangkaran Jalak Bali legal",
    "Leucopsar rothschildi",
    "cincin tertutup Jalak Bali",
    "silsilah Jalak Bali",
    "rilis mingguan aviari",
    "penangkaran satwa bertanggung jawab",
  ],
  authors: [{ name: "Inisiatif Penangkaran Resmi Jalak Bali" }],
  openGraph: {
    title: "Jalak Bali — Langka, Bertanggung Jawab, Memukau",
    description:
      "Eksplorasi penangkaran resmi Jalak Bali, ketersediaan terkini, rekam silsilah asal-usul, dan kesempatan reservasi legal.",
    url: "https://jalakbali.breeding",
    siteName: "Jalak Bali — Platform Penangkaran Legal",
    images: [
      {
        url: "/assets/jalak-hero.png",
        width: 1200,
        height: 630,
        alt: "Satwa Jalak Bali hasil penangkaran bertanggung jawab",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jalak Bali — Langka, Bertanggung Jawab, Memukau",
    description:
      "Eksplorasi penangkaran resmi Jalak Bali, ketersediaan terkini, rekam silsilah asal-usul, dan kesempatan reservasi legal.",
    images: ["/assets/jalak-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "JALAK BALI — Penangkaran Legal & Resmi",
    description:
      "Platform penangkaran legal terpercaya yang didedikasikan untuk pelestarian Jalak Bali (Leucopsar rothschildi). Tunduk pada regulasi dan proses verifikasi resmi.",
    url: "https://jalakbali.breeding",
    provider: {
      "@type": "Organization",
      name: "Inisiatif Penangkaran Resmi Jalak Bali",
      url: "https://jalakbali.breeding",
    },
    termsOfService: "https://jalakbali.breeding/terms",
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
  };

  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${jakarta.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0b1610] text-[#f4efe4] font-sans antialiased selection:bg-[#c5a880]/30 selection:text-[#f7f4ec] min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
