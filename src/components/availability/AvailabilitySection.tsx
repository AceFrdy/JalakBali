"use client";

import { useRef, useState } from "react";
import { ArrowRight, Calendar, Users, Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AVAILABILITY_CALENDAR_SLOTS } from "@/data/weeklyReleases";
import { AvailabilitySlot } from "@/types";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";

interface AvailabilitySectionProps {
  onSelectSlot: (slot: AvailabilitySlot) => void;
  onJoinWaitlist: (slot: AvailabilitySlot) => void;
}

export function AvailabilitySection({
  onSelectSlot,
  onJoinWaitlist,
}: AvailabilitySectionProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startScrollLeft: number } | null>(null);
  const wasDraggedRef = useRef(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("slot-oct-03");

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    dragRef.current = {
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
    };
    wasDraggedRef.current = false;
    if (event.target instanceof HTMLElement) {
      event.target.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;

    const deltaX = event.clientX - dragRef.current.startX;
    if (Math.abs(deltaX) > 5) wasDraggedRef.current = true;
    if (wasDraggedRef.current) {
      event.currentTarget.scrollLeft = dragRef.current.startScrollLeft - deltaX;
    }
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!wasDraggedRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    wasDraggedRef.current = false;
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    const canScroll = event.deltaY > 0
      ? element.scrollLeft < maxScrollLeft
      : element.scrollLeft > 0;

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && canScroll) {
      element.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  };

  const selectedSlot =
    AVAILABILITY_CALENDAR_SLOTS.find((s) => s.id === selectedSlotId) ||
    AVAILABILITY_CALENDAR_SLOTS[2];

  return (
    <section id="availability" className="relative py-28 md:py-36 bg-[#060e08] text-[#f5efeb] border-t border-[#d6be8c]/15">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 md:mb-20 gap-8 border-b border-[#d6be8c]/15 pb-12">
          <div className="max-w-2xl">
            <FadeIn direction="up">
              <div className="flex items-center space-x-3 mb-4">
                <span className="h-[1px] w-6 bg-[#b39257]" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                  Jadwal Rilis Mingguan · Oktober 2026
                </span>
              </div>
            </FadeIn>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight">
              <TextReveal text="Ketersediaan" as="span" />{" "}
              <span className="italic font-serif text-[#d6be8c]">Jadwal & Kalender</span>
            </h2>
          </div>

          <FadeIn direction="left" delay={0.2} className="max-w-lg font-mono text-xs text-[#f5efeb]/75 space-y-2 border-l border-[#d6be8c]/25 pl-6">
            <div className="text-[#b39257] uppercase tracking-[0.2em] text-[10px]">
              Jendela Rilis Terjadwal
            </div>
            <p className="font-light leading-relaxed">
              Ketersediaan tidak pernah dilebih-lebihkan. Ketika alokasi direservasi, status berubah ketat menjadi &ldquo;Dalam Verifikasi&rdquo; atau &ldquo;Direservasi&rdquo;. Calon pembeli dapat bergabung dalam daftar tunggu untuk kohort berikutnya.
            </p>
          </FadeIn>
        </div>

        {/* ── Status Ribbon ── */}
        <FadeIn direction="up" delay={0.1}>
          <div className="p-6 rounded-2xl border border-[#d6be8c]/20 bg-[#0d1811] mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-xs">
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#b39257] block mb-1">
                Monitor Status Rilis
              </span>
              <div className="text-sm text-[#f5efeb] flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-[#b39257] animate-pulse" />
                <span>
                  Kohort Aktif:{" "}
                  <strong className="text-[#d6be8c] font-semibold">
                    03 Oktober 2026 (Minggu 40)
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                <span>Terbuka untuk Reservasi</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#b39257]/60" />
                <span>Daftar Tunggu Aktif</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#1c2c20]" />
                <span>Pemeliharaan / Tutup</span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Horizontal Availability Calendar Scroller ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#d6be8c] uppercase tracking-[0.2em]">
              Pilih Tanggal Rilis untuk Melihat Daftar
            </span>
            <span className="text-[#f5efeb]/40 hidden sm:inline">
              Tanggal dapat diperluas untuk menampilkan alokasi individu & jendela serah terima
            </span>
          </div>

          <div
            ref={calendarRef}
            className="overflow-x-auto pb-4 pt-1 no-scrollbar cursor-grab active:cursor-grabbing select-none touch-pan-x"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClickCapture={handleClickCapture}
            onWheel={handleWheel}
          >
            <div className="flex space-x-4 min-w-max">
              {AVAILABILITY_CALENDAR_SLOTS.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isAvailable = slot.status === "available";
                const isWaitlist = slot.status === "waitlist";
                const isLimited = slot.status === "limited";
                const isClosed = slot.status === "closed";

                return (
                  <motion.button
                    key={slot.id}
                    onClick={() => {
                      if (!isClosed) setSelectedSlotId(slot.id);
                    }}
                    disabled={isClosed}
                    whileHover={!isClosed ? { scale: 1.03 } : undefined}
                    whileTap={!isClosed ? { scale: 0.98 } : undefined}
                    animate={{ scale: isSelected ? 1.03 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`p-6 rounded-2xl text-left transition-colors duration-300 w-48 sm:w-52 border flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#16271c] border-[#b39257] shadow-xl"
                        : isClosed
                        ? "bg-[#08110b]/50 border-[#d6be8c]/5 opacity-30 cursor-not-allowed"
                        : "bg-[#0d1811] border-[#d6be8c]/15 hover:border-[#d6be8c]/40 hover:bg-[#112117]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#b39257] uppercase tracking-[0.25em] mb-3">
                        <span>{slot.dayOfWeek}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#b39257]" />}
                      </div>

                      <div className="font-serif text-2xl text-[#f5efeb] font-light mb-1">
                        {slot.formattedDate.slice(0, 6)}
                      </div>
                      <div className="font-mono text-[10px] text-[#d6be8c]/80">
                        {slot.time}
                      </div>
                    </div>

                    <div className="mt-8 pt-3 border-t border-[#d6be8c]/15 font-mono text-xs">
                      {isAvailable && (
                        <span className="text-[#38bdf8] block font-medium">
                          {slot.availableSingles} Individu · {slot.availablePairs} Pasang
                        </span>
                      )}
                      {isWaitlist && (
                        <span className="text-[#b39257] block">Daftar Tunggu Terbuka</span>
                      )}
                      {isLimited && (
                        <span className="text-[#f5efeb]/60 block">Pra-Rilis</span>
                      )}
                      {isClosed && (
                        <span className="text-[#f5efeb]/25 block">Fasilitas Istirahat</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Selected Date Expanded Dossier (Smooth expansion animation) ── */}
        <FadeIn direction="up" delay={0.15} className="mt-10">
          <div className="p-8 sm:p-10 rounded-3xl border border-[#d6be8c]/25 bg-[#0d1811] shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSlot.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
              >
                <div className="space-y-4">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#b39257] font-mono">
                    Pemeriksaan Jendela Rilis · {selectedSlot.formattedDate}
                  </div>

                  <div className="flex flex-wrap items-baseline gap-4">
                    <h3 className="font-serif text-3xl sm:text-4xl text-[#f5efeb] font-light">
                      Rilis {selectedSlot.formattedDate}
                    </h3>
                    <span className="text-xs font-mono text-[#d6be8c] px-3 py-1 rounded-full border border-[#d6be8c]/25 bg-[#132218]">
                      Status: {selectedSlot.status === "available" ? "TERSEDIA" : selectedSlot.status === "waitlist" ? "DAFTAR TUNGGU" : selectedSlot.status === "limited" ? "TERBATAS" : "TUTUP"}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#f5efeb]/75 font-mono leading-relaxed max-w-xl">
                    {selectedSlot.note}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono text-xs text-[#f5efeb]/70">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Tersedia: {selectedSlot.availableSingles} Individu, {selectedSlot.availablePairs} Pasang</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-3.5 h-3.5 text-[#b39257]" />
                      <span>Serah Terima: 10–14 hari setelah persetujuan verifikasi</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex flex-col gap-3 font-mono">
                  {selectedSlot.status === "available" ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectSlot(selectedSlot)}
                      data-cursor="RESERVE"
                      className="px-8 py-4 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[11px] uppercase tracking-[0.25em] font-semibold transition-all shadow-[0_10px_25px_rgba(179,146,87,0.25)] flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>Mulai Reservasi</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onJoinWaitlist(selectedSlot)}
                      data-cursor="WAITLIST"
                      className="px-8 py-4 rounded-full border border-[#b39257] hover:bg-[#b39257]/15 text-[#d6be8c] text-[11px] uppercase tracking-[0.25em] font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>Masuk Daftar Tunggu Prioritas</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                  <span className="text-[10px] text-center text-[#f5efeb]/50">
                    Verifikasi diperlukan sebelum penyelesaian transaksi
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
