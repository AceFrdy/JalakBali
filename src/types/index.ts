export type BirdStatus =
  | "available"
  | "reserved"
  | "verification"
  | "sold"
  | "waitlist"
  | "unavailable";

export type DocumentationStatus =
  | "verified"
  | "pending"
  | "requires_review"
  | "requires_update";

export interface Bird {
  id: string;
  tagging: string; // e.g. "JB-001"
  publicId?: string; // Legacy alias for tagging
  name?: string;
  ringTag?: string; // Leg band / ring identifier
  sex: "male" | "female" | "unknown";
  age: string; // e.g. "14 Bulan"
  hatchDate?: string; // e.g. "2025-07-12"
  status: BirdStatus;
  price?: number; // e.g. 32500000
  deposit?: number; // e.g. 5000000
  remaining?: number; // e.g. 27500000
  breedingLine?: string; // "Captive Bred F2"
  description?: string;
  images: string[];
  certificateImages?: string[];
}

export interface BreedingPair {
  id: string;
  pairId: string; // e.g. "PAIR-2026-001"
  name: string; // e.g. "Pair Dewata & Kalyani"
  birdA: Bird;
  birdB: Bird;
  status: BirdStatus;
  price: number;
  deposit: number;
  remaining: number;
  pairingDate: string;
  compatibilityNote: string;
  documentationStatus: DocumentationStatus;
  legalNote: string;
  description: string;
  images: string[];
}

/** Pair data returned from /api/catalog/pairs (live backend) */
export interface BirdPairCatalog {
  id: string;
  pairTag: string; // e.g. "PAIR-001"
  status: BirdStatus;
  showOnHomepage: boolean;
  price?: number;
  deposit?: number;
  remaining?: number;
  description?: string;
  birdA: Bird; // jantan
  birdB: Bird; // betina
}

export interface WeeklyRelease {
  id: string;
  week: string; // e.g. "2026-W40"
  releaseDate: string; // ISO date "2026-10-03"
  formattedDate: string; // "03 October 2026"
  availableSingle: number;
  availablePair: number;
  status: "scheduled" | "open" | "closed";
  individualBirdIds: string[];
  pairIds: string[];
  reservationOpenAt: string;
  reservationCloseAt?: string;
  handoverEstimate: string;
  note?: string;
}

export type AvailabilityStatus = "available" | "limited" | "full" | "waitlist" | "closed";

export interface AvailabilitySlot {
  id: string;
  date: string;
  dayOfWeek: string;
  formattedDate: string;
  time: string;
  status: AvailabilityStatus;
  availableSingles: number;
  availablePairs: number;
  note?: string;
}

export type DocumentUploadStatus =
  | "not_uploaded"
  | "uploaded"
  | "under_review"
  | "verified"
  | "rejected"
  | "requires_update";

export interface ReservationDocument {
  id: string;
  title: string;
  description: string;
  required: boolean;
  status: DocumentUploadStatus;
  fileName?: string;
  uploadedAt?: string;
}

export type VerificationStatus =
  | "not_started"
  | "pending"
  | "under_review"
  | "verified"
  | "rejected"
  | "requires_update";

export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "expired"
  | "failed"
  | "refunded"
  | "cancelled";

export type TransactionState =
  | "available"
  | "held"
  | "reservation_started"
  | "documentation_submitted"
  | "under_verification"
  | "verified"
  | "payment_pending"
  | "payment_processing"
  | "paid"
  | "confirmed"
  | "handover_scheduled"
  | "completed"
  | "rejected"
  | "cancelled"
  | "expired"
  | "waitlist";

export interface ReservationCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  preferredHandoverMethod: "facility_handover" | "certified_wildlife_courier";
  notes?: string;
}

export interface Reservation {
  id: string;
  bookingCode: string; // e.g. "JB-2026-001"
  weeklyReleaseId: string;
  releaseDate: string;
  type: "individual" | "pair";
  birdId?: string;
  pairId?: string;
  birdSnapshot?: Bird;
  pairSnapshot?: BreedingPair;
  customer: ReservationCustomer;
  documents: ReservationDocument[];
  verificationStatus: VerificationStatus;
  paymentType: "deposit" | "full";
  price: number;
  depositAmount: number;
  remainingAmount: number;
  paymentMethod?: "qris" | "bank_transfer" | "other";
  paymentStatus: PaymentStatus;
  transactionState: TransactionState;
  reservedAt: string;
  holdExpiresAt: string;
  handoverDateEstimate: string;
}

export interface WaitingListEntry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  preferredRelease: string;
  preferredType: "individual" | "pair" | "any";
  birdCount: number;
  optionalMessage?: string;
  status: "waitlisted" | "contacted" | "fulfilled";
  submittedAt: string;
  queuePosition?: number;
}

export interface Review {
  id: string;
  quote: string;
  patronName: string;
  patronTitle: string;
  location: string;
  date: string;
  rating: number;
  verified: boolean;
  individualRef?: string;
}

export interface ExperiencePackage {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  duration: string;
  location: string;
  groupSize: string;
  price: number;
  formattedPrice: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  schedule: { time: string; activity: string }[];
  preparationNotes: string[];
  isFocal?: boolean;
}

