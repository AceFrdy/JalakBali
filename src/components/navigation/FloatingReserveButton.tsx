import { useState, useEffect } from "react";
import { Mail, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CURRENT_RELEASE } from "@/data/weeklyReleases";
import { getWeeklyReleases } from "@/lib/api";
import { WeeklyRelease } from "@/types";
import { redirectToWhatsApp } from "@/lib/whatsapp";

function CustomerServicePopover({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const isWhatsAppMockMode = process.env.NODE_ENV !== "production";
  const canContactWhatsApp = Boolean(whatsappNumber) || isWhatsAppMockMode;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="floating-customer-service-popover"
          role="dialog"
          aria-label="Pilihan Customer Service"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.16 }}
          className="absolute bottom-full right-0 z-[60] mb-3 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-[#d6be8c]/25 bg-[#0d1811] p-4 font-mono shadow-2xl"
        >
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#b39257]">
                Jalak Bali
              </span>
              <h2 className="mt-1 font-serif text-xl font-light text-[#f5efeb]">
                Customer Service
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup pilihan kontak"
              className="rounded-full p-1.5 text-[#f5efeb]/60 transition-colors hover:bg-[#f5efeb]/5 hover:text-[#d6be8c]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            <a
              href="mailto:registrar@jalakbali.breeding?subject=Informasi%20Jalak%20Bali"
              className="flex items-center gap-3 rounded-lg border border-[#d6be8c]/20 bg-[#08110b] p-3 text-[#f5efeb] transition-colors hover:border-[#b39257]"
            >
              <Mail className="h-4 w-4 shrink-0 text-[#d6be8c]" />
              <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-wider">Email</span>
                <span className="mt-1 block break-all text-[11px] text-[#f5efeb]/60">
                  registrar@jalakbali.breeding
                </span>
              </span>
            </a>

            {canContactWhatsApp ? (
              <button
                type="button"
                onClick={() => {
                  redirectToWhatsApp(
                    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
                    "Halo, saya ingin menghubungi Customer Service Jalak Bali."
                  );
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-lg border border-[#d6be8c]/20 bg-[#08110b] p-3 text-left text-[#f5efeb] transition-colors hover:border-[#b39257]"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-[#d6be8c]" />
                <span>
                  <span className="block text-[10px] uppercase tracking-wider">WhatsApp</span>
                  <span className="mt-1 block text-[11px] text-[#f5efeb]/60">
                    {isWhatsAppMockMode
                      ? whatsappNumber
                        ? `Mode uji · +${whatsappNumber}`
                        : "Mode uji · tujuan simulasi"
                      : `+${whatsappNumber}`}
                  </span>
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-[#d6be8c]/10 bg-[#08110b]/60 p-3 text-[#f5efeb]/45">
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>
                  <span className="block text-[10px] uppercase tracking-wider">WhatsApp</span>
                  <span className="mt-1 block text-[11px]">Nomor belum dikonfigurasi</span>
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FloatingReserveButton() {
  const [visible, setVisible] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [activeRelease, setActiveRelease] = useState<WeeklyRelease>(CURRENT_RELEASE);

  useEffect(() => {
    getWeeklyReleases()
      .then((releases) => {
        if (releases && releases.length > 0) {
          const open = releases.find((r) => r.status === "open") || releases[0];
          setActiveRelease(open);
        }
      })
      .catch(() => {});
  }, []);

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

  useEffect(() => {
    if (!contactOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Element &&
        !event.target.closest("[data-customer-service-root]")
      ) {
        setContactOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setContactOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [contactOpen]);

  const releaseDateLabel = activeRelease.formattedDate
    ? activeRelease.formattedDate.replace(/\s\d{4}$/, "")
    : "03 Okt";

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop floating Customer Service CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="hidden md:block fixed bottom-8 right-8 z-40"
          >
            <div className="relative" data-customer-service-root>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setContactOpen((open) => !open)}
                data-cursor="CONTACT"
                aria-label="Hubungi Customer Service"
                aria-haspopup="dialog"
                aria-expanded={contactOpen}
                aria-controls="floating-customer-service-popover"
                className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-[#b39257] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#08110b] shadow-md transition-all hover:bg-[#d6be8c]"
              >
                <span>Customer Service</span>
                <MessageCircle className="h-3.5 w-3.5" />
              </motion.button>
              <CustomerServicePopover
                isOpen={contactOpen}
                onClose={() => setContactOpen(false)}
              />
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
                  Rilis Berikutnya: {releaseDateLabel}
                </span>
                <span className="text-[11px] text-[#f5efeb]/80">
                  {activeRelease.availableSingle} Individu · {activeRelease.availablePair} Pasang Tersedia
                </span>
              </div>
              <div className="relative shrink-0" data-customer-service-root>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setContactOpen((open) => !open)}
                  aria-label="Hubungi Customer Service"
                  aria-haspopup="dialog"
                  aria-expanded={contactOpen}
                  aria-controls="floating-customer-service-popover"
                  className="rounded-full bg-[#b39257] px-4 py-2.5 text-[#08110b] text-[9px] uppercase tracking-[0.1em] font-bold flex items-center gap-1.5 shadow-lg cursor-pointer whitespace-nowrap"
                >
                  <span>Customer Service</span>
                  <MessageCircle className="h-3.5 w-3.5" />
                </motion.button>
                <CustomerServicePopover
                  isOpen={contactOpen}
                  onClose={() => setContactOpen(false)}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
