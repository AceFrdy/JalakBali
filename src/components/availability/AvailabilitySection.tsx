import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Shield, CheckCircle2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getWeeklyReleases } from "@/lib/api";
import { AvailabilitySlot, WeeklyRelease } from "@/types";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";

interface AvailabilitySectionProps {
  onSelectSlot: (slot: AvailabilitySlot) => void;
  onJoinWaitlist: (slot: AvailabilitySlot) => void;
}

interface CalendarDay {
  dateNumber: number;
  dateStr: string; // "YYYY-MM-DD"
  isCurrentMonth: boolean;
  dayOfWeek: "SEN" | "SEL" | "RAB" | "KAM" | "JUM" | "SAB" | "MIN";
  weekLabel?: string;
  releaseId?: string;
  slotData?: AvailabilitySlot;
}

const DOW_LABELS: CalendarDay["dayOfWeek"][] = [
  "SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN",
];

/** Format a Date to "YYYY-MM-DD" in local time */
function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** ISO week number — Monday is day 1 */
function isoWeekNumber(d: Date): number {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Build a 5-week (35-day) rolling CalendarDay array.
 * Always starts from the Monday of the CURRENT week — auto-resets every Monday.
 * Weekly release slots are scheduled on Monday (Senin) or matching release dates from backend.
 */
/**
 * Build a proper monthly calendar grid for the given year/month.
 * Pads the start/end with adjacent-month days to fill complete ISO weeks.
 * All 7 columns are Monday-first.
 */
function generateCalendarDays(
  releases: WeeklyRelease[],
  year: number,
  month: number // 0-indexed
): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Monday-based offset of the first day (0 = Mon … 6 = Sun)
  const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  // Total cells to fill complete weeks (35 or 42)
  const totalCells =
    Math.ceil((firstDayOfWeek + lastDay.getDate()) / 7) * 7;

  const releaseByDate = new Map<string, WeeklyRelease>();
  for (const r of releases) {
    if (r.releaseDate) releaseByDate.set(r.releaseDate, r);
  }

  const days: CalendarDay[] = [];

  for (let i = 0; i < totalCells; i++) {
    const d = new Date(year, month, 1 - firstDayOfWeek + i);

    const dateStr = toDateStr(d);
    const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1; // 0=Mon … 6=Sun
    const dow = DOW_LABELS[dayIndex];
    const isMonday = dayIndex === 0;
    const isCurrentMonth = d.getMonth() === month && d.getFullYear() === year;

    let weekLabel: string | undefined;
    let releaseId: string | undefined;
    let slotData: AvailabilitySlot | undefined;

    const wNum = isoWeekNumber(d);
    const yr = d.getFullYear();
    const defaultReleaseId = `release-${yr}-w${wNum}`;

    // Match release by exact date, or on Monday by canonical ID / week string
    const matchedRelease =
      releaseByDate.get(dateStr) ??
      (isMonday
        ? releases.find(
            (r) =>
              r.id === defaultReleaseId ||
              r.externalId === defaultReleaseId ||
              r.week?.toLowerCase() === `w${wNum}` ||
              r.week?.toLowerCase() === `w-${wNum}` ||
              r.week?.toLowerCase() === `${yr}-w${wNum}`
          )
        : undefined);

    if (matchedRelease || isMonday) {
      weekLabel = `W-${wNum}`;
      releaseId = matchedRelease?.id ?? defaultReleaseId;

      if (matchedRelease) {
        const isOpen = matchedRelease.status === "open";
        const isClosed = matchedRelease.status === "closed";
        const hasQuota =
          matchedRelease.availableSingle > 0 || matchedRelease.availablePair > 0;

        slotData = {
          id: matchedRelease.id,
          date: dateStr,
          dayOfWeek: dow,
          formattedDate: d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          time: isOpen ? "Reservasi Terbuka" : "Terjadwal",
          status: isClosed
            ? "closed"
            : isOpen
            ? hasQuota
              ? "available"
              : "full"
            : "waitlist",
          availableSingles: matchedRelease.availableSingle,
          availablePairs: matchedRelease.availablePair,
          note: `Rilis Pekan ${wNum}: ${
            isClosed
              ? "Jadwal ini telah ditutup."
              : isOpen && hasQuota
              ? `Tersedia ${matchedRelease.availableSingle} individu dan ${matchedRelease.availablePair} pasangan.`
              : isOpen
              ? "Kuota habis — daftar tunggu masih tersedia."
              : "Jadwal akan dibuka segera."
          }`,
        };
      } else {
        slotData = {
          id: defaultReleaseId,
          date: dateStr,
          dayOfWeek: dow,
          formattedDate: d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          time: "Terjadwal",
          status: "waitlist",
          availableSingles: 0,
          availablePairs: 0,
          note: `Rilis Pekan ${wNum}: Jadwal alokasi mingguan penangkaran.`,
        };
      }
    }

    days.push({
      dateNumber: d.getDate(),
      dateStr,
      isCurrentMonth,
      dayOfWeek: dow,
      weekLabel,
      releaseId,
      slotData,
    });
  }

  return days;
}

