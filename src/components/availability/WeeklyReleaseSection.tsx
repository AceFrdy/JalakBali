import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, ShieldAlert, CheckCircle2, Info } from "lucide-react";
import { motion } from "framer-motion";
import { CURRENT_RELEASE } from "@/data/weeklyReleases";
import { getHomepageBirds, getHomepagePairs, getWeeklyReleases } from "@/lib/api";
import { getActiveUpcomingRelease } from "@/lib/availability";
import { Bird, BirdPairCatalog, WeeklyRelease } from "@/types";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";

interface WeeklyReleaseSectionProps {
  onReserveIndividual: (birdId: string) => void;
  onReservePair: (pairId: string) => void;
  onJoinWaitlist: (type: "individual" | "pair") => void;
}

export function WeeklyReleaseSection({
  onReserveIndividual,
  onReservePair,
  onJoinWaitlist,
}: WeeklyReleaseSectionProps) {
  const [currentSingle, setCurrentSingle] = useState<Bird | null>(null);
  const [currentPair, setCurrentPair] = useState<BirdPairCatalog | null>(null);
  const [currentRelease, setCurrentRelease] = useState<WeeklyRelease>(CURRENT_RELEASE);
  const [nextReleaseDate, setNextReleaseDate] = useState<string>("10 Oktober");

  useEffect(() => {
    getWeeklyReleases()
      .then((releases) => {
        if (releases && releases.length > 0) {
          const activeRelease = getActiveUpcomingRelease(releases) || releases[0];
          setCurrentRelease(activeRelease);
          const next = releases.find(
            (r) => r.id !== activeRelease.id && r.status !== "closed" && !r.isPast
          );
          if (next) {
            setNextReleaseDate(next.formattedDate.replace(/\s\d{4}$/, ""));
          }
        }
      })
      .catch(() => {});

    getHomepageBirds()
      .then((birds) => {
        if (birds && birds.length > 0) setCurrentSingle(birds[0]);
      })
      .catch(() => {});

    getHomepagePairs()
      .then((pairs) => {
        if (pairs && pairs.length > 0) setCurrentPair(pairs[0]);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="weekly-release" className="relative py-28 md:py-36 bg-[#08110b] text-[#f5efeb] border-t border-[#d6be8c]/15">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8 border-b border-[#d6be8c]/15 pb-12">
          <div className="max-w-2xl">
            <FadeIn direction="up">
              <div className="flex items-center space-x-3 mb-4">
                <span className="h-[1px] w-6 bg-[#b39257]" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                  Sistem Rilis Mingguan · Alokasi Terbatas
                </span>
              </div>
            </FadeIn>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight leading-[1.05]">
              <TextReveal text="Daftar Rilis" as="span" />{" "}
              <span className="italic font-serif text-[#d6be8c]">Minggu Ini</span>
            </h2>
          </div>

          <FadeIn direction="left" delay={0.2} className="max-w-md font-mono text-xs text-[#f5efeb]/75 space-y-2 border-l border-[#d6be8c]/25 pl-6">
            <div className="text-[#b39257] uppercase tracking-[0.2em] text-[10px]">
              Prinsip Alokasi Terkendali
            </div>
            <p className="font-light leading-relaxed">
              Untuk memastikan perawatan veteriner menyeluruh dan dokumentasi transfer yang patuh, hanya sejumlah individu hasil penangkaran yang tersedia dalam interval terjadwal.
            </p>
          </FadeIn>
        </div>

        {/* Status Banner */}
        <FadeIn direction="up" delay={0.1}>
          <div className="p-6 rounded-2xl border border-[#d6be8c]/25 bg-[#0d1811] mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-xs">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#b39257]/15 border border-[#b39257]/30 flex flex-col items-center justify-center">
                <span className="text-[9px] uppercase tracking-wider text-[#b39257]">{currentRelease.week || "W-40"}</span>
                <span className="font-bold text-[#f5efeb]">
                  {currentRelease.formattedDate ? currentRelease.formattedDate.slice(0, 2) : "OCT"}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#b39257] block">
                  Jendela Rilis Saat Ini
                </span>
                <span className="text-base text-[#f5efeb] font-serif font-light">
                  {currentRelease.formattedDate} Kohort Rilis
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                <span className="text-[#f5efeb]">
                  {String(currentRelease.availableSingle).padStart(2, "0")} Individu Tersedia
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#b39257] animate-pulse" />
                <span className="text-[#f5efeb]">
                  {String(currentRelease.availablePair).padStart(2, "0")} Pasang Tersedia
                </span>
              </div>
              <div className="text-[10px] text-[#d6be8c] px-3 py-1 rounded-full border border-[#d6be8c]/20 bg-[#132218]">
                Rilis Berikutnya: {nextReleaseDate}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Two Primary Reservation Choices: Single vs Pair (Editorial Composition) ── */}
        {(() => {
          const isSingleAvailable = (currentRelease.availableSingle ?? 0) > 0 && currentRelease.status !== "closed" && !currentRelease.isPast;
          const isPairAvailable = (currentRelease.availablePair ?? 0) > 0 && currentRelease.status !== "closed" && !currentRelease.isPast;

          const pairPrice = currentPair?.price ?? 60000000;
          const rawPairDeposit = currentPair?.deposit ?? 10000000;
          const pairDeposit = rawPairDeposit > pairPrice ? pairPrice : rawPairDeposit;

          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Option 1: INDIVIDUAL (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col">
                <FadeIn direction="up" delay={0.15} className="h-full">
                  <div className="h-full p-8 sm:p-10 rounded-3xl border border-[#d6be8c]/25 bg-[#0d1811] flex flex-col justify-between space-y-8 relative overflow-hidden group shadow-xl">
                    <div>
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[#b39257] font-mono pb-4 border-b border-[#d6be8c]/15 mb-6">
                        <span>Alokasi Individu</span>
                        <span className={isSingleAvailable ? "text-[#38bdf8]" : "text-[#d6be8c]"}>
                          {isSingleAvailable ? `${currentRelease.availableSingle} Burung Tersedia` : "Daftar Tunggu"}
                        </span>
                      </div>

                      <span className="text-xs uppercase tracking-[0.25em] text-[#d6be8c] font-mono block mb-1">
                        Opsi 01
                      </span>
                      <h3 className="font-serif text-3xl sm:text-4xl text-[#f5efeb] font-light mb-4">
                        Reservasi Individu
                      </h3>

                      <p className="text-xs sm:text-sm text-[#f5efeb]/75 font-mono leading-relaxed mb-6">
                        Satu individu Jalak Bali hasil penangkaran dengan cincin kaki logam tertutup, konfirmasi jenis kelamin DNA, dan dokumentasi microchip. Ideal untuk koleksi aviari yang mapan.
                      </p>

                      <div className="p-4 rounded-xl bg-[#08110b] border border-[#d6be8c]/15 space-y-2 font-mono text-xs mb-6">
                        <div className="flex justify-between text-[#f5efeb]/60">
                          <span>Kandidat Unggulan</span>
                          <span className="text-[#f5efeb] font-semibold">{currentSingle ? `${currentSingle.publicId}` : "Spesimen Terjadwal"}</span>
                        </div>
                        <div className="flex justify-between text-[#f5efeb]/60">
                          <span>Jenis Kelamin / Usia</span>
                          <span className="text-[#f5efeb] capitalize">{currentSingle ? `${currentSingle.sex === "male" ? "Jantan" : "Betina"} · ${currentSingle.age || "Usia Remaja"}` : "DNA Terverifikasi"}</span>
                        </div>
                        <div className="flex justify-between text-[#f5efeb]/60">
                          <span>Catatan Silsilah</span>
                          <span className="text-[#d6be8c]">Tersedia setelah verifikasi</span>
                        </div>
                        <div className="pt-2 border-t border-[#d6be8c]/15 flex justify-between items-baseline text-sm">
                          <span className="text-[#b39257]">Deposit Reservasi</span>
                          <span className="font-serif text-lg text-[#f5efeb]">
                            Rp {currentSingle?.deposit ? currentSingle.deposit.toLocaleString("id-ID") : "5.000.000"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (isSingleAvailable && currentSingle) {
                            onReserveIndividual(currentSingle.id);
                          } else {
                            onJoinWaitlist("individual");
                          }
                        }}
                        data-cursor="RESERVE"
                        className={`w-full py-4 rounded-full text-[11px] uppercase tracking-[0.25em] font-mono font-semibold transition-all shadow-[0_10px_25px_rgba(179,146,87,0.25)] flex items-center justify-center space-x-2 cursor-pointer ${
                          isSingleAvailable
                            ? "bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b]"
                            : "border border-[#b39257] bg-[#b39257]/15 text-[#d6be8c] hover:bg-[#b39257] hover:text-[#08110b]"
                        }`}
                      >
                        <span>{isSingleAvailable && currentSingle ? "Reservasi Individu" : "Gabung Daftar Tunggu"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                      <span className="block text-[10px] text-center text-[#f5efeb]/50 font-mono">
                        Tunduk pada regulasi berlaku · Verifikasi diperlukan
                      </span>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Option 2: PAIR (7 Cols - Wider Editorial Feature) */}
              <div className="lg:col-span-7 flex flex-col">
                <FadeIn direction="up" delay={0.25} className="h-full">
                  <div className="h-full p-8 sm:p-12 rounded-3xl border border-[#b39257]/40 bg-[#101e14] flex flex-col justify-between space-y-8 relative overflow-hidden shadow-2xl">
                    {/* Decorative Badge */}
                    <div className="absolute top-0 right-0 bg-[#b39257]/20 border-b border-l border-[#b39257]/40 px-5 py-2 rounded-bl-2xl text-[9px] uppercase tracking-[0.25em] font-mono text-[#d6be8c]">
                      Silsilah Bonding
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[#b39257] font-mono pb-4 border-b border-[#d6be8c]/20 mb-6">
                        <span>Alokasi Pasang Penangkaran</span>
                        <span className={isPairAvailable ? "text-[#38bdf8]" : "text-[#d6be8c]"}>
                          {isPairAvailable
                            ? `${String(currentRelease.availablePair).padStart(2, "0")} Pasang Tersedia`
                            : "Kuota Penuh / Daftar Tunggu"}
                        </span>
                      </div>

                      <span className="text-xs uppercase tracking-[0.25em] text-[#d6be8c] font-mono block mb-1">
                        Opsi 02
                      </span>
                      <h3 className="font-serif text-3xl sm:text-5xl text-[#f5efeb] font-light mb-4">
                        Reservasi Pasang
                      </h3>

                      <p className="text-xs sm:text-sm text-[#f5efeb]/80 font-mono leading-relaxed mb-6">
                        Pasang jantan dan betina Jalak Bali yang terpilih secara genetik dengan kompatibilitas sosial yang terkonfirmasi. Dipilih khusus untuk program pelestarian avikultural dan aviari berlisensi.
                      </p>

                      {/* Pair Information Dossier Box */}
                      <div className="p-6 rounded-2xl bg-[#08110b] border border-[#d6be8c]/25 space-y-4 font-mono text-xs mb-6">
                        <div className="flex items-center justify-between border-b border-[#d6be8c]/15 pb-3">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#b39257] block">ID PASANG</span>
                            <span className="text-base text-[#f5efeb] font-bold">{currentPair ? currentPair.pairTag : "PASANGAN INDUKAN"}</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-[#38bdf8] border border-[#38bdf8]/40 px-2.5 py-1 rounded bg-[#38bdf8]/10">
                            Kompatibilitas Bonding
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                          <div className="p-3 rounded-lg bg-[#0d1811] border border-[#d6be8c]/15">
                            <span className="text-[9px] uppercase text-[#b39257] block">BURUNG A (JANTAN)</span>
                            <span className="text-sm font-semibold text-[#f5efeb]">{currentPair?.birdA ? currentPair.birdA.publicId : "Jantan ♂"}</span>
                            <span className="block text-[10px] text-[#f5efeb]/60 mt-0.5">{currentPair?.birdA?.ringTag ? `Ring: ${currentPair.birdA.ringTag}` : "DNA Terverifikasi"}</span>
                          </div>
                          <div className="p-3 rounded-lg bg-[#0d1811] border border-[#d6be8c]/15">
                            <span className="text-[9px] uppercase text-[#b39257] block">BURUNG B (BETINA)</span>
                            <span className="text-sm font-semibold text-[#f5efeb]">{currentPair?.birdB ? currentPair.birdB.publicId : "Betina ♀"}</span>
                            <span className="block text-[10px] text-[#f5efeb]/60 mt-0.5">{currentPair?.birdB?.ringTag ? `Ring: ${currentPair.birdB.ringTag}` : "DNA Terverifikasi"}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex items-start space-x-2 text-[11px] text-[#f5efeb]/70">
                          <Info className="w-3.5 h-3.5 text-[#b39257] flex-shrink-0 mt-0.5" />
                          <span>{currentPair?.description || "Perilaku saling merapikan bulu dan bertengger bersama teramati secara sinkron di aviari sosial."}</span>
                        </div>

                        <div className="pt-3 border-t border-[#d6be8c]/15 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                          <span className="text-xs text-[#b39257]">Total Pasang: Rp {pairPrice.toLocaleString("id-ID")}</span>
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] uppercase text-[#f5efeb]/50 block">Deposit Reservasi</span>
                            <span className="font-serif text-2xl text-[#d6be8c]">
                              Rp {pairDeposit.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {isPairAvailable ? (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                if (currentPair) {
                                  onReservePair(currentPair.id);
                                } else {
                                  onJoinWaitlist("pair");
                                }
                              }}
                              data-cursor="RESERVE"
                              className="flex-1 py-4 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[11px] uppercase tracking-[0.25em] font-mono font-semibold transition-all shadow-[0_12px_30px_rgba(179,146,87,0.3)] flex items-center justify-center space-x-2 cursor-pointer"
                            >
                              <span>Reservasi Pasang</span>
                              <ArrowRight className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => onJoinWaitlist("pair")}
                              className="px-6 py-4 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] hover:text-[#d6be8c] text-[#f5efeb] text-[10px] uppercase tracking-[0.2em] font-mono transition-colors text-center cursor-pointer"
                            >
                              Daftar Tunggu
                            </motion.button>
                          </>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onJoinWaitlist("pair")}
                            className="w-full py-4 rounded-full border border-[#b39257] bg-[#b39257]/15 hover:bg-[#b39257] hover:text-[#08110b] text-[#d6be8c] text-[11px] uppercase tracking-[0.25em] font-mono font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            <span>Bergabung Daftar Tunggu Pasangan</span>
                            <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                      <span className="block text-[10px] text-center text-[#f5efeb]/50 font-mono">
                        Dokumentasi legal tersedia setelah verifikasi · Tunduk pada regulasi berlaku
                      </span>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
