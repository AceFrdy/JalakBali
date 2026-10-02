"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CURRENT_RELEASE } from "@/data/weeklyReleases";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

interface NavbarProps {
  onOpenReservation: () => void;
}

export function Navbar({ onOpenReservation }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <ScrollProgress />
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#08110b]/92 backdrop-blur-md border-b border-[#d6be8c]/15 py-2.5 shadow-2xl"
            : "bg-gradient-to-b from-[#08110b]/95 via-[#08110b]/40 to-transparent py-3"
        }`}
      >
        <div className="max-w-[1760px] mx-auto site-gutter flex items-center justify-between">
          <Link href="/" className="flex shrink-0 flex-col group focus:outline-none">
            <span className="font-serif text-2xl md:text-3xl tracking-[0.2em] uppercase text-[#f5efeb] font-light transition-colors group-hover:text-[#d6be8c]">
              Jalak Bali
            </span>
          </Link>

          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 text-[9px] lg:text-[10px] xl:text-[11px] uppercase tracking-[0.18em] text-[#f5efeb]/75 font-mono"
          >
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
                className="group relative whitespace-nowrap py-1 transition-colors hover:text-[#d6be8c]"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-[#d6be8c] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <Link
              href="/reservation/lookup"
              className="group relative whitespace-nowrap py-1 transition-colors hover:text-[#d6be8c] text-[#d6be8c]/80"
            >
              <span>Cek Reservasi</span>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-[#d6be8c] transition-all duration-300 group-hover:w-full" />
            </Link>

          </nav>

          <div className="hidden lg:flex items-center space-x-6">
            <div className="text-right font-mono">
              <span className="block text-[8px] uppercase tracking-[0.3em] text-[#b39257]">
                Kuota Mingguan
              </span>
              <span className="text-[10px] tracking-wide text-[#f5efeb]/80">
                Berikutnya: {CURRENT_RELEASE.formattedDate.slice(0, 6)} ({CURRENT_RELEASE.availableSingle}I · {CURRENT_RELEASE.availablePair}P)
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onOpenReservation}
              data-cursor="RESERVE"
              className="group flex items-center space-x-2 rounded-full border border-[#b39257]/70 bg-[#b39257]/10 px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[#f5efeb] shadow-sm transition-all duration-300 hover:bg-[#b39257] hover:text-[#08110b]"
            >
              <span>Reservasi</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d6be8c]/30 text-[#f5efeb] transition-colors hover:border-[#b39257] hover:text-[#d6be8c]"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              id="mobile-navigation"
              aria-label="Navigasi mobile"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 top-full border-b border-[#d6be8c]/20 bg-[#08110b]/98 px-6 py-3 shadow-2xl backdrop-blur-xl md:hidden"
            >
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
                  onClick={() => setMobileMenuOpen(false)}
                  className="block border-b border-[#d6be8c]/10 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f5efeb]/80 transition-colors hover:text-[#d6be8c]"
                >
                  {item.label}
                </a>
              ))}
              <Link
                href="/reservation/lookup"
                onClick={() => setMobileMenuOpen(false)}
                className="block border-b border-[#d6be8c]/10 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#d6be8c] transition-colors last:border-0 hover:text-[#f5efeb]"
              >
                Cek Reservasi
              </Link>

            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
