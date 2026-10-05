"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Play,
  X,
  CirclePlay,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EDITORIAL_REVIEWS, SOCIAL_PROOF_STATS } from "@/data/reviews";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { getApprovedReviews } from "@/lib/api";
import type { Review } from "@/types";

/* ─── YouTube helpers ──────────────────────────────────────────────── */

/** Extract YouTube video ID from any YouTube URL (client-side fallback). */
function extractYoutubeId(url?: string | null): string | null {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /\/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

/** Returns true if the review has a playable YouTube video. */
function reviewHasVideo(review: Review): boolean {
  if (review.hasVideo !== undefined) return review.hasVideo;
  return !!(review.youtubeEmbedUrl || extractYoutubeId(review.videoUrl));
}

/** Build the embed URL from review data. */
function getEmbedUrl(review: Review): string | null {
  if (review.youtubeEmbedUrl) return review.youtubeEmbedUrl;
  const id = extractYoutubeId(review.videoUrl);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
}

/** Build the thumbnail URL — YouTube maxresdefault or custom. */
function getThumbnail(review: Review): string | null {
  if (review.videoThumbnail) return review.videoThumbnail;
  const id =
    extractYoutubeId(review.youtubeEmbedUrl) ||
    extractYoutubeId(review.videoUrl);
  if (id) return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  return null;
}

/* ─── YouTube Modal ────────────────────────────────────────────────── */
function YoutubeModal({
  review,
  onClose,
}: {
  review: Review;
  onClose: () => void;
}) {
  const embedUrl = getEmbedUrl(review);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!embedUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-black shadow-2xl border border-[#d6be8c]/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/70 text-[#f5efeb] hover:bg-black/90 transition-colors cursor-pointer"
          aria-label="Tutup video"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 16:9 YouTube iframe */}
        <div className="relative w-full aspect-video">
          <iframe
            src={embedUrl}
            title={`Video testimoni — ${review.patronName}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>

        {/* Patron info bar */}
        <div className="px-5 py-3 bg-[#0d1811] flex items-center justify-between gap-4">
          <div>
            <div className="font-serif text-sm text-[#d6be8c]">
              {review.patronName}
            </div>
            {review.patronTitle && (
              <div className="text-[10px] text-[#f5efeb]/50 font-mono">
                {review.patronTitle} · {review.location}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#f5efeb]/40 font-mono">
            <CirclePlay className="w-3.5 h-3.5 text-red-500" />
            <span>YouTube</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Video Thumbnail Preview ──────────────────────────────────────── */
function VideoPreview({
  review,
  onOpen,
}: {
  review: Review;
  onOpen: () => void;
}) {
  const thumbnail = getThumbnail(review);

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onOpen}
      className="relative w-full rounded-2xl overflow-hidden border border-[#d6be8c]/20 bg-[#0d1811] aspect-video group cursor-pointer"
      aria-label={`Putar video testimoni ${review.patronName}`}
    >
      {/* YouTube thumbnail */}
      {thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt={`Thumbnail testimoni ${review.patronName}`}
          className="w-full h-full object-cover"
          // YouTube maxresdefault sometimes returns a 120×90 default image;
          // fall back to hqdefault if the image load fails
          onError={(e) => {
            const id =
              extractYoutubeId(review.youtubeEmbedUrl) ||
              extractYoutubeId(review.videoUrl);
            if (id) {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
            }
          }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#0d1811] to-[#1a2b1e] flex items-center justify-center">
          <CirclePlay className="w-10 h-10 text-[#d6be8c]/30" />
        </div>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="p-4 rounded-full bg-black/60 border border-[#d6be8c]/50 backdrop-blur-sm group-hover:border-[#b39257] group-hover:bg-black/70 transition-all">
          <Play className="w-8 h-8 text-[#d6be8c] fill-[#d6be8c]" />
        </div>
      </div>

      {/* YouTube badge */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/65 backdrop-blur-sm px-2.5 py-1 rounded-full">
        <CirclePlay className="w-3 h-3 text-red-500" />
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#f5efeb]/80 font-mono">
          Video Testimoni
        </span>
      </div>
    </motion.button>
  );
}

/* ─── Main Review Section ──────────────────────────────────────────── */
export function ReviewSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(EDITORIAL_REVIEWS);

  // Fetch approved reviews from backend
  useEffect(() => {
    getApprovedReviews()
      .then((data) => {
        if (data.length > 0) setReviews(data);
      })
      .catch(() => {
        // silently fall back to static editorial reviews
      });
  }, []);

  const prevReview = useCallback(() => {
    setCurrentIdx((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  }, [reviews.length]);

  const nextReview = useCallback(() => {
    setCurrentIdx((prev) =>
      prev === reviews.length - 1 ? 0 : prev + 1
    );
  }, [reviews.length]);

  // Reset index when list changes
  useEffect(() => {
    setCurrentIdx(0);
  }, [reviews]);

  const review = reviews[currentIdx] ?? reviews[0];
  const hasVideo = review ? reviewHasVideo(review) : false;
  const count = reviews.length;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      {/* ── YouTube Modal ── */}
      <AnimatePresence>
        {videoOpen && review && hasVideo && (
          <YoutubeModal
            review={review}
            onClose={() => setVideoOpen(false)}
          />
        )}
      </AnimatePresence>

      <section
        id="reviews"
        className="relative py-28 md:py-36 bg-[#08110b] text-[#f5efeb] border-t border-[#d6be8c]/15"
      >
        <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
          {/* ── Section Header ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-[#d6be8c]/15 pb-10">
            <div>
              <FadeIn direction="up">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="h-[1px] w-6 bg-[#b39257]" />
                  <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                    Buku Tamu Teluk Brumbun
                  </span>
                </div>
              </FadeIn>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight">
                <TextReveal text="Review" as="span" />{" "}
                <span className="italic font-serif text-[#d6be8c]">
                  Pelanggan
                </span>
              </h2>
            </div>

            <div className="flex items-center space-x-4 font-mono text-xs">
              <span className="text-[#b39257]">
                Entri {pad(currentIdx + 1)} / {pad(count)}
              </span>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={prevReview}
                  className="p-2.5 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] text-[#f5efeb] hover:text-[#b39257] transition-colors cursor-pointer"
                  aria-label="Entri tamu sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={nextReview}
                  className="p-2.5 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] text-[#f5efeb] hover:text-[#b39257] transition-colors cursor-pointer"
                  aria-label="Entri tamu berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* ── Main Card ── */}
          <FadeIn direction="up" delay={0.1}>
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.x > 60) prevReview();
                else if (info.offset.x < -60) nextReview();
              }}
              data-cursor="DRAG"
              className="rounded-3xl border border-[#d6be8c]/25 bg-[#0d1811] shadow-2xl mb-20 relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={`grid ${
                    hasVideo ? "lg:grid-cols-[1fr_420px]" : "grid-cols-1"
                  }`}
                >
                  {/* ── Left: Quote ── */}
                  <div className="p-8 sm:p-14 md:p-16 cursor-grab active:cursor-grabbing select-none">
                    {/* Rating row */}
                    <div className="flex items-center space-x-1.5 mb-8 text-[#b39257] font-mono text-xs">
                      <span>
                        {"★".repeat(Math.min(5, review?.rating ?? 5))}
                      </span>
                      <span className="text-[#f5efeb]/40 ml-2">
                        · Entri Registri {review?.date}
                        {review?.individualRef &&
                          ` (${review.individualRef})`}
                      </span>
                    </div>

                    {/* Quote */}
                    <blockquote className="font-serif text-2xl sm:text-3xl md:text-[2.1rem] font-light text-[#f5efeb] leading-[1.3] tracking-tight mb-12 max-w-3xl">
                      &ldquo;{review?.quote}&rdquo;
                    </blockquote>

                    {/* Patron signoff */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8 border-t border-[#d6be8c]/15">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35, delay: 0.08 }}
                      >
                        <div className="font-serif text-xl text-[#d6be8c]">
                          — {review?.patronName}
                        </div>
                        <div className="text-xs text-[#f5efeb]/60 font-mono mt-1">
                          {review?.patronTitle} · {review?.location}
                        </div>
                      </motion.div>

                      <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] font-mono text-[#b39257] border border-[#b39257]/30 px-3 py-1.5 rounded self-start sm:self-auto">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Pelanggan Penangkaran Terverifikasi</span>
                      </div>
                    </div>
                  </div>

                  {/* ── Right: YouTube preview (desktop only) ── */}
                  {hasVideo && (
                    <div className="hidden lg:flex items-center justify-center p-8 border-l border-[#d6be8c]/10 bg-[#0a150d]">
                      <div className="w-full">
                        <VideoPreview
                          review={review}
                          onOpen={() => setVideoOpen(true)}
                        />
                        <p className="mt-3 text-center text-[10px] text-[#f5efeb]/40 font-mono uppercase tracking-[0.2em]">
                          Klik untuk putar video
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Mobile: button below quote */}
              {hasVideo && (
                <div className="lg:hidden px-8 pb-8">
                  <button
                    onClick={() => setVideoOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#d6be8c]/25 bg-[#0a150d] hover:border-[#b39257] hover:bg-[#0d1811] transition-colors text-[#d6be8c] font-mono text-xs uppercase tracking-widest cursor-pointer"
                  >
                    <CirclePlay className="w-4 h-4 text-red-500" />
                    Tonton Video Testimoni
                  </button>
                </div>
              )}
            </motion.div>
          </FadeIn>

          {/* ── Social Proof Metrics ── */}
          <StaggerChildren
            stagger={0.08}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-[#d6be8c]/15 font-mono"
          >
            {SOCIAL_PROOF_STATS.map((stat, idx) => (
              <StaggerItem key={idx}>
                <div className="space-y-1">
                  <div className="font-serif text-3xl sm:text-4xl text-[#f5efeb] font-light">
                    {stat.value}
                    <span className="text-base text-[#d6be8c] ml-1">
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#b39257]">
                    {stat.label}
                  </div>
                  <p className="text-[11px] text-[#f5efeb]/60 font-light font-sans">
                    {stat.detail}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </>
  );
}
