"use client";

import { useState } from "react";
import { X, CheckCircle2, Shield, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createWaitlistEntry } from "@/lib/reservations";
import { WaitingListEntry } from "@/types";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferredType?: "individual" | "pair" | "any";
  preferredRelease?: string;
}

export function WaitlistModal({
  isOpen,
  onClose,
  preferredType = "pair",
  preferredRelease = "October 2026",
}: WaitlistModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"individual" | "pair" | "any">(preferredType);
  const [birdCount, setBirdCount] = useState<number>(2);
  const [message, setMessage] = useState("");
  const [submittedEntry, setSubmittedEntry] = useState<WaitingListEntry | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert("Mohon masukkan nama lengkap dan email.");
      return;
    }

    const entry = await createWaitlistEntry({
      fullName,
      email,
      phone,
      preferredRelease,
      preferredType: type,
      birdCount,
      optionalMessage: message,
    });
    setSubmittedEntry(entry);
  };

  const handleReset = () => {
    setSubmittedEntry(null);
    onClose();
  };

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
              onClick={handleReset}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#08110b] text-[#f5efeb] hover:text-[#b39257] border border-[#d6be8c]/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!submittedEntry ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 text-[9px] uppercase tracking-[0.3em] text-[#b39257] mb-2">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Daftar Tunggu Unggas Prioritas</span>
                  </div>
                  <h3 className="font-serif text-3xl text-[#f5efeb] font-light">
                    Bergabung Daftar Tunggu
                  </h3>
                  <p className="text-xs text-[#f5efeb]/70 mt-1 font-sans">
                    Ketika alokasi tersedia atau kohort mendatang dibuka, penjaga dalam daftar tunggu akan dihubungi secara berurutan.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase text-[#b39257] mb-1">
                      Nama Lengkap Sesuai KTP *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="cth. Arya Daniswara"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#08110b] border border-[#d6be8c]/20 focus:border-[#b39257] text-[#f5efeb] text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-[#b39257] mb-1">
                        Alamat Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="arya@domain.test"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#08110b] border border-[#d6be8c]/20 focus:border-[#b39257] text-[#f5efeb] text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#b39257] mb-1">
                        Nomor Telepon / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+62 811..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#08110b] border border-[#d6be8c]/20 focus:border-[#b39257] text-[#f5efeb] text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-[#b39257] mb-1">
                        Alokasi Pilihan
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#08110b] border border-[#d6be8c]/20 focus:border-[#b39257] text-[#f5efeb] text-xs focus:outline-none"
                      >
                        <option value="pair">Pasangan Penangkaran (2 Burung)</option>
                        <option value="individual">Individu (1 Burung)</option>
                        <option value="any">Apa Saja yang Tersedia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-[#b39257] mb-1">
                        Kohort Pilihan
                      </label>
                      <input
                        type="text"
                        value={preferredRelease}
                        readOnly
                        className="w-full px-3 py-2 rounded-xl bg-[#08110b]/60 border border-[#d6be8c]/10 text-[#f5efeb]/70 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#b39257] mb-1">
                      Detail Aviari / Pesan Tambahan
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Catatan singkat mengenai dimensi aviari atau pengalaman pemeliharaan..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#08110b] border border-[#d6be8c]/20 focus:border-[#b39257] text-[#f5efeb] text-xs focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Bergabung Daftar Tunggu</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#b39257]/15 border border-[#b39257] mx-auto flex items-center justify-center text-[#b39257]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-2xl text-[#f5efeb]">
                  Anda Telah Terdaftar di Daftar Tunggu
                </h4>
                <p className="text-xs text-[#f5efeb]/70 font-sans">
                  Kami telah mencatat permohonan Anda. Posisi antrean:{" "}
                  <strong className="text-[#38bdf8] font-mono">
                    #{submittedEntry.queuePosition}
                  </strong>
                </p>
                <div className="p-4 rounded-xl bg-[#08110b] border border-[#d6be8c]/15 text-xs text-left space-y-1">
                  <div className="text-[#b39257] font-bold">Ref Registrasi: {submittedEntry.id}</div>
                  <div className="text-[#f5efeb]/70">Kontak: {submittedEntry.email}</div>
                  <div className="text-[#f5efeb]/70">Tipe: {submittedEntry.preferredType === "pair" ? "Pasangan" : submittedEntry.preferredType === "individual" ? "Individu" : "Apa Saja"}</div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full bg-[#b39257] text-[#08110b] text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
