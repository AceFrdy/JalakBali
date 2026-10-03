"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Filter, Search, User, Users, Heart } from "lucide-react";
import { getCatalogBirds, getCatalogPairs } from "@/lib/api";
import { getAllBirds } from "@/lib/birds";
import { Bird, BirdPairCatalog } from "@/types";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CustomCursor } from "@/components/motion/CustomCursor";

function BirdsCatalogContent() {
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type") || searchParams.get("tab");
  const initialTab = urlType === "pair" ? "pair" : "individual";

  const [activeTab, setActiveTab] = useState<"individual" | "pair">(initialTab);
  const [birds, setBirds] = useState<Bird[]>([]);
  const [pairs, setPairs] = useState<BirdPairCatalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sexFilter, setSexFilter] = useState<string>("all");

  useEffect(() => {
    if (urlType === "pair") {
      setActiveTab("pair");
    } else if (urlType === "individual") {
      setActiveTab("individual");
    }
  }, [urlType]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getCatalogBirds().catch(() => [] as Bird[]),
      getCatalogPairs().catch(() => [] as BirdPairCatalog[]),
    ])
      .then(([birdsData, pairsData]) => {
        if (!isMounted) return;
        setBirds(birdsData || []);
        setPairs(pairsData || []);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered Individual Birds
  const filteredBirds = birds.filter((bird) => {
    const tagging = bird.tagging || bird.publicId || "";
    const description = bird.description || "";
    const ring = bird.ringTag || "";
    const matchesSearch =
      tagging.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ring.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || bird.status === statusFilter;
    const matchesSex = sexFilter === "all" || bird.sex === sexFilter;

    return matchesSearch && matchesStatus && matchesSex;
  });

  // Filtered Pairs
  const filteredPairs = pairs.filter((pair) => {
    const pairTag = pair.pairTag || "";
    const maleTag = pair.birdA?.tagging || pair.birdA?.publicId || "";
    const femaleTag = pair.birdB?.tagging || pair.birdB?.publicId || "";
    const desc = pair.description || "";
    const matchesSearch =
      pairTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      maleTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      femaleTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || pair.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="pt-32 pb-24 max-w-[1760px] mx-auto site-gutter font-mono">
      {/* Page Header */}
      <div className="mb-10 border-b border-[#d6be8c]/15 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <span className="h-[1px] w-6 bg-[#b39257]" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257]">
              Registri Aviari Resmi · Katalog Lengkap
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight">
            Koleksi Spesimen <span className="italic font-serif text-[#d6be8c]">Jalak Bali</span>
          </h1>
        </div>

        <p className="max-w-md text-xs text-[#f5efeb]/70 leading-relaxed font-sans">
          Jelajahi seluruh daftar individu dan pasangan Jalak Bali hasil penangkaran berlisensi resmi. Masing-masing dilengkapi cincin tertutup terdaftar dan sertifikasi DNA.
        </p>
      </div>

      {/* Category Tabs Switcher */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#0d1811] border border-[#d6be8c]/25 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("individual")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              activeTab === "individual"
                ? "bg-[#b39257] text-[#08110b] font-bold shadow-md"
                : "text-[#f5efeb]/70 hover:text-[#f5efeb]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Individu ({birds.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pair")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              activeTab === "pair"
                ? "bg-[#b39257] text-[#08110b] font-bold shadow-md"
                : "text-[#f5efeb]/70 hover:text-[#f5efeb]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Pasangan ({pairs.length})</span>
          </button>
        </div>

        <span className="text-xs text-[#d6be8c]/80">
          Menampilkan {activeTab === "individual" ? filteredBirds.length : filteredPairs.length} spesimen
        </span>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="mb-12 p-5 sm:p-6 rounded-2xl bg-[#0d1811] border border-[#d6be8c]/20 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        {/* Search Box */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d6be8c]" />
          <input
            type="text"
            placeholder={
              activeTab === "individual"
                ? "Cari Tagging, Cincin, atau Deskripsi..."
                : "Cari ID Pasangan, Tag Jantan/Betina..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#08110b] border border-[#d6be8c]/25 text-xs text-[#f5efeb] focus:outline-none focus:border-[#b39257] placeholder-[#f5efeb]/40"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs text-[#b39257] mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Sex Filter (Only for Individual tab) */}
          {activeTab === "individual" && (
            <select
              value={sexFilter}
              onChange={(e) => setSexFilter(e.target.value)}
              className="px-4 py-2 rounded-full bg-[#08110b] border border-[#d6be8c]/25 text-xs text-[#f5efeb] focus:outline-none focus:border-[#b39257] cursor-pointer"
            >
              <option value="all">Semua Gender</option>
              <option value="male">Jantan (♂)</option>
              <option value="female">Betina (♀)</option>
            </select>
          )}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-full bg-[#08110b] border border-[#d6be8c]/25 text-xs text-[#f5efeb] focus:outline-none focus:border-[#b39257] cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="available">Tersedia</option>
            <option value="reserved">Dipesan</option>
            <option value="verification">Dalam Verifikasi</option>
            <option value="sold">Terjual</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      {isLoading ? (
        <div className="py-24 text-center text-xs text-[#d6be8c] animate-pulse">
          Memuat Katalog Spesimen...
        </div>
      ) : activeTab === "individual" ? (
        filteredBirds.length === 0 ? (
          <div className="py-24 text-center text-xs text-[#f5efeb]/60 bg-[#0d1811] rounded-3xl border border-[#d6be8c]/15">
            Tidak ada burung individu yang cocok dengan pencarian atau filter Anda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBirds.map((bird) => {
              const birdTagging = bird.tagging || bird.publicId || bird.id;
              const validImages = (bird.images ?? []).filter((s) => typeof s === "string" && s.trim() !== "");
              const mainImg = validImages[0] ?? null;

              return (
                <div
                  key={bird.id}
                  className="rounded-3xl border border-[#d6be8c]/20 bg-[#0d1811] overflow-hidden flex flex-col justify-between group hover:border-[#b39257] transition-all duration-300 shadow-xl"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#060e08]">
                    {mainImg ? (
                      <Image
                        src={mainImg}
                        alt={`Jalak Bali ${birdTagging}`}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0d1811]">
                        <span className="text-[10px] text-[#b39257]/60 uppercase tracking-widest">
                          Foto belum tersedia
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1811] via-transparent to-transparent opacity-80 pointer-events-none" />

                    {/* Tagging Badge */}
                    <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#d6be8c] bg-[#060e08]/90 px-3 py-1 rounded-full border border-[#d6be8c]/20 backdrop-blur-md">
                      ID: {birdTagging}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="text-[9px] uppercase tracking-wider text-[#08110b] bg-[#38bdf8] px-3 py-1 rounded-full font-bold shadow-md">
                        {bird.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Photo count indicator */}
                    {validImages.length > 1 && (
                      <div className="absolute bottom-3 right-3 text-[9px] text-[#f5efeb] bg-[#060e08]/80 px-2.5 py-0.5 rounded-full border border-[#d6be8c]/20 backdrop-blur-sm">
                        📷 {validImages.length} Foto
                      </div>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#b39257] mb-1">
                        Leucopsar Rothschildi
                      </div>
                      <h3 className="font-serif text-2xl text-[#f5efeb] font-light">
                        Jalak Bali ({birdTagging})
                      </h3>
                      <p className="text-xs text-[#f5efeb]/60 mt-1 line-clamp-2 font-sans font-light">
                        {bird.description || "Spesimen hasil penangkaran resmi berlisensi BKSDA."}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#08110b] border border-[#d6be8c]/15 space-y-2 text-xs">
                      <div className="flex justify-between border-b border-[#d6be8c]/10 pb-1.5">
                        <span className="text-[#f5efeb]/50">Jenis Kelamin</span>
                        <span className="text-[#f5efeb]">
                          {bird.sex === "male" ? "Jantan ♂" : bird.sex === "female" ? "Betina ♀" : "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#d6be8c]/10 pb-1.5">
                        <span className="text-[#f5efeb]/50">Nomor Cincin</span>
                        <span className="text-[#d6be8c]">{bird.ringTag || "—"}</span>
                      </div>
                      <div className="flex justify-between items-baseline pt-1">
                        <span className="text-[#f5efeb]/50">Harga Penuh</span>
                        <span className="font-serif text-lg text-[#d6be8c] font-bold">
                          Rp {bird.price ? bird.price.toLocaleString("id-ID") : "32.500.000"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Link
                        href={`/birds/${bird.id}`}
                        className="py-3 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] text-[#f5efeb] text-[10px] uppercase tracking-wider font-semibold text-center transition-colors flex items-center justify-center space-x-1"
                      >
                        <span>Lihat Profil</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/reserve?type=individual&birdId=${bird.id}`}
                        className="py-3 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[10px] uppercase tracking-wider font-bold text-center transition-colors shadow-md flex items-center justify-center space-x-1"
                      >
                        <span>Reservasi</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : filteredPairs.length === 0 ? (
        <div className="py-24 text-center text-xs text-[#f5efeb]/60 bg-[#0d1811] rounded-3xl border border-[#d6be8c]/15">
          Tidak ada pasangan yang cocok dengan pencarian atau filter Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPairs.map((pair) => {
            const maleImgs = (pair.birdA?.images ?? []).filter((s) => typeof s === "string" && s.trim() !== "");
            const femaleImgs = (pair.birdB?.images ?? []).filter((s) => typeof s === "string" && s.trim() !== "");
            const maleImg = maleImgs[0] ?? null;
            const femaleImg = femaleImgs[0] ?? null;

            return (
              <div
                key={pair.id}
                className="rounded-3xl border border-[#d6be8c]/20 bg-[#0d1811] overflow-hidden flex flex-col justify-between group hover:border-[#b39257] transition-all duration-300 shadow-xl"
              >
                {/* Dual Photos Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#060e08] grid grid-cols-2 gap-0.5">
                  {/* Male Half */}
                  <div className="relative h-full overflow-hidden">
                    {maleImg ? (
                      <Image
                        src={maleImg}
                        alt={`Jantan ${pair.birdA?.publicId}`}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0d1811]">
                        <span className="text-[9px] text-[#b39257]/60">Foto Jantan</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-[#08110b] bg-[#38bdf8] px-2 py-0.5 rounded-full font-bold shadow-md">
                        Jantan ♂
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 text-[9px] text-[#f5efeb] font-mono bg-[#060e08]/80 px-2 py-0.5 rounded">
                      {pair.birdA?.publicId}
                    </div>
                  </div>

                  {/* Female Half */}
                  <div className="relative h-full overflow-hidden">
                    {femaleImg ? (
                      <Image
                        src={femaleImg}
                        alt={`Betina ${pair.birdB?.publicId}`}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0d1811]">
                        <span className="text-[9px] text-[#b39257]/60">Foto Betina</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-[#08110b] bg-[#f472b6] px-2 py-0.5 rounded-full font-bold shadow-md">
                        Betina ♀
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 text-[9px] text-[#f5efeb] font-mono bg-[#060e08]/80 px-2 py-0.5 rounded">
                      {pair.birdB?.publicId}
                    </div>
                  </div>

                  {/* Center Pair ID overlay */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#d6be8c] bg-[#060e08]/90 px-3 py-1 rounded-full border border-[#d6be8c]/20 backdrop-blur-md shadow-lg pointer-events-none">
                    {pair.pairTag}
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.25em] text-[#b39257] mb-1">
                      <Heart className="w-3 h-3 text-[#f472b6]" />
                      <span>Set Pasangan Indukan</span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#f5efeb] font-light">
                      Pasangan {pair.pairTag}
                    </h3>
                    <p className="text-xs text-[#f5efeb]/60 mt-1 line-clamp-2 font-sans font-light">
                      {pair.description || `Kombinasi indukan serasi: ${pair.birdA?.publicId} (♂) × ${pair.birdB?.publicId} (♀).`}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#08110b] border border-[#d6be8c]/15 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-[#d6be8c]/10 pb-1.5">
                      <span className="text-[#f5efeb]/50">Ring Jantan</span>
                      <span className="text-[#38bdf8]">{pair.birdA?.ringTag || "—"}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#d6be8c]/10 pb-1.5">
                      <span className="text-[#f5efeb]/50">Ring Betina</span>
                      <span className="text-[#f472b6]">{pair.birdB?.ringTag || "—"}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-[#f5efeb]/50">Harga Pasangan</span>
                      <span className="font-serif text-lg text-[#d6be8c] font-bold">
                        Rp {pair.price ? pair.price.toLocaleString("id-ID") : "60.000.000"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      href={`/reserve?type=pair&pairId=${pair.id}`}
                      className="col-span-2 py-3 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[10px] uppercase tracking-wider font-bold text-center transition-colors shadow-md flex items-center justify-center space-x-1.5"
                    >
                      <span>Reservasi Pasangan</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function BirdsCatalogPage() {
  return (
    <main className="min-h-screen bg-[#060e08] text-[#f5efeb] selection:bg-[#c5a880]/30 selection:text-[#fbf9f5]">
      <CustomCursor />
      <Navbar />
      <Suspense fallback={<div className="pt-40 text-center text-xs font-mono text-[#d6be8c]">Memuat Katalog...</div>}>
        <BirdsCatalogContent />
      </Suspense>
      <Footer />
    </main>
  );
}
