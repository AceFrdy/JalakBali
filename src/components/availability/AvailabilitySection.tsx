"use client";

import { useState } from "react";
import { ArrowRight, Calendar, Users, Shield, CheckCircle2, Clock, Sparkles, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WEEKLY_RELEASES, AVAILABILITY_CALENDAR_SLOTS } from "@/data/weeklyReleases";
import { AvailabilitySlot, WeeklyRelease } from "@/types";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";

interface AvailabilitySectionProps {
  onSelectSlot: (slot: AvailabilitySlot) => void;
  onJoinWaitlist: (slot: AvailabilitySlot) => void;
}

// Full October 2026 Calendar Grid Data (Starts Monday 28 Sep 2026 to Sunday 01 Nov 2026)
interface CalendarDay {
  dateNumber: number;
  dateStr: string; // "YYYY-MM-DD"
  isCurrentMonth: boolean;
  dayOfWeek: "SEN" | "SEL" | "RAB" | "KAM" | "JUM" | "SAB" | "MIN";
  weekLabel?: string;
  releaseId?: string;
  slotData?: AvailabilitySlot;
}

const OCTOBER_2026_DAYS: CalendarDay[] = [
  // Week 40 (28 Sep - 04 Okt)
  { dateNumber: 28, dateStr: "2026-09-28", isCurrentMonth: false, dayOfWeek: "SEN" },
  { dateNumber: 29, dateStr: "2026-09-29", isCurrentMonth: false, dayOfWeek: "SEL" },
  { dateNumber: 30, dateStr: "2026-09-30", isCurrentMonth: false, dayOfWeek: "RAB" },
  {
    dateNumber: 1,
    dateStr: "2026-10-01",
    isCurrentMonth: true,
    dayOfWeek: "KAM",
    slotData: AVAILABILITY_CALENDAR_SLOTS.find((s) => s.date === "2026-10-01"),
  },
  {
    dateNumber: 2,
    dateStr: "2026-10-02",
    isCurrentMonth: true,
    dayOfWeek: "JUM",
    slotData: AVAILABILITY_CALENDAR_SLOTS.find((s) => s.date === "2026-10-02"),
  },
  {
    dateNumber: 3,
    dateStr: "2026-10-03",
    isCurrentMonth: true,
    dayOfWeek: "SAB",
    weekLabel: "W-40",
    releaseId: "release-2026-w40",
    slotData: AVAILABILITY_CALENDAR_SLOTS.find((s) => s.date === "2026-10-03"),
  },
  { dateNumber: 4, dateStr: "2026-10-04", isCurrentMonth: true, dayOfWeek: "MIN" },

  // Week 41 (05 Okt - 11 Okt)
  { dateNumber: 5, dateStr: "2026-10-05", isCurrentMonth: true, dayOfWeek: "SEN" },
  {
    dateNumber: 6,
    dateStr: "2026-10-06",
    isCurrentMonth: true,
    dayOfWeek: "SEL",
    slotData: AVAILABILITY_CALENDAR_SLOTS.find((s) => s.date === "2026-10-06"),
  },
  { dateNumber: 7, dateStr: "2026-10-07", isCurrentMonth: true, dayOfWeek: "RAB" },
  { dateNumber: 8, dateStr: "2026-10-08", isCurrentMonth: true, dayOfWeek: "KAM" },
  { dateNumber: 9, dateStr: "2026-10-09", isCurrentMonth: true, dayOfWeek: "JUM" },
  {
    dateNumber: 10,
    dateStr: "2026-10-10",
    isCurrentMonth: true,
    dayOfWeek: "SAB",
    weekLabel: "W-41",
    releaseId: "release-2026-w41",
    slotData: AVAILABILITY_CALENDAR_SLOTS.find((s) => s.date === "2026-10-10"),
  },
  { dateNumber: 11, dateStr: "2026-10-11", isCurrentMonth: true, dayOfWeek: "MIN" },

  // Week 42 (12 Okt - 18 Okt)
  { dateNumber: 12, dateStr: "2026-10-12", isCurrentMonth: true, dayOfWeek: "SEN" },
  { dateNumber: 13, dateStr: "2026-10-13", isCurrentMonth: true, dayOfWeek: "SEL" },
  { dateNumber: 14, dateStr: "2026-10-14", isCurrentMonth: true, dayOfWeek: "RAB" },
  { dateNumber: 15, dateStr: "2026-10-15", isCurrentMonth: true, dayOfWeek: "KAM" },
  { dateNumber: 16, dateStr: "2026-10-16", isCurrentMonth: true, dayOfWeek: "JUM" },
  {
    dateNumber: 17,
    dateStr: "2026-10-17",
    isCurrentMonth: true,
    dayOfWeek: "SAB",
    weekLabel: "W-42",
    releaseId: "release-2026-w42",
    slotData: AVAILABILITY_CALENDAR_SLOTS.find((s) => s.date === "2026-10-17"),
  },
  { dateNumber: 18, dateStr: "2026-10-18", isCurrentMonth: true, dayOfWeek: "MIN" },

  // Week 43 (19 Okt - 25 Okt)
  { dateNumber: 19, dateStr: "2026-10-19", isCurrentMonth: true, dayOfWeek: "SEN" },
  { dateNumber: 20, dateStr: "2026-10-20", isCurrentMonth: true, dayOfWeek: "SEL" },
  { dateNumber: 21, dateStr: "2026-10-21", isCurrentMonth: true, dayOfWeek: "RAB" },
  { dateNumber: 22, dateStr: "2026-10-22", isCurrentMonth: true, dayOfWeek: "KAM" },
  { dateNumber: 23, dateStr: "2026-10-23", isCurrentMonth: true, dayOfWeek: "JUM" },
  {
    dateNumber: 24,
    dateStr: "2026-10-24",
    isCurrentMonth: true,
    dayOfWeek: "SAB",
    weekLabel: "W-43",
    releaseId: "release-2026-w43",
    slotData: {
      id: "slot-oct-24",
      date: "2026-10-24",
      dayOfWeek: "SAB",
      formattedDate: "24 Okt 2026",
      time: "Terjadwal",
      status: "waitlist",
      availableSingles: 1,
      availablePairs: 0,
      note: "Rilis Pekan 43: Verifikasi kuota akhir bulan sedang berjalan.",
    },
  },
  { dateNumber: 25, dateStr: "2026-10-25", isCurrentMonth: true, dayOfWeek: "MIN" },

  // Week 44 (26 Okt - 01 Nov)
  { dateNumber: 26, dateStr: "2026-10-26", isCurrentMonth: true, dayOfWeek: "SEN" },
  { dateNumber: 27, dateStr: "2026-10-27", isCurrentMonth: true, dayOfWeek: "SEL" },
  { dateNumber: 28, dateStr: "2026-10-28", isCurrentMonth: true, dayOfWeek: "RAB" },
  { dateNumber: 29, dateStr: "2026-10-29", isCurrentMonth: true, dayOfWeek: "KAM" },
  { dateNumber: 30, dateStr: "2026-10-30", isCurrentMonth: true, dayOfWeek: "JUM" },
  {
    dateNumber: 31,
    dateStr: "2026-10-31",
    isCurrentMonth: true,
    dayOfWeek: "SAB",
    weekLabel: "W-44",
    releaseId: "release-2026-w44",
    slotData: {
      id: "slot-oct-31",
      date: "2026-10-31",
      dayOfWeek: "SAB",
      formattedDate: "31 Okt 2026",
      time: "Terjadwal",
      status: "waitlist",
      availableSingles: 0,
      availablePairs: 1,
      note: "Rilis Pekan 44: Jadwal transisi penangkaran November 2026.",
    },
  },
  { dateNumber: 1, dateStr: "2026-11-01", isCurrentMonth: false, dayOfWeek: "MIN" },
];

