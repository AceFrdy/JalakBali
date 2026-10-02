"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { lookupReservation } from "@/lib/api";
import Link from "next/link";

export default function ReservationLookupPage() {
  const router = useRouter();
  const [bookingCode, setBookingCode] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!bookingCode.trim() || !identifier.trim()) {
      setError("Mohon lengkapi Kode Pengajuan dan No. Telepon/Email.");
      return;
    }

    setLoading(true);
    try {
      const result = await lookupReservation(bookingCode.trim(), identifier.trim());
      router.push(result.redirectUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Pengajuan tidak ditemukan. Periksa kembali data Anda."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070d09] flex flex-col">
      {/* Simple header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#08110b]/92 backdrop-blur-md border-b border-[#d6be8c]/15 py-3">
        <div className="max-w-[1760px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex shrink-0 flex-col group focus:outline-none">
            <span className="font-serif text-2xl md:text-3xl tracking-[0.2em] uppercase text-[#f5efeb] font-light transition-colors group-hover:text-[#d6be8c]">
              Jalak Bali
            </span>
          </Link>
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f5efeb]/60 hover:text-[#d6be8c] transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#b39257]/15 border border-[#b39257]/30 flex items-center justify-center">
              <Search className="w-7 h-7 text-[#d6be8c]" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl md:text-3xl text-[#f5efeb] font-light mb-2">
              Cek Status Reservasi
            </h1>
            <p className="text-xs text-[#f5efeb]/60 font-sans max-w-sm mx-auto leading-relaxed">
              Masukkan Kode Pengajuan dan Nomor Telepon atau Email yang digunakan
              saat reservasi untuk mengakses halaman konfirmasi Anda.
            </p>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-2xl border border-[#d6be8c]/20 bg-[#08110b] p-6 space-y-4">
              {/* Booking Code */}
              <div>
                <label
                  htmlFor="bookingCode"
                  className="block text-[9px] uppercase tracking-[0.2em] text-[#b39257] mb-2 font-mono"
                >
                  Kode Pengajuan
                </label>
                <input
                  id="bookingCode"
                  type="text"
                  placeholder="Contoh: JB-2026-XXXXX"
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-[#d6be8c]/20 bg-[#060e08] px-4 py-3 text-sm text-[#f5efeb] font-mono tracking-wider placeholder:text-[#f5efeb]/25 focus:outline-none focus:border-[#b39257]/60 focus:ring-1 focus:ring-[#b39257]/30 transition-all"
                  autoComplete="off"
                />
              </div>

              {/* Phone / Email */}
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-[9px] uppercase tracking-[0.2em] text-[#b39257] mb-2 font-mono"
                >
                  No. Telepon / Email
                </label>
                <input
                  id="identifier"
                  type="text"
                  placeholder="Contoh: 0812xxxxxxx atau email@domain.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-xl border border-[#d6be8c]/20 bg-[#060e08] px-4 py-3 text-sm text-[#f5efeb] placeholder:text-[#f5efeb]/25 focus:outline-none focus:border-[#b39257]/60 focus:ring-1 focus:ring-[#b39257]/30 transition-all"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 rounded-full border border-[#b39257]/70 bg-[#b39257]/15 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#f5efeb] transition-all duration-300 hover:bg-[#b39257] hover:text-[#08110b] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Mencari...</span>
                </>
              ) : (
                <>
                  <span>Cek Status</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Help text */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-[10px] text-[#f5efeb]/40 font-sans">
              Kode Pengajuan dikirimkan melalui WhatsApp setelah reservasi berhasil.
            </p>
            <p className="text-[10px] text-[#f5efeb]/40 font-sans">
              Butuh bantuan?{" "}
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6282182579496"}?text=${encodeURIComponent("Hallo, saya butuh bantuan untuk mengecek status reservasi saya.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d6be8c] hover:underline"
              >
                Hubungi kami via WhatsApp
              </a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
