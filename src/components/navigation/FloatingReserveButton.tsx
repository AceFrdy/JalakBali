"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CURRENT_RELEASE } from "@/data/weeklyReleases";

interface FloatingReserveButtonProps {
  onOpenReservation: () => void;
}

export function FloatingReserveButton({
  onOpenReservation,
}: FloatingReserveButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 420) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop Floating Small CTA (bottom-right) */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="hidden md:block fixed bottom-8 right-8 z-40"
          >
            <div className="p-2 pl-5 pr-2 rounded-full flex items-center space-x-4 bg-[#0d1811]/92 backdrop-blur-md border border-[#d6be8c]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] font-mono">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-[#b39257] animate-pulse" />
                <div className="text-left">
                  <span className="block text-[8px] uppercase tracking-[0.3em] text-[#b39257]">
                    Tersedia Berikutnya
                  </span>
                  <span className="text-[11px] text-[#f5efeb] font-medium tracking-wide">
                    {CURRENT_RELEASE.formattedDate.slice(0, 6)} ({CURRENT_RELEASE.availableSingle}S · {CURRENT_RELEASE.availablePair}P)
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenReservation}
                data-cursor="RESERVE"
                className="group px-5 py-2.5 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>Reservasi</span>
                <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Mobile Sticky Bottom Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#08110b]/95 backdrop-blur-xl border-t border-[#d6be8c]/20 font-mono"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-[0.25em] text-[#b39257]">
                  Rilis Berikutnya: {CURRENT_RELEASE.formattedDate.slice(0, 6)}
                </span>
                <span className="text-[11px] text-[#f5efeb]/80">
                  {CURRENT_RELEASE.availableSingle} Individu · {CURRENT_RELEASE.availablePair} Pasang Tersedia
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onOpenReservation}
                className="px-5 py-2.5 rounded-full bg-[#b39257] text-[#08110b] text-[10px] uppercase tracking-[0.2em] font-bold flex items-center space-x-1.5 shadow-lg cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Cek Ketersediaan</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
