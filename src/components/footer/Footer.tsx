"use client";

import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";

interface FooterProps {
  onOpenReservation?: () => void;
}

export function Footer({ onOpenReservation }: FooterProps) {
  return (
    <footer className="relative bg-[#050a06] text-[#f5efeb] border-t border-[#d6be8c]/20 pt-24 pb-16">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Top Call to Action Banner */}
        <FadeIn direction="up">
          <div className="p-8 sm:p-12 md:p-16 rounded-3xl border border-[#d6be8c]/25 bg-[#0d1811] mb-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-2xl">
            <div className="max-w-xl">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#b39257] font-mono block mb-2">
                Pemberitahuan Kuota Rilis Mingguan
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#f5efeb] font-light mb-3">
                <TextReveal text="Siap memulai reservasi terverifikasi Anda?" as="span" />
              </h3>
              <p className="text-xs sm:text-sm text-[#f5efeb]/70 font-mono">
                Alokasi ditetapkan secara berurutan setelah tinjauan verifikasi. Maksimum 1–2 individu atau 1 pasang per jadwal rilis mingguan.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link href="/reserve">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-cursor="RESERVE"
                  className="group px-8 py-4 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[11px] uppercase tracking-[0.25em] font-mono font-semibold transition-all shadow-[0_10px_30px_rgba(179,146,87,0.25)] flex items-center space-x-2.5 cursor-pointer"
                >
                  <span>Reservasi Individu</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.div>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* ── Main Footer Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#d6be8c]/15">
          {/* Brand Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-light tracking-[0.2em] text-[#f5efeb] uppercase">
                Jalak Bali
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                Langka · Bertanggung Jawab · Memukau
              </span>
            </div>
            <p className="text-xs text-[#f5efeb]/70 font-mono leading-relaxed max-w-sm">
              Platform penangkaran legal premium yang didedikasikan untuk pelestarian Jalak Bali (Leucopsar rothschildi). Beroperasi sesuai pengelolaan studbook avikultural, sertifikasi DNA, dan pengelolaan hak asuh legal terverifikasi.
            </p>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#d6be8c] pt-2">
              <ShieldCheck className="w-4 h-4 text-[#b39257]" />
              <span>Studbook Unggas Bersertifikat & Standar Penangkaran</span>
            </div>
          </div>

          {/* Quick Index */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#b39257] block mb-4">
              Indeks Platform
            </span>
            <ul className="space-y-2.5 text-[#f5efeb]/75 font-light">
              {[
                { href: "#collection", label: "Koleksi Terkini" },
                { href: "#weekly-release", label: "Daftar Rilis Mingguan" },
                { href: "#responsible-breeding", label: "Penangkaran Bertanggung Jawab" },
                { href: "#provenance", label: "Asal-Usul Terlacak" },
                { href: "#reviews", label: "Ulasan Pelanggan Terverifikasi" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="hover:text-[#b39257] transition-colors relative inline-block group"
                  >
                    <span>{link.label}</span>
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-[#b39257]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance & Coordination Outpost */}
          <div className="md:col-span-4 space-y-3 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#b39257] block mb-4">
              Fasilitas Penangkaran & Kantor
            </span>
            <div className="text-[#f5efeb]/80 space-y-1">
              <div>Kompleks Aviari Penangkaran Berlisensi</div>
              <div>Kabupaten Buleleng, Bali 81155</div>
              <div className="text-[#b39257] pt-1">
                Kode Identifikasi Registri: JB-CB-BALI
              </div>
            </div>

            <div className="pt-4 text-[#f5efeb]/60 text-[11px]">
              <div>Layanan Verifikasi: registrar@jalakbali.breeding</div>
              <div>Koordinasi Serah Terima: +62 (362) 882-901</div>
            </div>
          </div>
        </div>

        {/* Legal & Attribution Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#f5efeb]/40">
          <div>
            © {new Date().getFullYear()} Inisiatif Penangkaran JALAK BALI. Hak cipta dilindungi undang-undang.
          </div>
          <div className="text-right sm:text-right text-[10px] text-[#f5efeb]/50">
            Dokumentasi legal tersedia setelah verifikasi · Tunduk pada regulasi berlaku
          </div>
        </div>
      </div>
    </footer>
  );
}
