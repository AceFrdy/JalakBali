import {
  Reservation,
  ReservationCustomer,
  ReservationDocument,
  TransactionState,
  VerificationStatus,
  WaitingListEntry,
} from "@/types";
import { BIRDS_COLLECTION, BREEDING_PAIRS } from "@/data/birds";
import { CURRENT_RELEASE, WEEKLY_RELEASES } from "@/data/weeklyReleases";

const RESERVATION_STORAGE_KEY = "jalak_bali_reservations_v2";
const WAITLIST_STORAGE_KEY = "jalak_bali_waitlist_v2";

export const INITIAL_DOCUMENTS_TEMPLATE: ReservationDocument[] = [
  {
    id: "doc-identity",
    title: "Dokumen Identitas (KTP)",
    description: "KTP pengelola aviari terdaftar untuk verifikasi identitas.",
    required: true,
    status: "not_uploaded",
  },
];

const SEED_RESERVATIONS: Reservation[] = [
  {
    id: "res-seed-001",
    bookingCode: "JB-2026-001",
    weeklyReleaseId: CURRENT_RELEASE.id,
    releaseDate: CURRENT_RELEASE.formattedDate,
    type: "pair",
    pairId: BREEDING_PAIRS[0].pairId,
    pairSnapshot: BREEDING_PAIRS[0],
    customer: {
      fullName: "Dr. Hendra W.",
      email: "hendra.w@domain.test",
      phone: "+62 812 3456 7890",
      address: "Jl. Dago Asri No. 18",
      city: "Bandung",
      province: "Jawa Barat",
      postalCode: "40135",
      preferredHandoverMethod: "certified_wildlife_courier",
      notes: "Dedicated 12-meter flight aviary prepared with automated misting and nest boxes.",
    },
    documents: [
      {
        id: "doc-identity",
        title: "Dokumen Identitas (KTP)",
        description: "KTP pengelola aviari terdaftar untuk verifikasi identitas.",
        required: true,
        status: "verified",
        fileName: "ktp_verified_hw.pdf",
        uploadedAt: "2026-09-28T09:12:00Z",
      },
    ],
    verificationStatus: "verified",
    paymentType: "deposit",
    price: 64000000,
    depositAmount: 10000000,
    remainingAmount: 54000000,
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    transactionState: "handover_scheduled",
    reservedAt: "2026-09-28T09:00:00Z",
    holdExpiresAt: "2026-10-03T18:00:00Z",
    handoverDateEstimate: "14 Oktober 2026",
  },
];

function getStoredReservations(): Reservation[] {
  if (typeof window === "undefined") return SEED_RESERVATIONS;
  try {
    const raw = localStorage.getItem(RESERVATION_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(RESERVATION_STORAGE_KEY, JSON.stringify(SEED_RESERVATIONS));
      return SEED_RESERVATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read reservations from storage:", err);
    return SEED_RESERVATIONS;
  }
}

function saveStoredReservations(reservations: Reservation[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RESERVATION_STORAGE_KEY, JSON.stringify(reservations));
  } catch (err) {
    console.error("Failed to save reservations to storage:", err);
  }
}

export async function getAllUserReservations(): Promise<Reservation[]> {
  return getStoredReservations();
}

export async function getReservationById(idOrCode: string): Promise<Reservation | null> {
  const all = getStoredReservations();
  return (
    all.find(
      (r) =>
        r.id === idOrCode ||
        r.bookingCode.toLowerCase() === idOrCode.toLowerCase()
    ) || null
  );
}

export interface CreateReservationParams {
  type: "individual" | "pair";
  weeklyReleaseId: string;
  birdId?: string;
  pairId?: string;
  customer: ReservationCustomer;
  paymentType: "deposit" | "full";
  paymentMethod?: "qris" | "bank_transfer";
  documents: ReservationDocument[];
}

export async function createReservation(
  params: CreateReservationParams
): Promise<Reservation> {
  const currentList = getStoredReservations();
  const codeNum = String(currentList.length + 2).padStart(3, "0");
  const bookingCode = `JB-2026-${codeNum}`;
  const selectedRelease =
    WEEKLY_RELEASES.find((release) => release.id === params.weeklyReleaseId) || CURRENT_RELEASE;

  let price = 32500000;
  let depositAmount = 5000000;
  let birdSnapshot = undefined;
  let pairSnapshot = undefined;

  if (params.type === "individual") {
    const foundBird =
      BIRDS_COLLECTION.find((b) => b.id === params.birdId || b.publicId === params.birdId) ||
      BIRDS_COLLECTION[0];
    birdSnapshot = foundBird;
    price = foundBird.price || 32500000;
    depositAmount = foundBird.deposit || 5000000;
  } else {
    const foundPair =
      BREEDING_PAIRS.find((p) => p.id === params.pairId || p.pairId === params.pairId) ||
      BREEDING_PAIRS[0];
    pairSnapshot = foundPair;
    price = foundPair.price;
    depositAmount = foundPair.deposit;
  }

  const remainingAmount = price - depositAmount;

  // Check how many documents uploaded
  const hasUploadedDocs = params.documents.some((d) => d.status === "uploaded" || d.status === "verified");

  const newReservation: Reservation = {
    id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    bookingCode,
    weeklyReleaseId: params.weeklyReleaseId || CURRENT_RELEASE.id,
    releaseDate: selectedRelease.formattedDate,
    type: params.type,
    birdId: params.birdId,
    pairId: params.pairId,
    birdSnapshot,
    pairSnapshot,
    customer: params.customer,
    documents: params.documents,
    verificationStatus: hasUploadedDocs ? "under_review" : "pending",
    paymentType: params.paymentType,
    price,
    depositAmount,
    remainingAmount,
    paymentMethod: params.paymentMethod || "qris",
    paymentStatus: "pending",
    transactionState: "under_verification",
    reservedAt: new Date().toISOString(),
    holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min hold
    handoverDateEstimate: selectedRelease.handoverEstimate,
  };

  const updated = [newReservation, ...currentList];
  saveStoredReservations(updated);
  return newReservation;
}

export async function updateReservationStatus(
  id: string,
  updates: Partial<Reservation>
): Promise<Reservation | null> {
  const currentList = getStoredReservations();
  const idx = currentList.findIndex((r) => r.id === id || r.bookingCode === id);
  if (idx === -1) return null;

  const target = { ...currentList[idx], ...updates };
  currentList[idx] = target;
  saveStoredReservations(currentList);
  return target;
}

export async function createWaitlistEntry(
  entry: Omit<WaitingListEntry, "id" | "status" | "submittedAt" | "queuePosition">
): Promise<WaitingListEntry> {
  let existing: WaitingListEntry[] = [];
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(WAITLIST_STORAGE_KEY);
      if (raw) existing = JSON.parse(raw);
    } catch (err) {
      console.error(err);
    }
  }

  const newEntry: WaitingListEntry = {
    ...entry,
    id: `waitlist-${Date.now()}`,
    status: "waitlisted",
    submittedAt: new Date().toISOString(),
    queuePosition: existing.length + 1,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify([newEntry, ...existing]));
    } catch (err) {
      console.error(err);
    }
  }

  return newEntry;
}
