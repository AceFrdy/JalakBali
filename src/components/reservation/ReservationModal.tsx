"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  User,
  Users,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WEEKLY_RELEASES, CURRENT_RELEASE } from "@/data/weeklyReleases";
import { BIRDS_COLLECTION, BREEDING_PAIRS } from "@/data/birds";
import {
  Bird,
  BreedingPair,
  BirdPairCatalog,
  WeeklyRelease,
  VerificationStatus,
} from "@/types";
import { INITIAL_DOCUMENTS_TEMPLATE } from "@/lib/documents";
import { submitReservationApplication, getCatalogBirds, getCatalogPairs, getWeeklyReleases } from "@/lib/api";
import { buildReservationWhatsAppMessage, redirectToWhatsApp } from "@/lib/whatsapp";

interface ReservationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialReleaseId?: string;
  initialBirdId?: string;
  initialPairId?: string;
  initialType?: "individual" | "pair";
  isModal?: boolean;
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

function findMatchingRelease(
  targetIdOrDate: string | undefined,
  list: WeeklyRelease[]
): WeeklyRelease | undefined {
  if (!targetIdOrDate || list.length === 0) return undefined;
  return list.find(
    (r) =>
      r.id === targetIdOrDate ||
      r.externalId === targetIdOrDate ||
      r.week?.toLowerCase() === targetIdOrDate.toLowerCase() ||
      r.releaseDate === targetIdOrDate ||
      (targetIdOrDate.includes("oct-03") && r.releaseDate?.includes("10-03")) ||
      (targetIdOrDate.includes("oct-10") && r.releaseDate?.includes("10-10")) ||
      (targetIdOrDate.includes("oct-17") && r.releaseDate?.includes("10-17")) ||
      (targetIdOrDate.includes("oct-24") && r.releaseDate?.includes("10-24")) ||
      (targetIdOrDate.includes("w40") && r.id?.includes("w40")) ||
      (targetIdOrDate.includes("w41") && r.id?.includes("w41")) ||
      (targetIdOrDate.includes("w42") && r.id?.includes("w42")) ||
      (targetIdOrDate.includes("w43") && r.id?.includes("w43"))
  );
}

