"use client";

import { Mail, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { redirectToWhatsApp } from "@/lib/whatsapp";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferredType?: "individual" | "pair" | "any";
  preferredRelease?: string;
}

export function WaitlistModal({
  isOpen,
  onClose,
}: WaitlistModalProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const isWhatsAppMockMode = process.env.NODE_ENV !== "production";
  const canContactWhatsApp = Boolean(whatsappNumber) || isWhatsAppMockMode;
  const whatsappMessage = "Halo, saya ingin bertanya tentang Jalak Bali.";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#060e08]/92 backdrop-blur-2xl flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-lg bg-[#0d1811] border border-[#d6be8c]/30 rounded-3xl p-8 sm:p-10 shadow-2xl font-mono"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#08110b] text-[#f5efeb] hover:text-[#b39257] border border-[#d6be8c]/20 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 text-[9px] uppercase tracking-[0.3em] text-[#b39257] mb-2">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Tim Jalak Bali</span>
                </div>
                <h3 className="font-serif text-3xl text-[#f5efeb] font-light">
                  Hubungi Kami
                </h3>
                <p className="text-xs text-[#f5efeb]/70 mt-2 font-sans">
                  Silakan pilih cara yang paling nyaman untuk menghubungi tim kami.
                </p>
              </div>

              <div className="space-y-3">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="mailto:registrar@jalakbali.breeding?subject=Informasi%20Jalak%20Bali"
                  className="flex items-center gap-4 w-full rounded-xl border border-[#d6be8c]/25 bg-[#08110b] p-4 text-[#f5efeb] transition-colors hover:border-[#b39257]"
                >
                  <Mail className="w-5 h-5 shrink-0 text-[#b39257]" />
                  <span className="min-w-0 text-left">
                    <span className="block text-xs uppercase tracking-wider">Email</span>
                    <span className="block mt-1 text-xs text-[#f5efeb]/60 break-all">
                      registrar@jalakbali.breeding
                    </span>
                  </span>
                </motion.a>

                {canContactWhatsApp ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() =>
                      redirectToWhatsApp(
                        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
                        whatsappMessage
                      )
                    }
                    className="flex items-center gap-4 w-full rounded-xl border border-[#d6be8c]/25 bg-[#08110b] p-4 text-[#f5efeb] transition-colors hover:border-[#b39257]"
                  >
                    <MessageCircle className="w-5 h-5 shrink-0 text-[#b39257]" />
                    <span className="min-w-0 text-left">
                      <span className="block text-xs uppercase tracking-wider">WhatsApp</span>
                      <span className="block mt-1 text-xs text-[#f5efeb]/60">
                        {isWhatsAppMockMode
                          ? whatsappNumber
                            ? `Mode uji · +${whatsappNumber}`
                            : "Mode uji · tujuan simulasi"
                          : `+${whatsappNumber}`}
                      </span>
                    </span>
                  </motion.button>
                ) : (
                  <div
                    aria-disabled="true"
                    className="flex items-center gap-4 w-full rounded-xl border border-[#d6be8c]/10 bg-[#08110b]/60 p-4 text-[#f5efeb]/45"
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" />
                    <span className="min-w-0 text-left">
                      <span className="block text-xs uppercase tracking-wider">WhatsApp</span>
                      <span className="block mt-1 text-xs">Nomor WhatsApp belum dikonfigurasi</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
