"use client";

import { use, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Download,
  Upload,
  MessageSquare,
  Check,
  ExternalLink,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  CustomerReservationStatus,
  getCustomerReservationStatus,
  uploadManualPaymentProof,
} from "@/lib/api";
import { buildReservationWhatsAppMessage, redirectToWhatsApp } from "@/lib/whatsapp";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const [reservation, setReservation] = useState<CustomerReservationStatus | null>(null);
  const [loadError, setLoadError] = useState(() =>
    searchParams.get("token") ? "" : "Token akses status reservasi tidak ditemukan."
  );
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [paymentProofMessage, setPaymentProofMessage] = useState("");
  const [showReuploadForm, setShowReuploadForm] = useState(false);

  const paymentProofDoc = reservation?.documents?.find(
    (doc) => doc.document_type === "payment_proof" && doc.status === "uploaded"
  );
  const hasUploadedProof = Boolean(paymentProofDoc);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      return;
    }

    getCustomerReservationStatus(resolvedParams.id, token)
      .then(setReservation)
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : "Status reservasi tidak dapat dimuat.");
      });
  }, [resolvedParams.id, searchParams]);

  const handlePaymentProofUpload = async () => {
    const token = searchParams.get("token");
    if (!token || !paymentProof) return;

    setIsUploadingProof(true);
    setPaymentProofMessage("");
    try {
      const result = await uploadManualPaymentProof(resolvedParams.id, token, paymentProof);
      setReservation((current) => current ? { ...current, ...result } : current);
      setPaymentProof(null);
      setShowReuploadForm(false);
      setPaymentProofMessage("Bukti pembayaran berhasil disimpan dan tercatat di database.");
    } catch (error) {
      setPaymentProofMessage(error instanceof Error ? error.message : "Bukti pembayaran gagal diunggah.");
    } finally {
      setIsUploadingProof(false);
    }
  };

  const handleOpenWhatsApp = () => {
    if (!reservation) return;
    const message = buildReservationWhatsAppMessage({
      bookingCode: reservation.bookingCode,
      customerName: reservation.customerName,
    });
    const ownerPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    redirectToWhatsApp(ownerPhone, message, "_blank");
  };

  const handleDownload = () => {
    if (!reservation) return;
    const summaryText = `
========================================
JALAK BALI — RINGKASAN RESMI RESERVASI
========================================
ID Reservasi: ${reservation.bookingCode}
Tipe: ${reservation.reservationType === "individual" ? "INDIVIDU" : "PASANG"}
Kohort Rilis: ${reservation.weeklyReleaseId}
Nama Patron: ${reservation.customerName}

STATUS & KEUANGAN:
Status Verifikasi Dokumen: ${reservation.documentVerificationStatus === "verified" ? "TERVERIFIKASI" : "SEDANG DITINJAU"}
Status Pembayaran: ${reservation.paymentStatus === "paid" ? "LUNAS" : "MENUNGGU"}
Nilai Total: Rp ${(reservation.price || 0).toLocaleString("id-ID")}
Deposit Dibayar/Menunggu: Rp ${(reservation.depositAmount || 0).toLocaleString("id-ID")}
Sisa saat Serah Terima: Rp ${(reservation.remainingAmount || 0).toLocaleString("id-ID")}

ESTIMASI SERAH TERIMA:
Jadwal Target: Akan diinformasikan setelah verifikasi

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
        {loadError && (
          <div role="alert" className="mb-6 rounded-xl border border-red-300/30 bg-red-300/10 px-4 py-3 text-sm text-red-100">
            {loadError}
          </div>
        )}

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
                {reservation?.documentVerificationStatus === "verified" ? "TERVERIFIKASI" : "SEDANG DITINJAU"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-[#f5efeb]/50 uppercase">Tipe / Kohort</span>
                <div className="text-sm text-[#f5efeb] capitalize">
                  Alokasi {reservation?.reservationType === "individual" ? "Individu" : "Pasang"} · {reservation?.weeklyReleaseId || "Rilis dipilih"}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#f5efeb]/50 uppercase">Patron Terdaftar</span>
                <div className="text-sm text-[#f5efeb]">
                  {reservation?.customerName || "Pengelola Terdaftar"}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#f5efeb]/50 uppercase">Status Pembayaran</span>
                <div className="text-sm text-[#d6be8c] font-semibold uppercase">
                  {reservation?.paymentStatus === "paid"
                    ? "LUNAS PENUH (100%)"
                    : reservation?.paymentStatus === "partially_paid"
                    ? "CICILAN BERJALAN"
                    : reservation?.paymentStatus === "deposit_paid"
                    ? "DEPOSIT LUNAS"
                    : reservation?.paymentStatus === "processing"
                    ? "SEDANG DIPROSES"
                    : "MENUNGGU PEMBAYARAN"}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#f5efeb]/50 uppercase">Target Serah Terima</span>
                <div className="text-sm text-[#38bdf8]">
                  {"Akan diinformasikan setelah verifikasi"}
                </div>
              </div>
            </div>

            {/* Financial Summary & Progress */}
            {(() => {
              const price = reservation?.price || 0;
              const totalPaid = reservation?.totalPaid ?? (reservation?.paymentStatus === "paid" ? price : reservation?.paymentStatus === "deposit_paid" ? (reservation?.depositAmount || 0) : 0);
              const remaining = Math.max(0, price - totalPaid);
              const progressPercent = price > 0 ? Math.min(100, Math.round((totalPaid / price) * 100)) : 0;

              return (
                <div className="pt-3 border-t border-[#d6be8c]/15 space-y-3 font-mono">
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] uppercase text-[#f5efeb]/60">
                      <span>Progres Pembayaran</span>
                      <span className="text-[#d6be8c] font-bold">{progressPercent}% TERBAYAR</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#060e08] border border-[#d6be8c]/20 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#b39257] to-[#d6be8c] rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* 3 Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#060e08] border border-[#d6be8c]/10">
                      <span className="text-[9px] uppercase tracking-wider text-[#f5efeb]/50 block">Nilai Total Kontrak</span>
                      <span className="text-sm font-bold text-[#f5efeb] mt-0.5 block">
                        Rp {price.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#060e08] border border-[#b39257]/30">
                      <span className="text-[9px] uppercase tracking-wider text-[#b39257] block">Total Terbayar</span>
                      <span className="text-sm font-bold text-[#d6be8c] mt-0.5 block">
                        Rp {totalPaid.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#060e08] border border-[#d6be8c]/10">
                      <span className="text-[9px] uppercase tracking-wider text-[#f5efeb]/50 block">Sisa Tagihan</span>
                      <span className="text-sm font-bold text-[#f5efeb] mt-0.5 block">
                        Rp {remaining.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Payment History / Transactions List */}
          {reservation?.transactions && reservation.transactions.length > 0 && (
            <div className="rounded-2xl border border-[#d6be8c]/20 bg-[#08110b] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#d6be8c]/15">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#b39257] font-mono">RIWAYAT PEMBAYARAN & CICILAN</span>
                  <h3 className="font-serif text-xl text-[#f5efeb] font-light mt-0.5">
                    Catatan Transaksi Resmi
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#f5efeb]/60">
                  {reservation.transactions.length} Transaksi
                </span>
              </div>

              <div className="space-y-2.5">
                {reservation.transactions.map((txn, idx) => (
                  <div
                    key={txn.transactionCode || idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#060e08] border border-[#d6be8c]/10 text-xs font-mono gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#b39257] uppercase px-2 py-0.5 rounded bg-[#b39257]/10 border border-[#b39257]/30">
                          {txn.type === "deposit"
                            ? "DEPOSIT"
                            : txn.type === "installment"
                            ? "CICILAN"
                            : txn.type === "settlement"
                            ? "PELUNASAN"
                            : txn.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-[#f5efeb] font-semibold">{txn.transactionCode}</span>
                      </div>
                      <span className="text-[10px] text-[#f5efeb]/50 block">
                        Metode: {txn.paymentMethod === "qris" ? "QRIS" : txn.paymentMethod === "bank_transfer" ? "Transfer Bank" : txn.paymentMethod.toUpperCase()}
                        {txn.createdAt ? ` · ${new Date(txn.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}` : ""}
                      </span>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1">
                      <span className="text-sm font-bold text-[#d6be8c]">
                        Rp {txn.amount.toLocaleString("id-ID")}
                      </span>
                      <span
                        className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold ${
                          txn.status === "paid"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {txn.status === "paid" ? "LUNAS / DITERIMA" : "SEDANG DIPROSES"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {(reservation?.paymentMethod === "bank_transfer" || reservation?.paymentMethod === "qris") && (
            <div className="rounded-2xl border border-[#d6be8c]/20 bg-[#08110b] p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#d6be8c]/15 gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#b39257]">
                    {reservation.paymentMethod === "qris" ? "Bukti Transaksi QRIS" : "Bukti Transfer Bank"}
                  </span>
                  <h3 className="font-serif text-2xl text-[#f5efeb] font-light mt-0.5">
                    {hasUploadedProof ? "Bukti Pembayaran Sudah Diunggah" : "Unggah Bukti Pembayaran"}
                  </h3>
                </div>
                {hasUploadedProof && (
                  <span className="text-[10px] uppercase tracking-widest text-[#38bdf8] border border-[#38bdf8]/40 px-3 py-1 rounded-full bg-[#38bdf8]/10 self-start sm:self-auto font-bold flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                    Tersimpan di Database
                  </span>
                )}
              </div>

              {hasUploadedProof && !showReuploadForm ? (
                <div className="space-y-4 font-mono">
                  {/* File information box */}
                  <div className="p-4 rounded-xl bg-[#132218] border border-[#b39257]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#f5efeb] font-semibold">
                        <FileText className="w-4 h-4 text-[#38bdf8] shrink-0" />
                        <span className="truncate max-w-xs">{paymentProofDoc?.original_name || "Bukti Pembayaran"}</span>
                      </div>
                      <div className="text-[11px] text-[#f5efeb]/60 space-x-2">
                        {paymentProofDoc?.size && (
                          <span>
                            {paymentProofDoc.size > 1024 * 1024
                              ? `${(paymentProofDoc.size / (1024 * 1024)).toFixed(2)} MB`
                              : `${Math.round(paymentProofDoc.size / 1024)} KB`}
                          </span>
                        )}
                        {paymentProofDoc?.uploaded_at && (
                          <span>· Diunggah {new Date(paymentProofDoc.uploaded_at).toLocaleString("id-ID")}</span>
                        )}
                      </div>
                      <span className="inline-block text-[10px] text-[#d6be8c]">
                        Status: Menunggu verifikasi admin melalui panel privat
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-stretch sm:self-auto">
                      {paymentProofDoc?.preview_url && (
                        <a
                          href={paymentProofDoc.preview_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-lg bg-[#b39257]/20 border border-[#b39257]/40 text-[#f5efeb] hover:bg-[#b39257]/30 text-[10px] uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Lihat Berkas</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowReuploadForm(true)}
                        className="px-4 py-2 rounded-lg border border-[#f5efeb]/20 text-[#f5efeb]/70 hover:text-[#f5efeb] hover:border-[#f5efeb]/40 text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer"
                      >
                        Ganti Berkas
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail preview if it's an image */}
                  {paymentProofDoc?.preview_url && (!paymentProofDoc.mime_type || paymentProofDoc.mime_type.startsWith("image/")) && (
                    <div className="rounded-xl overflow-hidden border border-[#d6be8c]/20 bg-[#08110b] p-3 flex justify-center max-h-80">
                      <img
                        src={paymentProofDoc.preview_url}
                        alt={paymentProofDoc.original_name || "Bukti Pembayaran"}
                        className="max-h-72 object-contain rounded-lg border border-[#d6be8c]/15"
                      />
                    </div>
                  )}

                  {paymentProofMessage && <p role="status" className="text-xs text-[#d6be8c]">{paymentProofMessage}</p>}
                </div>
              ) : (
                /* Upload Form */
                <div className="space-y-3 font-mono">
                  <p className="text-xs text-[#f5efeb]/60 font-sans">
                    {hasUploadedProof
                      ? "Pilih berkas baru untuk mengganti bukti transaksi yang sudah tersimpan di database."
                      : "Unggah berkas bukti transaksi (PDF, JPG, PNG, atau WebP, maks 10 MB). Admin akan memverifikasi di panel privat."}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={(event) => setPaymentProof(event.currentTarget.files?.[0] || null)}
                    className="block w-full text-xs text-[#f5efeb]/70 file:mr-3 file:rounded-md file:border-0 file:bg-[#b39257] file:px-3 file:py-2 file:text-[10px] file:font-semibold file:uppercase file:text-[#08110b] cursor-pointer"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePaymentProofUpload}
                      disabled={!paymentProof || isUploadingProof}
                      className="rounded-full bg-[#b39257] px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#08110b] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-all"
                    >
                      <Upload className="mr-2 inline-block h-3.5 w-3.5" />
                      {isUploadingProof ? "Mengunggah..." : hasUploadedProof ? "Perbarui Bukti" : "Unggah Bukti"}
                    </button>
                    {hasUploadedProof && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowReuploadForm(false);
                          setPaymentProof(null);
                        }}
                        className="text-[10px] text-[#f5efeb]/60 hover:text-[#f5efeb] uppercase tracking-wider cursor-pointer"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                  {paymentProofMessage && <p role="status" className="text-xs text-[#d6be8c]">{paymentProofMessage}</p>}
                </div>
              )}
            </div>
          )}


          {/* Next Steps Checklist */}
          {/* <div className="space-y-4">
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
          </div> */}

          {/* WhatsApp Banner */}
          <div className="p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-start space-x-3 text-xs">
            <MessageSquare className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#f5efeb] block">Konfirmasi WhatsApp</span>
              <p className="text-[#f5efeb]/80 text-[11px] leading-relaxed">
                Reservasi Anda telah berhasil disimpan di sistem. Jika WhatsApp tidak terbuka secara otomatis, klik tombol <strong>Buka Chat WhatsApp</strong> di bawah untuk mengirim pesan konfirmasi ke pengelola aviari kami.
              </p>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="pt-4 border-t border-[#d6be8c]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-[#08110b] text-xs uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#08110b]" />
              <span>Buka Chat WhatsApp</span>
            </button>

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