export function ReservationModal({
  isOpen = true,
  onClose,
  initialReleaseId,
  initialBirdId,
  initialPairId,
  initialType = "individual",
  isModal = false,
}: ReservationModalProps) {
  const router = useRouter();
  // Step 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(2);
  const [direction, setDirection] = useState<number>(1);

  // Live collections from backend or fallback
  const [availableBirds, setAvailableBirds] = useState<Bird[]>(BIRDS_COLLECTION);
  const [availablePairs, setAvailablePairs] = useState<(BreedingPair | BirdPairCatalog)[]>(BREEDING_PAIRS);
  const [releases, setReleases] = useState<WeeklyRelease[]>(WEEKLY_RELEASES);

  // Step 1: Release
  const [selectedRelease, setSelectedRelease] = useState<WeeklyRelease>(() => {
    return (
      findMatchingRelease(initialReleaseId, WEEKLY_RELEASES) ||
      WEEKLY_RELEASES.find((r) => r.status === "open") ||
      CURRENT_RELEASE
    );
  });

  // Step 2: Individual or Pair
  const [reservationType, setReservationType] = useState<"individual" | "pair">(
    initialType
  );
  const DEFAULT_FALLBACK_BIRD: Bird = {
    id: "bird-custom",
    tagging: "JB-SPESIMEN",
    publicId: "JB-SPESIMEN",
    ringTag: "—",
    sex: "male",
    age: "Usia Remaja",
    hatchDate: "",
    status: "available",
    price: 32500000,
    deposit: 5000000,
    remaining: 27500000,
    breedingLine: "Garis Keturunan F2 Terverifikasi",
    description: "Spesimen hasil penangkaran resmi berlisensi.",
    images: ["/assets/jalak-portrait.png"],
  };

  const DEFAULT_FALLBACK_PAIR: BirdPairCatalog = {
    id: "pair-custom",
    pairTag: "PASANGAN-INDUKAN",
    price: 60000000,
    deposit: 10000000,
    remaining: 50000000,
    status: "available",
    showOnHomepage: true,
    description: "Pasangan indukan Jalak Bali serasi terverifikasi.",
    birdA: {
      id: "pair-bird-a",
      tagging: "Jantan ♂",
      publicId: "Jantan ♂",
      ringTag: "—",
      sex: "male",
      age: "Usia Remaja",
      hatchDate: "",
      status: "available",
      price: 30000000,
      deposit: 5000000,
      remaining: 25000000,
      breedingLine: "Garis Keturunan F2",
      description: "Indukan jantan terverifikasi.",
      images: ["/assets/jalak-portrait.png"],
    },
    birdB: {
      id: "pair-bird-b",
      tagging: "Betina ♀",
      publicId: "Betina ♀",
      ringTag: "—",
      sex: "female",
      age: "Usia Remaja",
      hatchDate: "",
      status: "available",
      price: 30000000,
      deposit: 5000000,
      remaining: 25000000,
      breedingLine: "Garis Keturunan F2",
      description: "Indukan betina terverifikasi.",
      images: ["/assets/jalak-portrait.png"],
    },
  };

  const [selectedBird, setSelectedBird] = useState<Bird>(() => {
    return (
      (availableBirds.length > 0
        ? availableBirds.find((b) => b.id === initialBirdId || b.publicId === initialBirdId || b.tagging === initialBirdId) || availableBirds[0]
        : null) || DEFAULT_FALLBACK_BIRD
    );
  });
  const [selectedPair, setSelectedPair] = useState<BreedingPair | BirdPairCatalog>(() => {
    return (
      (availablePairs.length > 0
        ? availablePairs.find((p) => p && (p.id === initialPairId || ('pairId' in p && p.pairId === initialPairId) || ('pairTag' in p && p.pairTag === initialPairId))) || availablePairs[0]
        : null) || DEFAULT_FALLBACK_PAIR
    );
  });

  // Track if user arrived with pre-selected item from catalog/homepage
  const isPreselected = reservationType === "individual" ? !!initialBirdId : !!initialPairId;
  const [showSpecimenPicker, setShowSpecimenPicker] = useState<boolean>(!isPreselected);

  // Load live catalog items & weekly releases
  useEffect(() => {
    getWeeklyReleases()
      .then((liveReleases) => {
        if (liveReleases && liveReleases.length > 0) {
          setReleases(liveReleases);
          const foundRelease = findMatchingRelease(initialReleaseId, liveReleases) ||
            liveReleases.find((r) => r.status === "open") ||
            liveReleases[0];
          if (foundRelease) setSelectedRelease(foundRelease);
        }
      })
      .catch(() => {});

    getCatalogBirds()
      .then((liveBirds) => {
        if (liveBirds && liveBirds.length > 0) {
          const availableOnly = liveBirds.filter((b) => b.status === "available");
          const list = availableOnly.length > 0 ? availableOnly : liveBirds;
          setAvailableBirds(list);
          const found = initialBirdId
            ? list.find((b) => b.id === initialBirdId || b.publicId === initialBirdId || b.tagging === initialBirdId)
            : list[0];
          if (found) setSelectedBird(found);
        }
      })
      .catch(() => {});

    getCatalogPairs()
      .then((livePairs) => {
        if (livePairs && livePairs.length > 0) {
          const availableOnly = livePairs.filter((p) => p.status === "available");
          const list = availableOnly.length > 0 ? availableOnly : livePairs;
          setAvailablePairs(list);
          const found = initialPairId
            ? list.find((p) => p.id === initialPairId || p.pairTag === initialPairId)
            : list[0];
          if (found) setSelectedPair(found);
        }
      })
      .catch(() => {});
  }, [initialReleaseId, initialBirdId, initialPairId]);

  const isIndividualAvailable = hasReleaseAvailability(selectedRelease, "individual");
  const isPairAvailable = hasReleaseAvailability(selectedRelease, "pair");

  // Pair metadata helpers
  const pairTag = selectedPair && 'pairTag' in selectedPair ? selectedPair.pairTag : (selectedPair?.pairId || 'PASANGAN-INDUKAN');
  const pairDescription = selectedPair && 'compatibilityNote' in selectedPair ? selectedPair.compatibilityNote : (selectedPair?.description || 'Kombinasi indukan serasi terverifikasi.');
  const pairImage = (selectedPair && 'images' in selectedPair && selectedPair.images?.[0])
    ? selectedPair.images[0]
    : (selectedPair?.birdA?.images?.[0] || '/assets/jalak-portrait.png');
  const birdImage = (selectedBird?.images && selectedBird.images[0]) || '/assets/jalak-portrait.png';

  // Step 3: Customer Information
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [handoverMethod] = useState<
    "facility_handover" | "certified_wildlife_courier"
  >("certified_wildlife_courier");

  const [documents, setDocuments] = useState(() =>
    INITIAL_DOCUMENTS_TEMPLATE.map((document) => ({ ...document }))
  );
  const [documentError, setDocumentError] = useState("");
  const identityDocumentInputRef = useRef<HTMLInputElement>(null);
  const [identityDocumentFile, setIdentityDocumentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  // Step 4: Verification State Machine
  const [verificationState, setVerificationState] =
    useState<VerificationStatus>("under_review");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "bank_transfer">("qris");

  // Step 5: Payment proof (for bank_transfer, optional at submission)
  const paymentProofInputRef = useRef<HTMLInputElement>(null);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofFileName, setPaymentProofFileName] = useState<string>("");

  const price =
    reservationType === "individual"
      ? (selectedBird.price || 32500000)
      : (selectedPair.price || 60000000);
  const deposit =
    reservationType === "individual"
      ? (selectedBird.deposit || 5000000)
      : (selectedPair.deposit || 10000000);
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
    if (!identityDocumentFile) {
      setSubmissionError("Dokumen KTP wajib diunggah sebelum pengajuan dikirim.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");

    try {
      const application = await submitReservationApplication({
        customerName,
        customerEmail,
        customerPhone,
        address,
        city,
        handoverMethod,
        reservationType,
        weeklyReleaseId: selectedRelease.id,
        birdId: reservationType === "individual" ? selectedBird.id : undefined,
        pairId: reservationType === "pair" ? selectedPair.id : undefined,
        paymentType: "deposit",
        paymentMethod,
        price,
        depositAmount: deposit,
        remainingAmount: remaining,
        identityDocument: identityDocumentFile,
        paymentProof: paymentProofFile ?? undefined,
      });

      // Build minimal WhatsApp message — only booking code + customer name.
      // All full data (KTP, documents, transaction) is in backend / Filament Admin.
      const message = buildReservationWhatsAppMessage({
        bookingCode: application.bookingCode,
        customerName,
      });

      const ownerPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
      redirectToWhatsApp(ownerPhone, message, "_blank");

      // Navigate to confirmation page so when user returns from WhatsApp/re-opens the web,
      // they land on the official confirmation page (not the homepage).
      router.push(
        `/reservation/${application.bookingCode}/confirmation?token=${encodeURIComponent(application.accessToken)}`
      );
      onClose?.();
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Pengajuan reservasi gagal dikirim.");
    } finally {
      setIsSubmitting(false);
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

  const formContent = (
    <motion.div
      initial={{ opacity: 0, scale: isModal ? 0.95 : 1, y: isModal ? 15 : 0 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: isModal ? 0.95 : 1, y: isModal ? 15 : 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className="relative w-full max-w-5xl mx-auto bg-[#0d1811] border border-[#d6be8c]/30 rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.85)] grid grid-cols-1 lg:grid-cols-12 min-h-[680px]"
    >
      {/* Close Button if modal mode or onClose provided */}
      {onClose && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="absolute top-5 right-5 z-40 p-2.5 rounded-full bg-[#08110b]/90 text-[#f5efeb] hover:text-[#b39257] border border-[#d6be8c]/20 hover:border-[#b39257] transition-colors cursor-pointer"
          aria-label="Tutup reservasi"
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}

            {/* ── Left Side: Live Dossier Ledger Slip ── */}
            <div className="lg:col-span-4 relative hidden lg:flex flex-col justify-between border-r border-[#d6be8c]/20 p-8 bg-[#08110b]">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[9px] uppercase tracking-[0.3em] text-[#b39257] font-mono">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Registri Buku Induk Penangkaran</span>
                </div>
                <h3 className="font-serif text-2xl text-[#f5efeb] font-light leading-snug">
                  {reservationType === "individual"
                    ? `Jalak Bali (${selectedBird.publicId || selectedBird.tagging || "Specimen"})`
                    : `Pasangan (${pairTag})`}
                </h3>
                <p className="text-xs text-[#d6be8c] font-mono">
                  Rilis: {selectedRelease.formattedDate}
                </p>
              </div>

              {/* Bird / Pair Visual Preview */}
              <div className="my-6 relative aspect-[4/3] rounded-xl overflow-hidden border border-[#d6be8c]/20 shadow-inner bg-[#060e08]">
                <Image
                  src={reservationType === "individual" ? birdImage : pairImage}
                  alt="Avian Specimen"
                  fill
                  unoptimized
                  className="object-cover object-center filter brightness-90"
                />
                <div className="absolute bottom-2 left-2 text-[8px] uppercase tracking-widest text-[#d6be8c] font-mono bg-[#08110b]/80 px-2 py-0.5 rounded">
                  {reservationType === "individual"
                    ? `Cincin: ${selectedBird.ringTag || "—"}`
                    : `Pasang: ${pairTag}`}
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
                          {releases.map((release) => {
                            const isSelected = selectedRelease.id === release.id || selectedRelease.externalId === release.id;
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

                    {/* ── STEP 02: SELECT INDIVIDUAL OR PAIR & SPECIFIC SPECIMEN ── */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-serif text-2xl sm:text-3xl text-[#f5efeb] font-light mb-1">
                            Langkah 01 — Pilih Tipe & Spesimen
                          </h4>
                          <p className="text-xs text-[#f5efeb]/70 font-mono">
                            Tentukan antara mereservasi 1 spesimen individu atau sepasang indukan bonding.
                          </p>
                        </div>

                        {/* Top Toggle: Individual vs Pair */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                          {/* Option A: Individual */}
                          <button
                            type="button"
                            disabled={!isIndividualAvailable}
                            aria-pressed={reservationType === "individual"}
                            onClick={() => {
                              setReservationType("individual");
                              setShowSpecimenPicker(!initialBirdId);
                            }}
                            className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                              reservationType === "individual"
                                ? "bg-[#16271c] border-[#b39257] shadow-xl ring-1 ring-[#b39257]/50"
                                : "bg-[#08110b] border-[#d6be8c]/15 hover:border-[#d6be8c]/35"
                            } ${!isIndividualAvailable ? "opacity-45 cursor-not-allowed" : ""}`}
                          >
                            <div className="flex items-center justify-between text-[10px] text-[#b39257] uppercase tracking-widest">
                              <span className="flex items-center space-x-1.5">
                                <User className="w-3.5 h-3.5" />
                                <span>Alokasi Individu</span>
                              </span>
                              {reservationType === "individual" && <Check className="w-4 h-4 text-[#b39257]" />}
                            </div>
                            <div>
                              <h5 className="font-serif text-xl sm:text-2xl text-[#f5efeb] font-light">
                                Individu (1 Burung)
                              </h5>
                              <p className="text-xs text-[#f5efeb]/60 font-sans mt-1">
                                {selectedBird.publicId || selectedBird.tagging} · Deposit: Rp {(selectedBird.deposit || 5000000).toLocaleString("id-ID")}
                              </p>
                            </div>
                          </button>

                          {/* Option B: Pair */}
                          <button
                            type="button"
                            disabled={!isPairAvailable}
                            aria-pressed={reservationType === "pair"}
                            onClick={() => {
                              setReservationType("pair");
                              setShowSpecimenPicker(!initialPairId);
                            }}
                            className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                              reservationType === "pair"
                                ? "bg-[#16271c] border-[#b39257] shadow-xl ring-1 ring-[#b39257]/50"
                                : "bg-[#08110b] border-[#d6be8c]/15 hover:border-[#d6be8c]/35"
                            } ${!isPairAvailable ? "opacity-45 cursor-not-allowed" : ""}`}
                          >
                            <div className="flex items-center justify-between text-[10px] text-[#b39257] uppercase tracking-widest">
                              <span className="flex items-center space-x-1.5">
                                <Users className="w-3.5 h-3.5" />
                                <span>Pasangan Bonding</span>
                              </span>
                              {reservationType === "pair" && <Check className="w-4 h-4 text-[#b39257]" />}
                            </div>
                            <div>
                              <h5 className="font-serif text-xl sm:text-2xl text-[#f5efeb] font-light">
                                Pasangan (2 Burung)
                              </h5>
                              <p className="text-xs text-[#f5efeb]/60 font-sans mt-1">
                                {pairTag} · Deposit: Rp {(('deposit' in selectedPair && selectedPair.deposit) || 10000000).toLocaleString("id-ID")}
                              </p>
                            </div>
                          </button>
                        </div>

                        {/* ── Individual Specimen Selection Area ── */}
                        {reservationType === "individual" && (
                          <div className="p-4 sm:p-5 rounded-2xl bg-[#08110b] border border-[#d6be8c]/20 space-y-3 font-mono text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-[0.2em] text-[#b39257] flex items-center space-x-1.5">
                                <Sparkles className="w-3 h-3 text-[#b39257]" />
                                <span>Spesimen Terpilih</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowSpecimenPicker((prev) => !prev)}
                                className="text-[10px] uppercase tracking-wider text-[#38bdf8] hover:underline cursor-pointer flex items-center space-x-1"
                              >
                                <span>{showSpecimenPicker ? "Tutup Pilihan" : "Ganti Spesimen"}</span>
                                <RotateCcw className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            {/* Active Bird Card */}
                            <div className="p-3 sm:p-4 rounded-xl bg-[#132218] border border-[#b39257]/40 flex items-center justify-between gap-4">
                              <div className="flex items-center space-x-3.5">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#08110b] border border-[#d6be8c]/25 shrink-0">
                                  <Image
                                    src={birdImage}
                                    alt={selectedBird.publicId || "Bird"}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-serif text-base text-[#f5efeb] font-semibold flex items-center space-x-2">
                                    <span>{selectedBird.publicId || selectedBird.tagging}</span>
                                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30">
                                      {selectedBird.sex === "male" ? "Jantan ♂" : "Betina ♀"}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-[#d6be8c]/80 mt-0.5">
                                    Cincin: {selectedBird.ringTag || "—"} · Usia: {selectedBird.age || "—"}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-[9px] text-[#f5efeb]/50 block">Deposit</span>
                                <span className="text-sm font-bold text-[#d6be8c]">
                                  Rp {(selectedBird.deposit || 5000000).toLocaleString("id-ID")}
                                </span>
                              </div>
                            </div>

                            {/* Expandable Specimen Picker Grid */}
                            {showSpecimenPicker && availableBirds.length > 1 && (
                              <div className="pt-2 border-t border-[#d6be8c]/15 space-y-2">
                                <span className="text-[10px] text-[#f5efeb]/60 uppercase tracking-wider block">
                                  Pilih dari daftar spesimen lain yang tersedia:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                                  {availableBirds.map((bird) => {
                                    const isCurrent = bird.id === selectedBird.id || bird.publicId === selectedBird.publicId;
                                    const birdImg = (bird.images && bird.images[0]) || '/assets/jalak-portrait.png';
                                    return (
                                      <button
                                        key={bird.id}
                                        type="button"
                                        onClick={() => {
                                          setSelectedBird(bird);
                                          setShowSpecimenPicker(false);
                                        }}
                                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                          isCurrent
                                            ? "bg-[#16271c] border-[#b39257] ring-1 ring-[#b39257]"
                                            : "bg-[#08110b] border-[#d6be8c]/15 hover:border-[#b39257]/50"
                                        }`}
                                      >
                                        <div className="flex items-center space-x-2.5">
                                          <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-[#060e08] shrink-0">
                                            <Image src={birdImg} alt={bird.publicId || "Bird"} fill unoptimized className="object-cover" />
                                          </div>
                                          <div>
                                            <span className="text-xs text-[#f5efeb] font-semibold block">
                                              {bird.publicId || bird.tagging}
                                            </span>
                                            <span className="text-[10px] text-[#d6be8c]/70">
                                              {bird.sex === "male" ? "Jantan" : "Betina"} · {bird.ringTag || "—"}
                                            </span>
                                          </div>
                                        </div>
                                        {isCurrent && <Check className="w-3.5 h-3.5 text-[#b39257] shrink-0" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* ── Pair Specimen Selection Area ── */}
                        {reservationType === "pair" && (
                          <div className="p-4 sm:p-5 rounded-2xl bg-[#08110b] border border-[#d6be8c]/20 space-y-3 font-mono text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-[0.2em] text-[#b39257] flex items-center space-x-1.5">
                                <Sparkles className="w-3 h-3 text-[#b39257]" />
                                <span>Set Pasangan Terpilih</span>
                              </span>
                              {availablePairs.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setShowSpecimenPicker((prev) => !prev)}
                                  className="text-[10px] uppercase tracking-wider text-[#38bdf8] hover:underline cursor-pointer flex items-center space-x-1"
                                >
                                  <span>{showSpecimenPicker ? "Tutup Pilihan" : "Ganti Pasangan"}</span>
                                  <RotateCcw className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>

                            {/* Active Pair Card */}
                            <div className="p-3 sm:p-4 rounded-xl bg-[#132218] border border-[#b39257]/40 flex items-center justify-between gap-4">
                              <div className="flex items-center space-x-3.5">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#08110b] border border-[#d6be8c]/25 shrink-0">
                                  <Image
                                    src={pairImage}
                                    alt={pairTag}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-serif text-base text-[#f5efeb] font-semibold flex items-center space-x-2">
                                    <span>Pasangan {pairTag}</span>
                                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#f472b6]/15 text-[#f472b6] border border-[#f472b6]/30">
                                      Indukan Bonding ♂♀
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-[#d6be8c]/80 mt-0.5">
                                    {selectedPair.birdA?.publicId} (♂) × {selectedPair.birdB?.publicId} (♀)
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-[9px] text-[#f5efeb]/50 block">Deposit</span>
                                <span className="text-sm font-bold text-[#d6be8c]">
                                  Rp {(('deposit' in selectedPair && selectedPair.deposit) || 10000000).toLocaleString("id-ID")}
                                </span>
                              </div>
                            </div>

                            <p className="text-[11px] text-[#f5efeb]/70 font-sans leading-relaxed">
                              {pairDescription}
                            </p>

                            {/* Expandable Pairs Grid */}
                            {showSpecimenPicker && availablePairs.length > 1 && (
                              <div className="pt-2 border-t border-[#d6be8c]/15 space-y-2">
                                <span className="text-[10px] text-[#f5efeb]/60 uppercase tracking-wider block">
                                  Pilih dari daftar pasangan lain yang tersedia:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                                  {availablePairs.map((p) => {
                                    const pTag = 'pairTag' in p ? p.pairTag : p.pairId;
                                    const isCurrent = pTag === pairTag;
                                    const pImg = ('images' in p && p.images?.[0]) ? p.images[0] : (p.birdA?.images?.[0] || '/assets/jalak-portrait.png');
                                    return (
                                      <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => {
                                          setSelectedPair(p);
                                          setShowSpecimenPicker(false);
                                        }}
                                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                          isCurrent
                                            ? "bg-[#16271c] border-[#b39257] ring-1 ring-[#b39257]"
                                            : "bg-[#08110b] border-[#d6be8c]/15 hover:border-[#b39257]/50"
                                        }`}
                                      >
                                        <div className="flex items-center space-x-2.5">
                                          <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-[#060e08] shrink-0">
                                            <Image src={pImg} alt={pTag} fill unoptimized className="object-cover" />
                                          </div>
                                          <div>
                                            <span className="text-xs text-[#f5efeb] font-semibold block">
                                              {pTag}
                                            </span>
                                            <span className="text-[10px] text-[#d6be8c]/70">
                                              {p.birdA?.publicId} × {p.birdB?.publicId}
                                            </span>
                                          </div>
                                        </div>
                                        {isCurrent && <Check className="w-3.5 h-3.5 text-[#b39257] shrink-0" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
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
                                setIdentityDocumentFile(file);
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
                                    setIdentityDocumentFile(null);
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
                      <div className="space-y-5">
                        <div>
                          <h4 className="font-serif text-2xl sm:text-3xl text-[#f5efeb] font-light mb-1">
                            Langkah 03 — Deposit Reservasi
                          </h4>
                          <p className="text-xs text-[#f5efeb]/70 font-mono">
                            Pilih metode pembayaran lalu kirim pengajuan. Anda akan diarahkan ke WhatsApp setelah reservasi berhasil dibuat.
                          </p>
                        </div>

                        {/* Deposit Amount Card */}
                        <div className="p-5 rounded-2xl bg-[#08110b] border border-[#b39257]/50 font-mono">
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

                        {/* Payment Method Selector */}
                        <div className="space-y-3 font-mono">
                          <span className="text-[10px] uppercase tracking-widest text-[#b39257]">
                            Pilih Metode Pembayaran
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              aria-pressed={paymentMethod === "qris"}
                              onClick={() => {
                                setPaymentMethod("qris");
                                setPaymentProofFile(null);
                                setPaymentProofFileName("");
                              }}
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
                                Scan QR di bawah untuk pembayaran
                              </span>
                            </button>
                            <button
                              type="button"
                              aria-pressed={paymentMethod === "bank_transfer"}
                              onClick={() => {
                                setPaymentMethod("bank_transfer");
                                setPaymentProofFile(null);
                                setPaymentProofFileName("");
                              }}
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
                                Transfer ke rekening yang tertera
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* QRIS Dummy Display */}
                        {paymentMethod === "qris" && (
                          <div className="rounded-2xl border border-[#d6be8c]/20 bg-[#08110b] p-5 space-y-3 font-mono">
                            <span className="text-[10px] uppercase tracking-widest text-[#b39257] block">
                              Kode QR Pembayaran (Demo)
                            </span>
                            {/* Dummy QRIS pattern — placeholder testing only */}
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-44 h-44 rounded-xl bg-white flex items-center justify-center border border-[#d6be8c]/30 p-3">
                                <svg viewBox="0 0 200 200" className="w-full h-full" aria-label="QRIS dummy placeholder">
                                  {/* Outer frame */}
                                  <rect x="10" y="10" width="60" height="60" rx="4" fill="none" stroke="#111" strokeWidth="8"/>
                                  <rect x="22" y="22" width="36" height="36" fill="#111"/>
                                  <rect x="130" y="10" width="60" height="60" rx="4" fill="none" stroke="#111" strokeWidth="8"/>
                                  <rect x="142" y="22" width="36" height="36" fill="#111"/>
                                  <rect x="10" y="130" width="60" height="60" rx="4" fill="none" stroke="#111" strokeWidth="8"/>
                                  <rect x="22" y="142" width="36" height="36" fill="#111"/>
                                  {/* Inner dots */}
                                  <rect x="82" y="10" width="10" height="10" fill="#111"/>
                                  <rect x="96" y="10" width="10" height="10" fill="#111"/>
                                  <rect x="110" y="10" width="10" height="10" fill="#111"/>
                                  <rect x="82" y="24" width="10" height="10" fill="#111"/>
                                  <rect x="110" y="24" width="10" height="10" fill="#111"/>
                                  <rect x="82" y="38" width="10" height="10" fill="#111"/>
                                  <rect x="96" y="38" width="10" height="10" fill="#111"/>
                                  <rect x="110" y="38" width="10" height="10" fill="#111"/>
                                  <rect x="82" y="52" width="10" height="10" fill="#111"/>
                                  <rect x="82" y="80" width="10" height="10" fill="#111"/>
                                  <rect x="96" y="80" width="10" height="10" fill="#111"/>
                                  <rect x="82" y="94" width="10" height="10" fill="#111"/>
                                  <rect x="110" y="94" width="10" height="10" fill="#111"/>
                                  <rect x="82" y="108" width="10" height="10" fill="#111"/>
                                  <rect x="96" y="108" width="10" height="10" fill="#111"/>
                                  <rect x="110" y="108" width="10" height="10" fill="#111"/>
                                  <rect x="130" y="80" width="10" height="10" fill="#111"/>
                                  <rect x="144" y="80" width="10" height="10" fill="#111"/>
                                  <rect x="158" y="80" width="10" height="10" fill="#111"/>
                                  <rect x="130" y="94" width="10" height="10" fill="#111"/>
                                  <rect x="130" y="108" width="10" height="10" fill="#111"/>
                                  <rect x="144" y="108" width="10" height="10" fill="#111"/>
                                  <rect x="158" y="108" width="10" height="10" fill="#111"/>
                                  <rect x="82" y="130" width="10" height="10" fill="#111"/>
                                  <rect x="96" y="130" width="10" height="10" fill="#111"/>
                                  <rect x="110" y="130" width="10" height="10" fill="#111"/>
                                  <rect x="82" y="144" width="10" height="10" fill="#111"/>
                                  <rect x="110" y="144" width="10" height="10" fill="#111"/>
                                  <rect x="130" y="130" width="10" height="10" fill="#111"/>
                                  <rect x="158" y="130" width="10" height="10" fill="#111"/>
                                  <rect x="130" y="158" width="10" height="10" fill="#111"/>
                                  <rect x="144" y="158" width="10" height="10" fill="#111"/>
                                  <rect x="158" y="158" width="10" height="10" fill="#111"/>
                                </svg>
                              </div>
                              <div className="text-center space-y-1">
                                <p className="text-[10px] text-[#b39257] uppercase tracking-wider">Jalak Bali Penangkaran</p>
                                <p className="text-xs text-[#f5efeb]/70">Rp {deposit.toLocaleString("id-ID")}</p>
                                <span className="inline-block text-[9px] bg-[#b39257]/20 text-[#b39257] px-2 py-0.5 rounded border border-[#b39257]/30 uppercase tracking-wider">
                                  Testing / Demo — bukan QRIS asli
                                </span>
                              </div>
                            </div>
                            <p className="text-[10px] text-[#f5efeb]/50 font-sans text-center">
                              QR ini hanya untuk keperluan testing. QRIS asli akan dikirim oleh admin melalui WhatsApp setelah pengajuan diterima.
                            </p>

                            {/* Upload Bukti Pembayaran QRIS */}
                            <div className="pt-3 border-t border-[#d6be8c]/15 space-y-2">
                              <label htmlFor="payment-proof-qris" className="block text-[10px] uppercase tracking-wider text-[#b39257]">
                                Upload Bukti Pembayaran QRIS <span className="text-[#f5efeb]/40 normal-case">(opsional — bisa dikirim setelah reservasi)</span>
                              </label>
                              <input
                                ref={paymentProofInputRef}
                                id="payment-proof-qris"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.webp"
                                onChange={(event) => {
                                  const file = event.currentTarget.files?.[0];
                                  if (!file) return;
                                  if (file.size > 10 * 1024 * 1024) {
                                    alert("Ukuran berkas maksimal 10 MB.");
                                    event.currentTarget.value = "";
                                    return;
                                  }
                                  setPaymentProofFile(file);
                                  setPaymentProofFileName(file.name);
                                  event.currentTarget.value = "";
                                }}
                                className="block w-full cursor-pointer text-xs text-[#f5efeb]/70 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#b39257] file:px-3 file:py-2 file:text-[10px] file:font-semibold file:uppercase file:tracking-wider file:text-[#08110b] hover:file:bg-[#d6be8c]"
                              />
                              {paymentProofFileName && (
                                <div className="flex items-center justify-between gap-3 rounded-md border border-[#38bdf8]/20 bg-[#38bdf8]/5 px-3 py-2 text-xs text-[#f5efeb]/80">
                                  <span className="flex min-w-0 items-center gap-2">
                                    <Upload className="h-3.5 w-3.5 shrink-0 text-[#38bdf8]" />
                                    <span className="truncate">{paymentProofFileName}</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPaymentProofFile(null);
                                      setPaymentProofFileName("");
                                      if (paymentProofInputRef.current) {
                                        paymentProofInputRef.current.value = "";
                                      }
                                    }}
                                    aria-label="Hapus bukti pembayaran"
                                    className="shrink-0 text-[#f5efeb]/60 hover:text-[#f5efeb] transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                              <p className="text-[10px] text-[#f5efeb]/50 font-sans">
                                Bukti pembayaran tersimpan di backend dan dapat dilihat oleh admin melalui panel.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Bank Transfer Info + Upload Bukti */}
                        {paymentMethod === "bank_transfer" && (
                          <div className="rounded-2xl border border-[#d6be8c]/20 bg-[#08110b] p-5 space-y-4 font-mono">
                            <div>
                              <span className="text-[10px] uppercase tracking-widest text-[#b39257] block mb-2">
                                Rekening Tujuan Transfer (Demo)
                              </span>
                              <div className="space-y-1.5 text-xs text-[#f5efeb]/80">
                                <div className="flex justify-between">
                                  <span className="text-[#f5efeb]/50">Bank</span>
                                  <span className="font-semibold text-[#f5efeb]">BCA</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#f5efeb]/50">No. Rekening</span>
                                  <span className="font-semibold text-[#f5efeb] tracking-wider">1234 5678 90</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#f5efeb]/50">Atas Nama</span>
                                  <span className="font-semibold text-[#f5efeb]">Jalak Bali Penangkaran</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#f5efeb]/50">Jumlah</span>
                                  <span className="font-bold text-[#d6be8c]">Rp {deposit.toLocaleString("id-ID")}</span>
                                </div>
                              </div>
                              <p className="mt-2 text-[9px] text-[#b39257]/70 uppercase tracking-wider">
                                * Data rekening ini hanya untuk testing. Rekening asli dikirim admin via WhatsApp.
                              </p>
                            </div>

                            {/* Upload Bukti Transfer */}
                            <div className="pt-3 border-t border-[#d6be8c]/15 space-y-2">
                              <label htmlFor="payment-proof" className="block text-[10px] uppercase tracking-wider text-[#b39257]">
                                Upload Bukti Transfer <span className="text-[#f5efeb]/40 normal-case">(opsional — bisa dikirim setelah reservasi)</span>
                              </label>
                              <input
                                ref={paymentProofInputRef}
                                id="payment-proof"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.webp"
                                onChange={(event) => {
                                  const file = event.currentTarget.files?.[0];
                                  if (!file) return;
                                  if (file.size > 10 * 1024 * 1024) {
                                    alert("Ukuran berkas maksimal 10 MB.");
                                    event.currentTarget.value = "";
                                    return;
                                  }
                                  setPaymentProofFile(file);
                                  setPaymentProofFileName(file.name);
                                  event.currentTarget.value = "";
                                }}
                                className="block w-full cursor-pointer text-xs text-[#f5efeb]/70 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#b39257] file:px-3 file:py-2 file:text-[10px] file:font-semibold file:uppercase file:tracking-wider file:text-[#08110b] hover:file:bg-[#d6be8c]"
                              />
                              {paymentProofFileName && (
                                <div className="flex items-center justify-between gap-3 rounded-md border border-[#38bdf8]/20 bg-[#38bdf8]/5 px-3 py-2 text-xs text-[#f5efeb]/80">
                                  <span className="flex min-w-0 items-center gap-2">
                                    <Upload className="h-3.5 w-3.5 shrink-0 text-[#38bdf8]" />
                                    <span className="truncate">{paymentProofFileName}</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPaymentProofFile(null);
                                      setPaymentProofFileName("");
                                      if (paymentProofInputRef.current) {
                                        paymentProofInputRef.current.value = "";
                                      }
                                    }}
                                    aria-label="Hapus bukti transfer"
                                    className="shrink-0 text-[#f5efeb]/60 hover:text-[#f5efeb] transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                              <p className="text-[10px] text-[#f5efeb]/50 font-sans">
                                Bukti transfer tersimpan di backend dan dapat dilihat oleh admin melalui panel.
                              </p>
                            </div>
                          </div>
                        )}

                        <p className="text-[11px] text-[#f5efeb]/60 font-sans">
                          Setelah pengajuan berhasil, Anda akan diarahkan ke WhatsApp dengan kode reservasi Anda.
                        </p>
                        {submissionError && (
                          <p role="alert" className="text-xs text-red-300 font-sans">
                            {submissionError}
                          </p>
                        )}
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
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                      className="px-8 py-3.5 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[11px] uppercase tracking-[0.25em] font-semibold transition-all shadow-[0_10px_25px_rgba(179,146,87,0.25)] flex items-center space-x-2 cursor-pointer"
                    >
                      <span>{isSubmitting ? "Mengirim Pengajuan..." : "Kirim Pengajuan"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              )}
            </div>
    </motion.div>
  );

  if (!isModal) {
    return formContent;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#060e08]/94 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 md:p-8">
          {formContent}
        </div>
      )}
    </AnimatePresence>
  );
}