const DAY_NAMES = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];

export function AvailabilitySection({
  onSelectSlot,
  onJoinWaitlist,
}: AvailabilitySectionProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<string>("slot-oct-03");

  // Find slot data from slots list or fallback to 03 Okt
  const selectedSlot =
    AVAILABILITY_CALENDAR_SLOTS.find((s) => s.id === selectedSlotId) ||
    OCTOBER_2026_DAYS.find((d) => d.slotData?.id === selectedSlotId)?.slotData ||
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
                  Jadwal Rilis Mingguan · Kalender Oktober 2026
                </span>
              </div>
            </FadeIn>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight">
              <TextReveal text="Kalender & Jadwal" as="span" />{" "}
              <span className="italic font-serif text-[#d6be8c]">Rilis Mingguan</span>
            </h2>
          </div>

          <FadeIn direction="left" delay={0.2} className="max-w-lg font-mono text-xs text-[#f5efeb]/75 space-y-2 border-l border-[#d6be8c]/25 pl-6">
            <div className="text-[#b39257] uppercase tracking-[0.2em] text-[10px]">
              Tampilan Kalender Penangkaran
            </div>
            <p className="font-light leading-relaxed">
              Jadwal alokasi dirilis setiap hari Sabtu (Pekan 40, 41, 42, 43, 44). Klik tanggal rilis pada kalender untuk memeriksa ketersediaan spesimen dan memulai alokasi.
            </p>
          </FadeIn>
        </div>

        {/* ── Calendar Container ── */}
        <FadeIn direction="up" delay={0.1}>
          <div className="p-6 sm:p-10 rounded-3xl border border-[#d6be8c]/25 bg-[#0d1811] shadow-2xl space-y-6">
            {/* Calendar Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#d6be8c]/15 gap-4 font-mono text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#b39257]/15 border border-[#b39257]/30 flex items-center justify-center text-[#d6be8c]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#b39257] block">
                    Bulan Alokasi
                  </span>
                  <span className="text-lg sm:text-xl font-serif text-[#f5efeb] font-light">
                    Oktober 2026
                  </span>
                </div>
              </div>

              {/* Status Legend */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                  <span className="text-[#f5efeb]">Rilis Terbuka (Sabtu)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b39257]" />
                  <span className="text-[#d6be8c]">Waitlist / Terjadwal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1c2c20] border border-[#d6be8c]/20" />
                  <span className="text-[#f5efeb]/40">Hari Non-Rilis</span>
                </div>
              </div>
            </div>

            {/* ── 7-Column Days Header ── */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3 text-center font-mono text-[10px] sm:text-xs uppercase tracking-wider text-[#b39257] font-semibold pb-2">
              {DAY_NAMES.map((name, i) => (
                <div
                  key={name}
                  className={`py-2 rounded-lg ${
                    i === 5
                      ? "bg-[#b39257]/15 text-[#d6be8c] font-bold border border-[#b39257]/30"
                      : "text-[#f5efeb]/60"
                  }`}
                >
                  {name}
                </div>
              ))}
            </div>

            {/* ── 7-Column Monthly Calendar Grid (Rows going downwards) ── */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3 font-mono">
              {OCTOBER_2026_DAYS.map((day, idx) => {
                const isRelease = !!day.weekLabel;
                const slot = day.slotData;
                const isSelected = slot && selectedSlotId === slot.id;
                const isAvailable = slot?.status === "available";
                const isWaitlist = slot?.status === "waitlist";
                const isLimited = slot?.status === "limited";
                const isClosed = slot?.status === "closed";

                if (!day.isCurrentMonth) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="min-h-[85px] sm:min-h-[115px] p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-[#d6be8c]/5 bg-[#08110b]/30 opacity-20 flex flex-col justify-between"
                    >
                      <span className="text-xs text-[#f5efeb]/30 text-right">{day.dateNumber}</span>
                    </div>
                  );
                }

                // Regular Non-Release Day
                if (!isRelease && !slot) {
                  return (
                    <div
                      key={day.dateStr}
                      className="min-h-[85px] sm:min-h-[115px] p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-[#d6be8c]/10 bg-[#08110b]/50 flex flex-col justify-between text-[#f5efeb]/40 transition-colors hover:border-[#d6be8c]/25"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-[8px] text-[#f5efeb]/20 uppercase hidden sm:inline">{day.dayOfWeek}</span>
                        <span className="text-xs sm:text-sm font-serif text-[#f5efeb]/60 ml-auto">{day.dateNumber}</span>
                      </div>
                      <div className="text-[9px] text-[#f5efeb]/20 hidden sm:block">Perawatan Rutin</div>
                    </div>
                  );
                }

                // Special Slot Day (Release Day or Administrative Day)
                return (
                  <motion.button
                    key={day.dateStr}
                    type="button"
                    onClick={() => {
                      if (slot && !isClosed) {
                        setSelectedSlotId(slot.id);
                      }
                    }}
                    whileHover={slot && !isClosed ? { y: -3 } : undefined}
                    whileTap={slot && !isClosed ? { scale: 0.97 } : undefined}
                    disabled={!slot || isClosed}
                    className={`relative min-h-[85px] sm:min-h-[115px] p-2 sm:p-3 rounded-xl sm:rounded-2xl border flex flex-col justify-between text-left transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "bg-[#16271c] border-[#b39257] shadow-[0_0_25px_rgba(179,146,87,0.3)] ring-2 ring-[#b39257]"
                        : isRelease && isAvailable
                        ? "bg-[#0b1d14] border-[#38bdf8]/40 hover:border-[#38bdf8] shadow-md"
                        : isRelease
                        ? "bg-[#132218] border-[#b39257]/40 hover:border-[#b39257] shadow-md"
                        : "bg-[#08110b] border-[#d6be8c]/20 hover:border-[#d6be8c]/40"
                    } ${isClosed ? "opacity-35 cursor-not-allowed" : ""}`}
                  >
                    {/* Top Row: Week Badge & Date */}
                    <div className="flex items-center justify-between w-full">
                      {day.weekLabel ? (
                        <span className="text-[8px] sm:text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-[#b39257] text-[#08110b]">
                          {day.weekLabel}
                        </span>
                      ) : (
                        <span className="text-[8px] text-[#f5efeb]/40">{day.dayOfWeek}</span>
                      )}
                      <span
                        className={`text-sm sm:text-base font-serif font-bold ${
                          isSelected
                            ? "text-[#d6be8c]"
                            : isRelease
                            ? "text-[#f5efeb]"
                            : "text-[#f5efeb]/60"
                        }`}
                      >
                        {day.dateNumber}
                      </span>
                    </div>

                    {/* Bottom Status / Quota Info */}
                    <div className="mt-2 text-[9px] sm:text-[10px] space-y-0.5">
                      {isAvailable && (
                        <div>
                          <span className="inline-block text-[8px] sm:text-[9px] text-[#08110b] bg-[#38bdf8] px-1.5 py-0.2 rounded font-bold">
                            RILIS
                          </span>
                          <span className="text-[9px] text-[#38bdf8] block truncate mt-0.5">
                            {slot?.availableSingles} S · {slot?.availablePairs} P
                          </span>
                        </div>
                      )}
                      {isWaitlist && (
                        <div>
                          <span className="inline-block text-[8px] sm:text-[9px] text-[#08110b] bg-[#b39257] px-1.5 py-0.2 rounded font-bold">
                            WAITLIST
                          </span>
                          <span className="text-[9px] text-[#d6be8c] block truncate mt-0.5">
                            Pekan {day.weekLabel}
                          </span>
                        </div>
                      )}
                      {isLimited && (
                        <span className="text-[8px] text-[#f5efeb]/60 block truncate">Pra-Rilis</span>
                      )}
                      {isClosed && (
                        <span className="text-[8px] text-[#f5efeb]/30 block truncate">Tutup</span>
                      )}
                    </div>

                    {/* Bottom active line */}
                    {isSelected && (
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-[#b39257] rounded-b-xl" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* ── Selected Week Expanded Dossier ── */}
        <FadeIn direction="up" delay={0.2} className="mt-8 sm:mt-10">
          <div className="p-6 sm:p-10 rounded-3xl border border-[#d6be8c]/25 bg-[#0d1811] shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSlot.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-[#b39257] font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-[#b39257]" />
                    <span>Detail Manifes Rilis Terpilih</span>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-4">
                    <h3 className="font-serif text-3xl sm:text-4xl text-[#f5efeb] font-light">
                      Rilis {selectedSlot.formattedDate}
                    </h3>
                    <span
                      className={`text-xs font-mono px-3 py-1 rounded-full border ${
                        selectedSlot.status === "available"
                          ? "border-[#38bdf8]/40 bg-[#38bdf8]/10 text-[#38bdf8]"
                          : selectedSlot.status === "waitlist"
                          ? "border-[#b39257]/40 bg-[#b39257]/10 text-[#d6be8c]"
                          : "border-[#d6be8c]/20 bg-[#132218] text-[#f5efeb]/70"
                      }`}
                    >
                      Status: {selectedSlot.status === "available" ? "TERSEDIA UNTUK RESERVASI" : selectedSlot.status === "waitlist" ? "DAFTAR TUNGGU PRIORITAS" : selectedSlot.status === "limited" ? "PRA-RILIS" : "TUTUP"}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#f5efeb]/80 font-mono leading-relaxed max-w-xl">
                    {selectedSlot.note}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono text-xs text-[#f5efeb]/70">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                      <span>Alokasi: {selectedSlot.availableSingles} Individu, {selectedSlot.availablePairs} Pasang</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-3.5 h-3.5 text-[#b39257] shrink-0" />
                      <span>Estimasi Serah Terima: 10–14 hari kerja setelah verifikasi</span>
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
                      className="px-8 py-4 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[11px] uppercase tracking-[0.25em] font-semibold transition-all shadow-[0_10px_25px_rgba(179,146,87,0.25)] flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
                    >
                      <span>Mulai Reservasi Rilis Ini</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onJoinWaitlist(selectedSlot)}
                      data-cursor="WAITLIST"
                      className="px-8 py-4 rounded-full border border-[#b39257] hover:bg-[#b39257]/15 text-[#d6be8c] text-[11px] uppercase tracking-[0.25em] font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
                    >
                      <span>Masuk Daftar Tunggu Prioritas</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                  <span className="text-[10px] text-center text-[#f5efeb]/50">
                    Verifikasi KTP & dokumen kepatuhan berlaku
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
