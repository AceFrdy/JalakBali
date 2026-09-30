"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CURRENT_RELEASE } from "@/data/weeklyReleases";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

interface NavbarProps {
  onOpenReservation: () => void;
}

export function Navbar({ onOpenReservation }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <ScrollProgress />
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#08110b]/92 backdrop-blur-md border-b border-[#d6be8c]/15 py-3.5 shadow-2xl"
            : "bg-gradient-to-b from-[#08110b]/95 via-[#08110b]/40 to-transparent py-6"
        }`}
      >
        <div className="max-w-[1760px] mx-auto site-gutter flex items-center justify-between">
          {/* Left Brand Identity */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex flex-col group focus:outline-none">
              <span className="font-serif text-2xl md:text-3xl tracking-[0.2em] uppercase text-[#f5efeb] font-light transition-colors group-hover:text-[#d6be8c]">
                Jalak Bali
              </span>
            </Link>

            <span className="hidden xl:inline-block h-6 w-[1px] bg-[#d6be8c]/20" />

            <div className="hidden xl:flex flex-col text-[9px] uppercase tracking-[0.25em] text-[#f5efeb]/55 font-mono">
              <span>Platform Penangkaran Legal Resmi</span>
              <span className="text-[#b39257]">Cincin Tertutup · Terverifikasi Microchip</span>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center space-x-8 text-[11px] uppercase tracking-[0.22em] text-[#f5efeb]/75 font-mono">
            {[
              { href: "#collection", label: "Koleksi" },
              { href: "#responsible-breeding", label: "Penangkaran" },
              { href: "#availability", label: "Ketersediaan" },
              { href: "#provenance", label: "Asal-Usul" },
              { href: "#reviews", label: "Ulasan" },
            ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group relative py-1 hover:text-[#d6be8c] transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d6be8c] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
          </nav>

          {/* Right Action: Release Quota & Primary Reserve CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="text-right font-mono">
              <span className="block text-[8px] uppercase tracking-[0.3em] text-[#b39257]">
                Kuota Mingguan
              </span>
              <span className="text-[10px] text-[#f5efeb]/80 tracking-wide">
                Berikutnya: {CURRENT_RELEASE.formattedDate.slice(0, 6)} ({CURRENT_RELEASE.availableSingle}I · {CURRENT_RELEASE.availablePair}P)
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenReservation}
              data-cursor="RESERVE"
              className="group px-6 py-2.5 rounded-full border border-[#b39257]/70 bg-[#b39257]/10 hover:bg-[#b39257] text-[#f5efeb] hover:text-[#08110b] text-[10px] uppercase tracking-[0.25em] font-mono transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <span>Reservasi</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex items-center space-x-3 md:hidden">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onOpenReservation}
              className="px-4 py-1.5 rounded-full border border-[#b39257] bg-[#b39257]/15 text-[#f5efeb] text-[10px] uppercase tracking-[0.2em] font-mono"
            >
              Reservasi
            </motion.button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#f5efeb] hover:text-[#b39257] transition-colors"
              aria-label="Buka/tutup menu"
            >
              <div className="w-6 space-y-1.5">
                <span
                  className={`block h-[1px] w-6 bg-[#d6be8c] transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-[1px] w-4 bg-[#d6be8c] ml-auto transition-opacity duration-200 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-[1px] w-6 bg-[#d6be8c] transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#08110b]/98 backdrop-blur-2xl flex flex-col justify-between p-8 pt-28 md:hidden border-b border-[#b39257]/20"
          >
            <div className="space-y-8">
              <div className="text-[9px] uppercase tracking-[0.35em] text-[#b39257] font-mono border-b border-[#b39257]/20 pb-2">
                Platform Index · Jalak Bali
              </div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
                  },
                }}
                className="flex flex-col space-y-5 text-xl font-serif"
              >
                {[
                  { href: "#collection", label: "Koleksi Terkini" },
                  { href: "#responsible-breeding", label: "Penangkaran Bertanggung Jawab" },
                  { href: "#availability", label: "Jadwal Rilis Mingguan" },
                  { href: "#provenance", label: "Asal-Usul Tertelusur" },
                  { href: "#reviews", label: "Refleksi Pelanggan" },
                ].map((link, idx) => (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[#f5efeb] hover:text-[#b39257] transition-colors"
                    >
                      {link.label}
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="pt-6 border-t border-[#b39257]/20 space-y-4 font-mono">
              <div className="flex justify-between items-center text-[11px] text-[#f5efeb]/60">
                <span>Status Rilis</span>
                <span className="text-[#b39257]">Kohort Minggu 40 Aktif</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReservation();
                }}
                className="w-full py-4 rounded-full bg-[#b39257] text-[#08110b] text-center text-xs uppercase tracking-[0.25em] font-semibold cursor-pointer shadow-lg"
              >
                Mulai Reservasi
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
