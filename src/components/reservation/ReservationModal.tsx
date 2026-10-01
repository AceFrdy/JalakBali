"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Shield,
  ArrowRight,
  QrCode,
  Landmark,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WEEKLY_RELEASES, CURRENT_RELEASE } from "@/data/weeklyReleases";
import { BIRDS_COLLECTION, BREEDING_PAIRS } from "@/data/birds";
import {
  Bird,
  BreedingPair,
  WeeklyRelease,
  VerificationStatus,
} from "@/types";
import { createReservation, INITIAL_DOCUMENTS_TEMPLATE } from "@/lib/reservations";
import { redirectToWhatsApp } from "@/lib/whatsapp";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReleaseId?: string;
  initialBirdId?: string;
  initialPairId?: string;
  initialType?: "individual" | "pair";
}

function hasReleaseAvailability(
  release: WeeklyRelease,
  type: "individual" | "pair"
) {
  return (
    release.status !== "closed" &&
    (type === "individual" ? release.availableSingle : release.availablePair) > 0
  );
}

function isReleaseSoldOut(release: WeeklyRelease) {
  return (
    !hasReleaseAvailability(release, "individual") &&
    !hasReleaseAvailability(release, "pair")
  );
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
  const [currentStep, setCurrentStep] = useState<number>(2);
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
  const isIndividualAvailable = hasReleaseAvailability(selectedRelease, "individual");
  const isPairAvailable = hasReleaseAvailability(selectedRelease, "pair");

  // Step 3: Customer Information
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [handoverMethod, setHandoverMethod] = useState<
    "facility_handover" | "certified_wildlife_courier"
  >("certified_wildlife_courier");

  const [documents, setDocuments] = useState(() =>
    INITIAL_DOCUMENTS_TEMPLATE.map((document) => ({ ...document }))
  );
  const [documentError, setDocumentError] = useState("");
  const identityDocumentInputRef = useRef<HTMLInputElement>(null);

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
  const handleNextStep = () => {
    if (!hasReleaseAvailability(selectedRelease, reservationType)) return;

    if (currentStep === 3) {
      if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
        alert("Mohon lengkapi Nama Lengkap, Email, dan Nomor Telepon.");
        return;
      }
      if (!customerEmail.includes("@")) {
        alert("Mohon masukkan alamat email yang valid.");
        return;
      }
      if (!documents.some((document) => document.id === "doc-identity" && document.status === "uploaded")) {
        setDocumentError("Pilih dokumen KTP sebelum melanjutkan.");
        return;
      }

      setVerificationState("under_review");
    }

    setDirection(1);
    setCurrentStep((prev) => (prev === 3 ? 5 : prev + 1));
  };

  const handleSubmitToWhatsApp = async () => {
    if (!process.env.NEXT_PUBLIC_WHATSAPP_NUMBER && process.env.NODE_ENV === "production") {
      alert("Nomor WhatsApp belum dikonfigurasi.");
      return;
    }

    const reservation = await createReservation({
      type: reservationType,
      weeklyReleaseId: selectedRelease.id,
      birdId: reservationType === "individual" ? selectedBird.id : undefined,
      pairId: reservationType === "pair" ? selectedPair.id : undefined,
      customer: {
        fullName: customerName,
        email: customerEmail,
        phone: customerPhone,
        address,
        city,
        province: "",
        postalCode: "",
        preferredHandoverMethod: handoverMethod,
      },
      paymentType: "deposit",
      paymentMethod,
      documents,
    });

    const result = redirectToWhatsApp(
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
      [
        "Halo, saya ingin mengajukan reservasi Jalak Bali dengan deposit.",
        "",
        `Kode pengajuan: ${reservation.bookingCode}`,
        `Nama: ${customerName}`,
        `Email: ${customerEmail}`,
        `Nomor WhatsApp: ${customerPhone}`,
        `Rilis: ${selectedRelease.formattedDate}`,
        `Pilihan: ${reservationType === "individual" ? `Individu - ${selectedBird.publicId} (${selectedBird.name})` : `Pasangan - ${selectedPair.pairId}`}`,
        `Deposit reservasi: Rp ${deposit.toLocaleString("id-ID")}`,
        `Nilai total: Rp ${price.toLocaleString("id-ID")}`,
        `Sisa pembayaran: Rp ${remaining.toLocaleString("id-ID")}`,
        `Metode pembayaran pilihan: ${paymentMethod === "qris" ? "QRIS" : "Transfer bank"}`,
        `Metode serah terima: ${handoverMethod === "facility_handover" ? "Serah terima di fasilitas" : "Kurir satwa liar bersertifikat"}`,
        `Kota: ${city || "Belum diisi"}`,
        `Alamat aviari: ${address || "Belum diisi"}`,
      ].filter(Boolean).join("\n")
    );

    if (result === "missing") {
      alert("Nomor WhatsApp belum dikonfigurasi.");
      return;
    }
  };

  const handlePrevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => (prev === 5 ? 3 : Math.max(prev - 1, 2)));
  };

  const visibleStep = currentStep === 2 ? 1 : currentStep === 3 ? 2 : 3;
  const stepLabels = [
    "Individu / Pasangan",
    "Informasi Pemesan",
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
                    LANGKAH 0{visibleStep} / 03 · {stepLabels[visibleStep - 1]}
                  </span>
                  <span className="text-[#38bdf8]">
                    Reservasi Terkendali
                  </span>
                </div>
                <div className="w-full bg-[#132218] h-[3px] rounded-full overflow-hidden">
                  <motion.div
                    className="bg-[#b39257] h-full"
                    animate={{ width: `${(visibleStep / 3) * 100}%` }}
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
                            const isSoldOut = isReleaseSoldOut(release);
                            return (
                              <button
                                key={release.id}
                                type="button"
                                disabled={isSoldOut}
                                aria-pressed={isSelected}
                                onClick={() => {
                                  setSelectedRelease(release);
                                  if (!hasReleaseAvailability(release, reservationType)) {
                                    setReservationType(
                                      hasReleaseAvailability(release, "individual")
                                        ? "individual"
                                        : "pair"
                                    );
                                  }
                                }}
                                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                                  isSelected
                                    ? "bg-[#16271c] border-[#b39257] shadow-lg"
                                    : "bg-[#08110b] border-[#d6be8c]/15"
                                } ${
                                  isSoldOut
                                    ? "cursor-not-allowed opacity-45"
                                    : "cursor-pointer hover:border-[#d6be8c]/35"
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
                                      isSoldOut
                                        ? "border-[#f5efeb]/20 bg-[#f5efeb]/5 text-[#f5efeb]/45"
                                        : release.status === "open"
                                        ? "border-[#38bdf8]/40 bg-[#38bdf8]/10 text-[#38bdf8]"
                                        : "border-[#b39257]/40 bg-[#b39257]/10 text-[#b39257]"
                                    }`}
                                  >
                                    {isSoldOut
                                      ? "Habis"
                                      : release.status === "open"
                                        ? "Dibuka"
                                        : "Terjadwal"}
                                  </span>
                                </div>
                              </button>
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
                            Langkah 01 — Pilih Individu atau Pasangan
                          </h4>
                          <p className="text-xs text-[#f5efeb]/70 font-mono">
                            Tentukan pilihan antara mereservasi satu spesimen individu atau sepasang indukan bonding.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                          {/* Option A: Individual */}
                          <button
                            type="button"
                            disabled={!isIndividualAvailable}
                            aria-pressed={reservationType === "individual"}
                            onClick={() => setReservationType("individual")}
                            className={`w-full text-left p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                              reservationType === "individual"
                                ? "bg-[#16271c] border-[#b39257] shadow-xl"
                                : "bg-[#08110b] border-[#d6be8c]/15"
                            } ${
                              isIndividualAvailable
                                ? "cursor-pointer hover:border-[#d6be8c]/35"
                                : "cursor-not-allowed opacity-45"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between text-[10px] text-[#b39257] uppercase tracking-widest mb-2">
                                <span>Alokasi Individu</span>
                                {isIndividualAvailable ? (
                                  reservationType === "individual" && <Check className="w-4 h-4 text-[#b39257]" />
                                ) : (
                                  <span className="text-[#f5efeb]/40">Kuota Habis</span>
                                )}
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
                          </button>

                          {/* Option B: Pair */}
                          <button
                            type="button"
                            disabled={!isPairAvailable}
                            aria-pressed={reservationType === "pair"}
                            onClick={() => setReservationType("pair")}
                            className={`w-full text-left p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                              reservationType === "pair"
                                ? "bg-[#16271c] border-[#b39257] shadow-xl"
                                : "bg-[#08110b] border-[#d6be8c]/15"
                            } ${
                              isPairAvailable
                                ? "cursor-pointer hover:border-[#d6be8c]/35"
                                : "cursor-not-allowed opacity-45"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between text-[10px] text-[#b39257] uppercase tracking-widest mb-2">
                                <span>Pasangan Bonding</span>
                                {isPairAvailable ? (
                                  reservationType === "pair" && <Check className="w-4 h-4 text-[#b39257]" />
                                ) : (
                                  <span className="text-[#f5efeb]/40">Kuota Habis</span>
                                )}
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
                          </button>
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
                            Langkah 02 — Informasi Pemesan
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

                          <div className="sm:col-span-2 rounded-xl border border-[#d6be8c]/20 bg-[#08110b] p-4">
                            <label htmlFor="identity-document" className="block text-[10px] uppercase tracking-wider text-[#b39257]">
                              Dokumen KTP *
                            </label>
                            <p className="mt-1 text-[11px] text-[#f5efeb]/55">
                              PDF, DOC, DOCX, JPG, PNG, atau WebP · Maksimal 10 MB
                            </p>
                            <input
                              ref={identityDocumentInputRef}
                              id="identity-document"
                              type="file"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                              aria-describedby="identity-document-help identity-document-error"
                              onChange={(event) => {
                                const file = event.currentTarget.files?.[0];
                                if (!file) return;

                                const extension = file.name.split(".").pop()?.toLowerCase();
                                const supportedExtensions = ["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"];
                                if (!extension || !supportedExtensions.includes(extension)) {
                                  setDocumentError("Format berkas tidak didukung.");
                                  event.currentTarget.value = "";
                                  return;
                                }
                                if (file.size > 10 * 1024 * 1024) {
                                  setDocumentError("Ukuran berkas maksimal 10 MB.");
                                  event.currentTarget.value = "";
                                  return;
                                }

                                setDocuments((currentDocuments) =>
                                  currentDocuments.map((document) =>
                                    document.id === "doc-identity"
                                      ? {
                                          ...document,
                                          status: "uploaded",
                                          fileName: file.name,
                                          uploadedAt: new Date().toISOString(),
                                        }
                                      : document
                                  )
                                );
                                setDocumentError("");
                                event.currentTarget.value = "";
                              }}
                              className="mt-3 block w-full cursor-pointer text-xs text-[#f5efeb]/70 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#b39257] file:px-3 file:py-2 file:text-[10px] file:font-semibold file:uppercase file:tracking-wider file:text-[#08110b] hover:file:bg-[#d6be8c]"
                            />
                            <span id="identity-document-help" className="sr-only">
                              Pilih satu berkas KTP dalam format PDF, DOC, DOCX, JPG, PNG, atau WebP dengan ukuran maksimal 10 MB.
                            </span>
                            {documents.find((document) => document.id === "doc-identity")?.fileName && (
                              <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-[#38bdf8]/20 bg-[#38bdf8]/5 px-3 py-2 text-xs text-[#f5efeb]/80">
                                <span className="flex min-w-0 items-center gap-2">
                                  <Upload className="h-3.5 w-3.5 shrink-0 text-[#38bdf8]" />
                                  <span className="truncate">{documents.find((document) => document.id === "doc-identity")?.fileName}</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDocuments((currentDocuments) =>
                                      currentDocuments.map((document) =>
                                        document.id === "doc-identity"
                                          ? { ...document, status: "not_uploaded", fileName: undefined, uploadedAt: undefined }
                                          : document
                                      )
                                    );
                                    setDocumentError("");
                                    if (identityDocumentInputRef.current) {
                                      identityDocumentInputRef.current.value = "";
                                    }
                                  }}
                                  aria-label="Hapus berkas KTP"
                                  className="shrink-0 text-[#f5efeb]/60 transition-colors hover:text-[#f5efeb]"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                            {documentError && (
                              <p id="identity-document-error" role="alert" className="mt-2 text-xs text-red-300">
                                {documentError}
                              </p>
                            )}
                          </div>

                          

                          {/* <div className="sm:col-span-2">
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
                          </div> */}

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
                            Langkah 03 — Deposit Reservasi
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
                  {currentStep > 2 ? (
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
