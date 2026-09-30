"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Shield,
  ArrowRight,
  Upload,
  QrCode,
  Landmark,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WEEKLY_RELEASES, CURRENT_RELEASE } from "@/data/weeklyReleases";
import { BIRDS_COLLECTION, BREEDING_PAIRS } from "@/data/birds";
import {
  Bird,
  BreedingPair,
  WeeklyRelease,
  ReservationDocument,
  VerificationStatus,
} from "@/types";
import { INITIAL_DOCUMENTS_TEMPLATE } from "@/lib/reservations";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReleaseId?: string;
  initialBirdId?: string;
  initialPairId?: string;
  initialType?: "individual" | "pair";
}

export function ReservationModal({
  isOpen,
  onClose,
  initialReleaseId,
  initialBirdId,
  initialPairId,
  initialType = "individual",
}: ReservationModalProps) {
  // Step 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);

  // Step 1: Release
  const [selectedRelease, setSelectedRelease] = useState<WeeklyRelease>(() => {
    return (
      WEEKLY_RELEASES.find((r) => r.id === initialReleaseId) ||
      CURRENT_RELEASE
    );
  });

  // Step 2: Individual or Pair
  const [reservationType, setReservationType] = useState<"individual" | "pair">(
    initialType
  );
  const [selectedBird, setSelectedBird] = useState<Bird>(() => {
    return (
      BIRDS_COLLECTION.find((b) => b.id === initialBirdId || b.publicId === initialBirdId) ||
      BIRDS_COLLECTION[0]
    );
  });
  const [selectedPair, setSelectedPair] = useState<BreedingPair>(() => {
    return (
      BREEDING_PAIRS.find((p) => p.id === initialPairId || p.pairId === initialPairId) ||
      BREEDING_PAIRS[0]
    );
  });

  // Step 3: Customer Information
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [handoverMethod, setHandoverMethod] = useState<
    "facility_handover" | "certified_wildlife_courier"
  >("certified_wildlife_courier");

  // KTP upload is part of customer information
  const [documents, setDocuments] = useState<ReservationDocument[]>(
    INITIAL_DOCUMENTS_TEMPLATE
  );

  // Step 4: Verification State Machine
  const [verificationState, setVerificationState] =
    useState<VerificationStatus>("under_review");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "bank_transfer">("qris");

  // Sync initial props when opened
  useEffect(() => {
    if (initialBirdId) {
      const b = BIRDS_COLLECTION.find(
        (bird) => bird.id === initialBirdId || bird.publicId === initialBirdId
      );
      if (b) {
        setSelectedBird(b);
        setReservationType("individual");
      }
    }
    if (initialPairId) {
      const p = BREEDING_PAIRS.find(
        (pair) => pair.id === initialPairId || pair.pairId === initialPairId
      );
      if (p) {
        setSelectedPair(p);
        setReservationType("pair");
      }
    }
  }, [initialBirdId, initialPairId]);

  const price =
    reservationType === "individual"
      ? selectedBird.price || 32500000
      : selectedPair.price;
  const deposit =
    reservationType === "individual"
      ? selectedBird.deposit || 5000000
      : selectedPair.deposit;
  const remaining = price - deposit;
  const handleSimulateUpload = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            status: "uploaded",
            fileName: `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_doc.pdf`,
            uploadedAt: new Date().toISOString(),
          };
        }
        return doc;
      })
    );
  };

  const handleNextStep = () => {
    // Step 3 Validation
    if (currentStep === 3) {
      if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
        alert("Mohon lengkapi Nama Lengkap, Email, dan Nomor Telepon.");
        return;
      }
      if (!customerEmail.includes("@")) {
        alert("Mohon masukkan alamat email yang valid.");
        return;
      }

      const pendingKtp = documents.some(
        (document) => document.id === "doc-identity" && document.status === "not_uploaded"
      );
      if (pendingKtp) {
        const proceedAnyway = confirm(
          "KTP Anda belum diunggah. Apakah Anda tetap ingin melanjutkan ke tinjauan verifikasi?"
        );
        if (!proceedAnyway) return;
      }
      setVerificationState("under_review");
    }

    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handleSubmitToWhatsApp = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
    if (!whatsappNumber) {
      alert("Nomor WhatsApp belum dikonfigurasi.");
      return;
    }

    const specimen = reservationType === "individual"
      ? `Individu - ${selectedBird.publicId} (${selectedBird.name})`
      : `Pasangan - ${selectedPair.pairId}`;
    const handover = handoverMethod === "facility_handover"
      ? "Serah terima di fasilitas"
      : "Kurir satwa liar bersertifikat";
    const message = [
      "Halo, saya ingin mengajukan reservasi Jalak Bali dengan deposit.",
      "",
      `Nama: ${customerName}`,
      `Email: ${customerEmail}`,
      `Nomor WhatsApp: ${customerPhone}`,
      `Rilis: ${selectedRelease.formattedDate}`,
      `Pilihan: ${specimen}`,
      `Deposit reservasi: Rp ${deposit.toLocaleString("id-ID")}`,
      `Nilai total: Rp ${price.toLocaleString("id-ID")}`,
      `Sisa pembayaran: Rp ${remaining.toLocaleString("id-ID")}`,
      `Metode pembayaran pilihan: ${paymentMethod === "qris" ? "QRIS" : "Transfer bank"}`,
      `Metode serah terima: ${handover}`,
      `Kota: ${city || "Belum diisi"}`,
      `Alamat aviari: ${address || "Belum diisi"}`,
    ].filter(Boolean).join("\n");

    window.location.assign(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    );
  };

  const handlePrevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const stepLabels = [
    "Pilih Rilis",
    "Individu / Pasangan",
    "Informasi Pemesan",
    "Verifikasi",
    "Pembayaran",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#060e08]/94 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-5xl bg-[#0d1811] border border-[#d6be8c]/30 rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.85)] grid grid-cols-1 lg:grid-cols-12 min-h-[680px]"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-5 right-5 z-40 p-2.5 rounded-full bg-[#08110b]/90 text-[#f5efeb] hover:text-[#b39257] border border-[#d6be8c]/20 hover:border-[#b39257] transition-colors cursor-pointer"
              aria-label="Tutup modal reservasi"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* ── Left Side: Live Dossier Ledger Slip ── */}
            <div className="lg:col-span-4 relative hidden lg:flex flex-col justify-between border-r border-[#d6be8c]/20 p-8 bg-[#08110b]">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[9px] uppercase tracking-[0.3em] text-[#b39257] font-mono">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Registri Buku Induk Penangkaran</span>
                </div>
                <h3 className="font-serif text-2xl text-[#f5efeb] font-light leading-snug">
                  {reservationType === "individual"
                    ? `Jalak Bali (${selectedBird.publicId})`
                    : `Pasangan (${selectedPair.pairId})`}
                </h3>
                <p className="text-xs text-[#d6be8c] font-mono">
                  Rilis: {selectedRelease.formattedDate}
                </p>
              </div>

              {/* Bird / Pair Visual Preview */}
              <div className="my-6 relative aspect-[4/3] rounded-xl overflow-hidden border border-[#d6be8c]/20 shadow-inner">
                <Image
                  src={
                    reservationType === "individual"
                      ? selectedBird.images[0]
                      : selectedPair.images[0]
                  }
                  alt="Avian Specimen"
                  fill
                  className="object-cover object-center filter brightness-90"
                />
                <div className="absolute bottom-2 left-2 text-[8px] uppercase tracking-widest text-[#d6be8c] font-mono bg-[#08110b]/80 px-2 py-0.5 rounded">
                  {reservationType === "individual"
                    ? `Cincin: ${selectedBird.ringTag}`
                    : `Pasang: ${selectedPair.pairId}`}
                </div>
              </div>

              {/* Running Ledger Price Breakdown */}
              <div className="p-4 rounded-xl bg-[#0d1811] border border-[#d6be8c]/20 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-[#f5efeb]/60">
                  <span>Tipe</span>
                  <span className="text-[#f5efeb] capitalize">
                    {reservationType === "individual" ? "1 Burung (Individu)" : "2 Burung (Pasang)"}
                  </span>
                </div>
                <div className="flex justify-between text-[#f5efeb]/60">
                  <span>Nilai Total</span>
                  <span className="text-[#f5efeb]">Rp {price.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-[#f5efeb]/60">
                  <span>Deposit Reservasi</span>
                  <span className="text-[#d6be8c]">Rp {deposit.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-[#f5efeb]/60">
                  <span>Sisa Pembayaran</span>
                  <span className="text-[#f5efeb]/80">Rp {remaining.toLocaleString("id-ID")}</span>
                </div>
                <div className="pt-2 border-t border-[#d6be8c]/20 flex justify-between items-baseline">
                  <span className="text-[#b39257] font-semibold">Bayar Sekarang</span>
                  <span className="text-[#d6be8c] font-serif text-lg font-bold">
                    Rp {deposit.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Right Side: 6-Step Multi-Step Guided Manifest ── */}
            <div className="lg:col-span-8 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
              {/* Stepper Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-[#b39257] font-mono mb-2">
                  <span>
                    LANGKAH 0{currentStep} / 05 · {stepLabels[currentStep - 1]}
                  </span>
                  <span className="text-[#38bdf8]">
                    {currentStep === 4 ? "Audit Kepatuhan" : "Reservasi Terkendali"}
                  </span>
                </div>
                <div className="w-full bg-[#132218] h-[3px] rounded-full overflow-hidden">
                  <motion.div
                    className="bg-[#b39257] h-full"
                    animate={{ width: `${(currentStep / 5) * 100}%` }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Step Panels */}
              <div className="overflow-hidden min-h-[420px]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={{
                      enter: (dir: number) => ({ x: dir > 0 ? 20 : -20, opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (dir: number) => ({ x: dir > 0 ? -20 : 20, opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* ── STEP 01: SELECT WEEKLY RELEASE ── */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-serif text-2xl sm:text-3xl text-[#f5efeb] font-light mb-1">
                            Langkah 01 — Pilih Rilis Mingguan
                          </h4>
                          <p className="text-xs text-[#f5efeb]/70 font-mono">
                            Alokasi Jalak Bali dirilis dalam kohort mingguan terbatas untuk menjamin catatan silsilah dan kesehatan veteriner.
                          </p>
                        </div>

                        <div className="space-y-3 font-mono">
                          {WEEKLY_RELEASES.map((release) => {
                            const isSelected = selectedRelease.id === release.id;
                            return (
                              <div
                                key={release.id}
                                onClick={() => setSelectedRelease(release)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                  isSelected
                                    ? "bg-[#16271c] border-[#b39257] shadow-lg"
                                    : "bg-[#08110b] border-[#d6be8c]/15 hover:border-[#d6be8c]/35"
                                }`}
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 rounded-lg bg-[#b39257]/10 border border-[#b39257]/30 flex flex-col items-center justify-center">
                                    <span className="text-[8px] text-[#b39257] uppercase">
                                      {release.week}
                                    </span>
                                    <span className="text-xs font-bold text-[#f5efeb]">
                                      {release.formattedDate.slice(0, 2)}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="text-sm text-[#f5efeb] font-semibold">
                                      Rilis {release.formattedDate}
                                    </div>
                                    <div className="text-[11px] text-[#d6be8c]/80">
                                      {release.availableSingle} Individu · {release.availablePair} Pasang Tersedia
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span
                                    className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                                      release.status === "open"
                                        ? "border-[#38bdf8]/40 bg-[#38bdf8]/10 text-[#38bdf8]"
                                        : "border-[#b39257]/40 bg-[#b39257]/10 text-[#b39257]"
                                    }`}
                                  >
                                    {release.status === "open" ? "Dibuka" : "Terjadwal"}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ── STEP 02: SELECT INDIVIDUAL OR PAIR ── */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-serif text-2xl sm:text-3xl text-[#f5efeb] font-light mb-1">
                            Langkah 02 — Pilih Individu atau Pasangan
                          </h4>
                          <p className="text-xs text-[#f5efeb]/70 font-mono">
                            Tentukan pilihan antara mereservasi satu spesimen individu atau sepasang indukan bonding.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                          {/* Option A: Individual */}
                          <div
                            onClick={() => setReservationType("individual")}
                            className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                              reservationType === "individual"
                                ? "bg-[#16271c] border-[#b39257] shadow-xl"
                                : "bg-[#08110b] border-[#d6be8c]/15 hover:border-[#d6be8c]/35"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between text-[10px] text-[#b39257] uppercase tracking-widest mb-2">
                                <span>Alokasi Individu</span>
                                {reservationType === "individual" && <Check className="w-4 h-4 text-[#b39257]" />}
                              </div>
                              <h5 className="font-serif text-2xl text-[#f5efeb] font-light">
                                Individu (1 Burung)
                              </h5>
                              <p className="text-xs text-[#f5efeb]/70 font-sans mt-2">
                                Kandidat: {selectedBird.publicId} ({selectedBird.name}) · {selectedBird.sex === "male" ? "Jantan" : "Betina"}
                              </p>
                            </div>
                            <div className="pt-3 border-t border-[#d6be8c]/15 flex justify-between items-baseline">
                              <span className="text-[10px] text-[#f5efeb]/50">Deposit</span>
                              <span className="text-base text-[#d6be8c] font-bold">
                                Rp {selectedBird.deposit?.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>

                          {/* Option B: Pair */}
                          <div
                            onClick={() => setReservationType("pair")}
                            className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                              reservationType === "pair"
                                ? "bg-[#16271c] border-[#b39257] shadow-xl"
                                : "bg-[#08110b] border-[#d6be8c]/15 hover:border-[#d6be8c]/35"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between text-[10px] text-[#b39257] uppercase tracking-widest mb-2">
                                <span>Pasangan Bonding</span>
                                {reservationType === "pair" && <Check className="w-4 h-4 text-[#b39257]" />}
                              </div>
                              <h5 className="font-serif text-2xl text-[#f5efeb] font-light">
                                Pasangan (2 Burung)
                              </h5>
                              <p className="text-xs text-[#f5efeb]/70 font-sans mt-2">
                                ID Pasangan: {selectedPair.pairId} ({selectedPair.birdA.publicId} & {selectedPair.birdB.publicId})
                              </p>
                            </div>
                            <div className="pt-3 border-t border-[#d6be8c]/15 flex justify-between items-baseline">
                              <span className="text-[10px] text-[#f5efeb]/50">Deposit</span>
                              <span className="text-base text-[#d6be8c] font-bold">
                                Rp {selectedPair.deposit?.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Pair Information Note */}
                        {reservationType === "pair" && (
                          <div className="p-4 rounded-xl bg-[#08110b] border border-[#d6be8c]/15 font-mono text-xs text-[#f5efeb]/75 space-y-1">
                            <span className="text-[10px] uppercase text-[#b39257] block">Asal-Usul Pasangan</span>
                            <p>{selectedPair.compatibilityNote}</p>
                            <span className="text-[10px] text-[#38bdf8] block pt-1">
                              Dokumentasi silsilah tersedia setelah verifikasi
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── STEP 03: CUSTOMER INFORMATION ── */}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-serif text-2xl sm:text-3xl text-[#f5efeb] font-light mb-1">
                            Langkah 03 — Informasi Pemesan
                          </h4>
                          <p className="text-xs text-[#f5efeb]/70 font-mono">
                            Daftarkan penjaga aviari yang ditunjuk atau pemelihara institusional.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#b39257] mb-1">
                              Nama Lengkap Sesuai KTP *
                            </label>
                            <input
                              type="text"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              placeholder="cth. Dr. Hendra Wijaya"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#08110b] border border-[#d6be8c]/20 focus:border-[#b39257] text-sm text-[#f5efeb] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#b39257] mb-1">
                              Alamat Email *
                            </label>
                            <input
                              type="email"
                              value={customerEmail}
                              onChange={(e) => setCustomerEmail(e.target.value)}
                              placeholder="hendra@aviary.test"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#08110b] border border-[#d6be8c]/20 focus:border-[#b39257] text-sm text-[#f5efeb] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#b39257] mb-1">
                              Nomor WhatsApp / Telepon *
                            </label>
                            <input
                              type="tel"
                              value={customerPhone}
                              onChange={(e) => setCustomerPhone(e.target.value)}
                              placeholder="+62 812 3456 7890"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#08110b] border border-[#d6be8c]/20 focus:border-[#b39257] text-sm text-[#f5efeb] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-[#b39257] mb-1">
                              Kota / Kabupaten
                            </label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="Bandung / Jakarta / Denpasar"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#08110b] border border-[#d6be8c]/20 focus:border-[#b39257] text-sm text-[#f5efeb] focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] uppercase tracking-wider text-[#b39257] mb-1">
                              Alamat Lokasi Aviari
                            </label>
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Alamat lengkap tempat aviari berada"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#08110b] border border-[#d6be8c]/20 focus:border-[#b39257] text-sm text-[#f5efeb] focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] uppercase tracking-wider text-[#b39257] mb-1">
                              Metode Serah Terima Pilihan
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setHandoverMethod("certified_wildlife_courier")}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                  handoverMethod === "certified_wildlife_courier"
                                    ? "bg-[#b39257]/15 border-[#b39257] text-[#f5efeb]"
                                    : "bg-[#08110b] border-[#d6be8c]/15 text-[#f5efeb]/70"
                                }`}
                              >
                                <span className="font-semibold block text-xs">Kurir Satwa Liar Bersertifikat</span>
                                <span className="text-[10px] text-[#f5efeb]/50">Suhu terkontrol Jawa & Bali</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setHandoverMethod("facility_handover")}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                  handoverMethod === "facility_handover"
                                    ? "bg-[#b39257]/15 border-[#b39257] text-[#f5efeb]"
                                    : "bg-[#08110b] border-[#d6be8c]/15 text-[#f5efeb]/70"
                                }`}
                              >
                                <span className="font-semibold block text-xs">Serah Terima di Fasilitas (Bali)</span>
                                <span className="text-[10px] text-[#f5efeb]/50">Janji temu langsung & tur aviari</span>
                              </button>
                            </div>
                          </div>

                          <div className="sm:col-span-2 p-4 rounded-xl bg-[#08110b] border border-[#d6be8c]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[#f5efeb] font-semibold">Dokumen Identitas KTP</span>
                                <span className="text-[8px] uppercase tracking-wider text-[#b39257] border border-[#b39257]/40 px-1.5 py-0.5 rounded">
                                  Wajib
                                </span>
                              </div>
                              <p className="text-[11px] text-[#f5efeb]/60 font-sans mt-1">
                                Unggah KTP penjaga terdaftar untuk verifikasi identitas.
                              </p>
                              {documents[0]?.fileName && (
                                <span className="text-[10px] text-[#38bdf8] block mt-1">
                                  File: {documents[0].fileName}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 self-end sm:self-center">
                              <span
                                className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                                  documents[0]?.status === "uploaded" || documents[0]?.status === "verified"
                                    ? "border-[#38bdf8]/40 bg-[#38bdf8]/10 text-[#38bdf8]"
                                    : "border-[#d6be8c]/20 text-[#f5efeb]/40"
                                }`}
                              >
                                {documents[0]?.status === "uploaded" ? "Terunggah" : documents[0]?.status === "verified" ? "Terverifikasi" : "Belum Diunggah"}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleSimulateUpload("doc-identity")}
                                className="px-3 py-1.5 rounded-lg border border-[#d6be8c]/30 hover:border-[#b39257] text-[#f5efeb] hover:text-[#b39257] text-[10px] uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
                              >
                                <Upload className="w-3 h-3" />
                                <span>{documents[0]?.status === "uploaded" ? "Ganti" : "Unggah KTP"}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── STEP 04: VERIFICATION REVIEW STATE ── */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-serif text-2xl sm:text-3xl text-[#f5efeb] font-light mb-1">
                            Langkah 04 — Verifikasi Pemilik
                          </h4>
                          <p className="text-xs text-[#f5efeb]/70 font-mono">
                            Reservasi belum merupakan pengalihan kepemilikan sampai seluruh verifikasi peraturan dipenuhi.
                          </p>
                        </div>

                        {/* State Checklist */}
                        <div className="p-6 rounded-2xl bg-[#08110b] border border-[#d6be8c]/20 space-y-4 font-mono text-xs">
                          <div className="text-[10px] uppercase tracking-[0.25em] text-[#b39257] border-b border-[#d6be8c]/15 pb-2">
                            Manifes Verifikasi
                          </div>

                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-[#f5efeb]/80">
                              <span>✓ Rilis Dipilih</span>
                              <span className="text-[#38bdf8]">{selectedRelease.formattedDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-[#f5efeb]/80">
                              <span>✓ Individu / Pasangan Dipilih</span>
                              <span className="text-[#38bdf8] uppercase">{reservationType === "individual" ? "Individu" : "Pasang"}</span>
                            </div>
                            <div className="flex items-center justify-between text-[#f5efeb]/80">
                              <span>✓ Informasi Pemesan Dicatat</span>
                              <span className="text-[#38bdf8]">{customerName}</span>
                            </div>
                            <div className="flex items-center justify-between text-[#f5efeb]/80">
                              <span>✓ KTP Diserahkan</span>
                              <span className="text-[#38bdf8]">
                                {documents.some((document) => document.status === "uploaded") ? "Terunggah" : "Menunggu"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[#d6be8c] pt-2 border-t border-[#d6be8c]/15 font-semibold">
                              <span>◉ Status Verifikasi</span>
                              <span className="uppercase text-[#38bdf8]">
                                {verificationState === "verified" ? "Terverifikasi" : "Sedang Ditinjau"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Administrative Fast-Track Toggle */}
                        <div className="p-4 rounded-xl bg-[#132218] border border-[#b39257]/30 flex items-center justify-between text-xs font-mono">
                          <div className="space-y-0.5">
                            <span className="text-[#f5efeb] font-semibold block">Simulasi Persetujuan Kepatuhan</span>
                            <span className="text-[10px] text-[#f5efeb]/60">
                              Beralih antara Sedang Ditinjau dan Terverifikasi untuk menguji alur
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setVerificationState((prev) =>
                                prev === "verified" ? "under_review" : "verified"
                              )
                            }
                            className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-bold transition-all ${
                              verificationState === "verified"
                                ? "bg-[#38bdf8] text-[#08110b] border-[#38bdf8]"
                                : "bg-[#08110b] text-[#38bdf8] border-[#38bdf8]/40"
                            }`}
                          >
                            {verificationState === "verified" ? "Status: Terverifikasi ✓" : "Klik untuk Verifikasi"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ── STEP 05: RESERVATION DEPOSIT ── */}
                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-serif text-2xl sm:text-3xl text-[#f5efeb] font-light mb-1">
                            Langkah 05 — Deposit Reservasi
                          </h4>
                          <p className="text-xs text-[#f5efeb]/70 font-mono">
                            Ajukan reservasi dengan deposit. Tim kami akan mengonfirmasi instruksi pembayaran melalui WhatsApp.
                          </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#08110b] border border-[#b39257]/50 font-mono">
                          <span className="text-[10px] uppercase tracking-widest text-[#b39257]">
                            Deposit Reservasi
                          </span>
                          <div className="font-serif text-3xl text-[#d6be8c] mt-2">
                            Rp {deposit.toLocaleString("id-ID")}
                          </div>
                          <div className="mt-4 pt-4 border-t border-[#d6be8c]/15 space-y-2 text-xs">
                            <div className="flex justify-between gap-4 text-[#f5efeb]/70">
                              <span>Nilai total</span>
                              <span className="text-[#f5efeb]">Rp {price.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-[#f5efeb]/70">
                              <span>Sisa pembayaran saat serah terima</span>
                              <span className="text-[#f5efeb]">Rp {remaining.toLocaleString("id-ID")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 font-mono">
                          <span className="text-[10px] uppercase tracking-widest text-[#b39257]">
                            Pilih Metode Pembayaran
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              aria-pressed={paymentMethod === "qris"}
                              onClick={() => setPaymentMethod("qris")}
                              className={`p-4 rounded-xl border text-left transition-colors ${
                                paymentMethod === "qris"
                                  ? "bg-[#b39257]/15 border-[#b39257] text-[#f5efeb]"
                                  : "bg-[#08110b] border-[#d6be8c]/20 text-[#f5efeb]/70 hover:border-[#d6be8c]/40"
                              }`}
                            >
                              <span className="flex items-center gap-2 text-xs font-semibold">
                                <QrCode className="w-4 h-4 text-[#d6be8c]" />
                                QRIS
                              </span>
                              <span className="block mt-1 text-[10px] text-[#f5efeb]/55">
                                Detail pembayaran dikirim admin
                              </span>
                            </button>
                            <button
                              type="button"
                              aria-pressed={paymentMethod === "bank_transfer"}
                              onClick={() => setPaymentMethod("bank_transfer")}
                              className={`p-4 rounded-xl border text-left transition-colors ${
                                paymentMethod === "bank_transfer"
                                  ? "bg-[#b39257]/15 border-[#b39257] text-[#f5efeb]"
                                  : "bg-[#08110b] border-[#d6be8c]/20 text-[#f5efeb]/70 hover:border-[#d6be8c]/40"
                              }`}
                            >
                              <span className="flex items-center gap-2 text-xs font-semibold">
                                <Landmark className="w-4 h-4 text-[#d6be8c]" />
                                Transfer Bank
                              </span>
                              <span className="block mt-1 text-[10px] text-[#f5efeb]/55">
                                Detail pembayaran dikirim admin
                              </span>
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#f5efeb]/60 font-sans">
                          Jangan melakukan pembayaran sebelum menerima instruksi resmi melalui WhatsApp.
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Stepper Navigation Footer */}
              {currentStep <= 5 && (
                <div className="flex items-center justify-between pt-6 border-t border-[#d6be8c]/15 mt-6 font-mono">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="text-xs uppercase tracking-[0.2em] text-[#f5efeb]/70 hover:text-[#b39257] flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Sebelumnya</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 5 ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleNextStep}
                      className="px-7 py-3 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[11px] uppercase tracking-[0.25em] font-semibold transition-all flex items-center space-x-2 cursor-pointer shadow-sm"
                    >
                      <span>Lanjutkan</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleSubmitToWhatsApp}
                      className="px-8 py-3.5 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[11px] uppercase tracking-[0.25em] font-semibold transition-all shadow-[0_10px_25px_rgba(179,146,87,0.25)] flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Lanjutkan ke WhatsApp</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
