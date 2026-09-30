"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Download,
  Calendar,
  Truck,
  Mail,
  Phone,
  FileCheck2,
} from "lucide-react";
import { motion } from "framer-motion";
import { getReservationById } from "@/lib/reservations";
import { Reservation } from "@/types";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  const resolvedParams = use(params);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    getReservationById(resolvedParams.id).then((res) => {
      setReservation(res);
    });
  }, [resolvedParams.id]);

  const handleDownload = () => {
    if (!reservation) return;
    const summaryText = `
========================================
JALAK BALI — RINGKASAN RESMI RESERVASI
========================================
ID Reservasi: ${reservation.bookingCode}
Tipe: ${reservation.type === "individual" ? "INDIVIDU" : "PASANG"}
Kohort Rilis: ${reservation.releaseDate}
Nama Patron: ${reservation.customer.fullName}
Email: ${reservation.customer.email}
Telepon: ${reservation.customer.phone}
Alamat Aviari: ${reservation.customer.address}, ${reservation.customer.city}
Metode Serah Terima: ${reservation.customer.preferredHandoverMethod === "facility_handover" ? "Serah Terima Fasilitas" : "Kurir Satwa Liar Bersertifikat"}

STATUS & KEUANGAN:
Status Verifikasi: ${reservation.verificationStatus === "verified" ? "TERVERIFIKASI" : "SEDANG DITINJAU"}
Status Pembayaran: ${reservation.paymentStatus === "paid" ? "LUNAS" : "MENUNGGU"}
Nilai Total: Rp ${reservation.price.toLocaleString("id-ID")}
Deposit Dibayar/Menunggu: Rp ${reservation.depositAmount.toLocaleString("id-ID")}
Sisa saat Serah Terima: Rp ${reservation.remainingAmount.toLocaleString("id-ID")}

ESTIMASI SERAH TERIMA:
Jadwal Target: ${reservation.handoverDateEstimate}

CATATAN LEGAL:
Tunduk pada regulasi yang berlaku. Dokumentasi hukum dan catatan gelang cincin logam tertutup resmi diberikan saat transfer terverifikasi.
========================================
    `.trim();

    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Reservasi_${reservation.bookingCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#060e08] text-[#f5efeb] font-mono selection:bg-[#c5a880]/30 selection:text-[#fbf9f5]">
      <Navbar onOpenReservation={() => {}} />

      <div className="pt-32 pb-24 max-w-4xl mx-auto site-gutter">
        {/* ── Confirmation Dossier Plate ── */}
        <div className="p-8 sm:p-12 md:p-16 rounded-3xl border border-[#d6be8c]/30 bg-[#0d1811] shadow-[0_30px_90px_rgba(0,0,0,0.85)] space-y-10">
          {/* Top Checkmark Header */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="w-16 h-16 rounded-full bg-[#b39257]/15 border border-[#b39257] mx-auto flex items-center justify-center text-[#b39257]"
            >
              <CheckCircle2 className="w-8 h-8" />
            </motion.div>

            <span className="text-[10px] uppercase tracking-[0.3em] text-[#b39257] block">
              Alokasi Pengelolaan Resmi
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#f5efeb] font-light">
              Reservasi Dikonfirmasi
            </h1>
            <p className="text-xs text-[#f5efeb]/70 font-sans max-w-md mx-auto">
              Reservasi penangkaran Anda telah dicatat ke dalam registri studbook kami. Petugas kepatuhan kami akan mengoordinasikan izin transfer akhir.
            </p>
          </div>

          {/* Core Voucher Card */}
          <div className="p-6 rounded-2xl bg-[#08110b] border border-[#d6be8c]/25 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#d6be8c]/15 gap-2">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#b39257]">KODE RESERVASI</span>
                <span className="block font-mono text-xl font-bold text-[#f5efeb]">
                  {reservation ? reservation.bookingCode : resolvedParams.id}
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#38bdf8] border border-[#38bdf8]/40 px-3 py-1 rounded bg-[#38bdf8]/10 self-start sm:self-auto font-bold">
                {reservation?.verificationStatus === "verified" ? "TERVERIFIKASI" : "SEDANG DITINJAU"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-[#f5efeb]/50 uppercase">Tipe / Kohort</span>
                <div className="text-sm text-[#f5efeb] capitalize">
                  Alokasi {reservation?.type === "individual" ? "Individu" : "Pasang"} · {reservation?.releaseDate || "03 Okt 2026"}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#f5efeb]/50 uppercase">Patron Terdaftar</span>
                <div className="text-sm text-[#f5efeb]">
                  {reservation?.customer.fullName || "Pengelola Terdaftar"}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#f5efeb]/50 uppercase">Status Pembayaran</span>
                <div className="text-sm text-[#d6be8c] font-semibold uppercase">
                  {reservation?.paymentStatus === "paid" ? "LUNAS" : "MENUNGGU"} (Deposit)
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#f5efeb]/50 uppercase">Target Serah Terima</span>
                <div className="text-sm text-[#38bdf8]">
                  {reservation?.handoverDateEstimate || "10–14 Oktober 2026"}
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps Checklist */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-[#f5efeb] font-light">
              Langkah Berikutnya untuk Serah Terima
            </h3>

            <div className="space-y-3 text-xs text-[#f5efeb]/80">
              <div className="p-3.5 rounded-xl bg-[#08110b] border border-[#d6be8c]/15 flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-[#b39257]/20 border border-[#b39257] flex items-center justify-center text-[10px] text-[#b39257] flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <span className="font-bold text-[#f5efeb] block">Tinjauan Dokumen Registrar</span>
                  <span className="text-[11px] text-[#f5efeb]/60 font-sans">
                    Tim kepatuhan kami akan memeriksa KTP/Paspor yang diunggah dan dokumentasi fasilitas aviari Anda dalam 24 jam kerja.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08110b] border border-[#d6be8c]/15 flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-[#b39257]/20 border border-[#b39257] flex items-center justify-center text-[10px] text-[#b39257] flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <span className="font-bold text-[#f5efeb] block">Pemeriksaan Kesehatan Dokter Hewan Unggas Pra-Transit</span>
                  <span className="text-[11px] text-[#f5efeb]/60 font-sans">
                    48 jam sebelum transit, dokter hewan akan menerbitkan sertifikat kesehatan akhir dan melakukan pembacaan microchip resmi.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08110b] border border-[#d6be8c]/15 flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-[#b39257]/20 border border-[#b39257] flex items-center justify-center text-[10px] text-[#b39257] flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <span className="font-bold text-[#f5efeb] block">Jadwal Serah Terima & Penyerahan Berkas Dokumen</span>
                  <span className="text-[11px] text-[#f5efeb]/60 font-sans">
                    Pelunasan sisa pembayaran dilakukan pada saat serah terima fisik bersamaan dengan sertifikasi cincin tertutup asli.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="pt-4 border-t border-[#d6be8c]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-xs uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Ringkasan Reservasi</span>
            </button>

          </div>
        </div>
      </div>

      <Footer onOpenReservation={() => {}} />
    </main>
  );
}