const DAY_NAMES = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];


export function AvailabilitySection({
  onSelectSlot,
  onJoinWaitlist,
}: AvailabilitySectionProps) {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth(); // 0-indexed

  const [monthOffset, setMonthOffset] = useState(0);
  const [releases, setReleases] = useState<WeeklyRelease[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");

  // Compute navigated year + month from offset
  const navDate = new Date(todayYear, todayMonth + monthOffset, 1);
  const navYear = navDate.getFullYear();
  const navMonth = navDate.getMonth();

  // Month label (e.g. "Oktober 2026")
  const monthLabel = navDate
    .toLocaleDateString("id-ID", { month: "long", year: "numeric" })
    .replace(/^\w/, (c) => c.toUpperCase());

  // Derive calendar days for the current nav month
  const calendarDays = useMemo(
    () => generateCalendarDays(releases, navYear, navMonth),
    [releases, navYear, navMonth]
  );

  // Navigation guards: can't go before the current real month; max 12 months ahead
  const canGoPrev = monthOffset > 0;
  const canGoNext = monthOffset < 12;

  // Fetch live releases once on mount
  useEffect(() => {
    getWeeklyReleases()
      .then((liveReleases) => {
        if (liveReleases && liveReleases.length > 0) {
          setReleases(liveReleases);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-select the first non-closed slot in the current month view whenever
  // the month or releases change
  useEffect(() => {
    const firstAvailable = calendarDays.find(
      (d) => d.slotData && d.slotData.status !== "closed" && d.isCurrentMonth
    );
    if (firstAvailable?.slotData) {
      setSelectedSlotId(firstAvailable.slotData.id);
    } else {
      setSelectedSlotId("");
    }
  }, [calendarDays]);

  // Find selected slot (or fall back to first visible slot in current month)
  const selectedSlot =
    calendarDays.find((d) => d.slotData?.id === selectedSlotId)?.slotData ||
    calendarDays.find((d) => d.slotData && d.isCurrentMonth)?.slotData;


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
                  Jadwal Rilis Mingguan · {monthLabel}
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
              Jadwal alokasi dirilis setiap hari Senin. Klik tanggal rilis pada kalender untuk memeriksa ketersediaan spesimen dan memulai alokasi.
            </p>
          </FadeIn>
        </div>

        {/* ── Calendar Container ── */}
        <FadeIn direction="up" delay={0.1}>
          <div className="p-6 sm:p-10 rounded-3xl border border-[#d6be8c]/25 bg-[#0d1811] shadow-2xl space-y-6">
            {/* Calendar Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#d6be8c]/15 gap-4 font-mono text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#b39257]/15 border border-[#b39257]/30 flex items-center justify-center text-[#d6be8c] shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#b39257] block">
                    Bulan Alokasi
                  </span>
                  {/* ── Month Navigation ── */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setMonthOffset((o) => o - 1)}
                      disabled={!canGoPrev}
                      aria-label="Bulan sebelumnya"
                      className="w-7 h-7 rounded-lg border border-[#d6be8c]/20 flex items-center justify-center text-[#d6be8c] hover:bg-[#b39257]/15 hover:border-[#b39257]/40 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-base sm:text-xl font-serif text-[#f5efeb] font-light min-w-[10rem] sm:min-w-[14rem] text-center">
                      {monthLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMonthOffset((o) => o + 1)}
                      disabled={!canGoNext}
                      aria-label="Bulan berikutnya"
                      className="w-7 h-7 rounded-lg border border-[#d6be8c]/20 flex items-center justify-center text-[#d6be8c] hover:bg-[#b39257]/15 hover:border-[#b39257]/40 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Legend */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                  <span className="text-[#f5efeb]">Rilis Terbuka (Senin)</span>
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
            <div className="grid grid-cols-7 gap-1 sm:gap-3 text-center font-mono text-[9px] sm:text-xs uppercase tracking-wider text-[#b39257] font-semibold pb-2">
              {DAY_NAMES.map((name, i) => (
                <div
                  key={name}
                  className={`py-1.5 sm:py-2 rounded-lg ${
                    i === 0
                      ? "bg-[#b39257]/15 text-[#d6be8c] font-bold border border-[#b39257]/30"
                      : "text-[#f5efeb]/60"
                  }`}
                >
                  {/* Show 2-char abbreviation on mobile, full on sm+ */}
                  <span className="sm:hidden">{name.slice(0, 2)}</span>
                  <span className="hidden sm:inline">{name}</span>
                </div>
              ))}
            </div>

            {/* ── 7-Column Monthly Calendar Grid (Rows going downwards) ── */}
            <div className="grid grid-cols-7 gap-1 sm:gap-3 font-mono">
              {calendarDays.map((day, idx) => {
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
                      className="min-h-[72px] sm:min-h-[115px] p-1 sm:p-3 rounded-lg sm:rounded-2xl border border-[#d6be8c]/5 bg-[#08110b]/30 opacity-20 flex flex-col justify-between overflow-hidden"
                    >
                      <span className="text-[10px] text-[#f5efeb]/30 text-right">{day.dateNumber}</span>
                    </div>
                  );
                }

                // Regular Non-Release Day
                if (!isRelease && !slot) {
                  return (
                    <div
                      key={day.dateStr}
                      className="min-h-[72px] sm:min-h-[115px] p-1 sm:p-3 rounded-lg sm:rounded-2xl border border-[#d6be8c]/10 bg-[#08110b]/50 flex flex-col justify-between text-[#f5efeb]/40 transition-colors hover:border-[#d6be8c]/25 overflow-hidden"
                    >
                      <span className="text-[10px] sm:text-xs font-serif text-[#f5efeb]/60 text-right block">{day.dateNumber}</span>
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
                    className={`relative min-h-[72px] sm:min-h-[115px] p-1 sm:p-3 rounded-lg sm:rounded-2xl border flex flex-col justify-between text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                      isSelected
                        ? "bg-[#16271c] border-[#b39257] shadow-[0_0_25px_rgba(179,146,87,0.3)] ring-1 sm:ring-2 ring-[#b39257]"
                        : isRelease && isAvailable
                        ? "bg-[#0b1d14] border-[#38bdf8]/40 hover:border-[#38bdf8] shadow-md"
                        : isRelease
                        ? "bg-[#132218] border-[#b39257]/40 hover:border-[#b39257] shadow-md"
                        : "bg-[#08110b] border-[#d6be8c]/20 hover:border-[#d6be8c]/40"
                    } ${isClosed ? "opacity-35 cursor-not-allowed" : ""}`}
                  >
                    {/* Top Row: Week Badge & Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-0.5">
                      {day.weekLabel ? (
                        <span className="text-[7px] sm:text-[9px] uppercase px-1 py-0.5 rounded font-bold bg-[#b39257] text-[#08110b] self-start leading-tight">
                          {/* On mobile show just week number, sm+ show full W-XX */}
                          <span className="sm:hidden">{day.weekLabel.replace("W-", "W")}</span>
                          <span className="hidden sm:inline">{day.weekLabel}</span>
                        </span>
                      ) : (
                        <span className="text-[7px] sm:text-[8px] text-[#f5efeb]/40 hidden sm:inline">{day.dayOfWeek}</span>
                      )}
                      <span
                        className={`text-sm sm:text-base font-serif font-bold self-end sm:self-auto ${
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
                    <div className="mt-1 space-y-0.5 overflow-hidden">
                      {isAvailable && (
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="inline-block text-[7px] sm:text-[9px] text-[#08110b] bg-[#38bdf8] px-1 py-0.5 rounded font-bold leading-tight">
                            RILIS
                          </span>
                          {/* Hide quota text on mobile to save space */}
                          <span className="text-[8px] text-[#38bdf8] hidden sm:block truncate">
                            {slot?.availableSingles} S · {slot?.availablePairs} P
                          </span>
                        </div>
                      )}
                      {isWaitlist && (
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="inline-block text-[7px] sm:text-[9px] text-[#08110b] bg-[#b39257] px-1 py-0.5 rounded font-bold leading-tight">
                            <span className="sm:hidden">W/L</span>
                            <span className="hidden sm:inline">WAITLIST</span>
                          </span>
                          <span className="text-[8px] text-[#d6be8c] hidden sm:block truncate">
                            Pekan {day.weekLabel}
                          </span>
                        </div>
                      )}
                      {isLimited && (
                        <span className="text-[7px] sm:text-[8px] text-[#f5efeb]/60 block truncate">
                          <span className="sm:hidden">Pre</span>
                          <span className="hidden sm:inline">Pra-Rilis</span>
                        </span>
                      )}
                      {isClosed && (
                        <span className="text-[7px] sm:text-[8px] text-[#f5efeb]/30 block truncate">Tutup</span>
                      )}
                    </div>

                    {/* Bottom active line */}
                    {isSelected && (
                      <div className="absolute inset-x-0 bottom-0 h-0.5 sm:h-1 bg-[#b39257] rounded-b-lg sm:rounded-b-xl" />
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
              {selectedSlot ? (
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
              ) : null}
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
