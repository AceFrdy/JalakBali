"use client";

import { Calendar, ShieldCheck, Truck, Clock, CheckCircle2, MapPin } from "lucide-react";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

export function HandoverScheduleSection() {
  const steps = [
    {
      step: "01",
      title: "Reservasi Dikonfirmasi",
      detail: "Penangguhan sementara diamankan setelah alokasi deposit. Burung ditandai sebagai ditahan dalam daftar.",
    },
    {
      step: "02",
      title: "Dokumentasi Terverifikasi",
      detail: "Identitas penjaga dan kondisi kesejahteraan aviari diperiksa oleh petugas kepatuhan kami.",
    },
    {
      step: "03",
      title: "Jadwal Serah Terima Ditetapkan",
      detail: "Pemeriksaan kesehatan akhir dilakukan oleh dokter hewan unggas kami dalam 48 jam sebelum transit.",
    },
    {
      step: "04",
      title: "Konfirmasi & Transfer Akhir",
      detail: "Sertifikat cincin resmi, dossier silsilah DNA, dan pemindaian microchip diselesaikan saat serah terima.",
    },
  ];

  return (
    <section className="relative py-28 md:py-36 bg-[#060e08] text-[#f5efeb] border-t border-[#d6be8c]/15">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8 border-b border-[#d6be8c]/15 pb-10">
          <div>
            <FadeIn direction="up">
              <div className="flex items-center space-x-3 mb-3">
                <span className="h-[1px] w-6 bg-[#b39257]" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                  Protokol Transit & Manifes Serah Terima
                </span>
              </div>
            </FadeIn>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight">
              <TextReveal text="Serah Terima" as="span" />{" "}
              <span className="italic font-serif text-[#d6be8c]">Jadwal & Protokol</span>
            </h2>
          </div>

          <FadeIn direction="left" delay={0.2} className="max-w-md font-mono text-xs text-[#f5efeb]/70">
            <p className="font-light leading-relaxed">
              Mengingat sifat sensitif Jalak Bali, setiap serah terima dijadwalkan secara individual untuk meminimalkan stres akustik dan lingkungan selama transit.
            </p>
          </FadeIn>
        </div>

        {/* ── 4-Step Handover Progression ── */}
        <div className="mb-16 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto pb-4 no-scrollbar md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 lg:grid-cols-4">
          {steps.map((s, idx) => (
            <FadeIn
              key={s.step}
              direction="up"
              delay={idx * 0.1}
              viewportMargin="0px"
              className="w-[84%] shrink-0 snap-start md:w-auto"
            >
              <div className="p-6 rounded-2xl border border-[#d6be8c]/15 bg-[#0d1811] h-full flex flex-col justify-between space-y-4 font-mono">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#b39257] mb-2">
                    Step {s.step}
                  </div>
                  <h3 className="font-serif text-xl text-[#f5efeb] font-light mb-2">
                    {s.title}
                  </h3>
                  <p className="font-sans text-xs text-[#f5efeb]/75 font-light leading-relaxed">
                    {s.detail}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#d6be8c]/10 text-[10px] text-[#38bdf8] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Izin Resmi</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ── Metode Serah Terima ── */}
        {/* <FadeIn direction="up" delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 sm:p-12 rounded-3xl border border-[#d6be8c]/25 bg-[#0d1811] font-mono text-xs shadow-2xl">
            <div className="space-y-4 border-b md:border-b-0 md:border-r border-[#d6be8c]/20 pb-8 md:pb-0 md:pr-8">
              <div className="flex items-center space-x-2 text-[#b39257]">
                <MapPin className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-[0.25em]">Opsi A</span>
              </div>
              <h4 className="font-serif text-2xl text-[#f5efeb] font-light">
                Serah Terima di Fasilitas (Bali)
              </h4>
              <p className="font-sans text-xs text-[#f5efeb]/75 font-light leading-relaxed">
                Penjaga terdaftar dapat mengambil individu atau pasangan langsung di fasilitas penangkaran kami di Bali. Termasuk tur aviari pribadi, pengarahan perawat, dan verifikasi microchip langsung.
              </p>
              <div className="pt-2 text-[11px] text-[#d6be8c] space-y-1">
                <div>• Janji temu dijadwalkan pukul 10.00 – 14.00</div>
                <div>• Kandang transport gelap berstandar disediakan</div>
                <div>• Sertifikat kesehatan asli diserahkan</div>
              </div>
            </div>

            <div className="space-y-4 md:pl-4">
              <div className="flex items-center space-x-2 text-[#38bdf8]">
                <Truck className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-[0.25em]">Opsi B</span>
              </div>
              <h4 className="font-serif text-2xl text-[#f5efeb] font-light">
                Kurir Satwa Liar Bersertifikat
              </h4>
              <p className="font-sans text-xs text-[#f5efeb]/75 font-light leading-relaxed">
                Transit bersuhu terkontrol di seluruh Jawa dan Bali. Ditangani oleh handler unggas berpengalaman tanpa pemberhentian gudang perantara.
              </p>
              <div className="pt-2 text-[11px] text-[#d6be8c] space-y-1">
                <div>• Pencatatan iklim berkelanjutan (26°C – 28°C)</div>
                <div>• Pengiriman langsung ke aviari terdaftar</div>
                <div>• Terkoordinasi dengan protokol transit avikultural daerah</div>
              </div>
            </div>
          </div>
        </FadeIn> */}
      </div>
    </section>
  );
}
