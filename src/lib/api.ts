import * as birds from "./birds";
import * as availability from "./availability";
import type { Bird, BirdPairCatalog } from "@/types";

export interface ReservationApplicationPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address?: string;
  city?: string;
  handoverMethod: "facility_handover" | "certified_wildlife_courier";
  reservationType: "individual" | "pair";
  weeklyReleaseId: string;
  birdId?: string;
  pairId?: string;
  paymentType: "deposit" | "full";
  paymentMethod: "qris" | "bank_transfer";
  price: number;
  depositAmount: number;
  remainingAmount: number;
  identityDocument: File;
  /** Optional: bukti transfer / payment proof (bank_transfer) */
  paymentProof?: File;
}

export interface CustomerReservationDocument {
  id?: number;
  document_type: string;
  title?: string;
  original_name?: string;
  mime_type?: string;
  size?: number;
  status: string;
  uploaded_at?: string;
  preview_url?: string;
}

export interface CustomerPaymentTransactionItem {
  transactionCode: string;
  type: string;
  amount: number;
  paymentMethod: string;
  status: string;
  paidAt?: string;
  createdAt?: string;
}

export interface CustomerReservationStatus {
  bookingCode: string;
  customerName: string;
  reservationType: "individual" | "pair";
  weeklyReleaseId: string;
  applicationStatus: string;
  documentVerificationStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  price: number | null;
  depositAmount: number | null;
  totalPaid?: number | null;
  remainingAmount: number | null;
  documents: CustomerReservationDocument[];
  transactions?: CustomerPaymentTransactionItem[];
}


export async function getCatalogBirds(): Promise<Bird[]> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (!backendUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL belum dikonfigurasi.");

  const response = await fetch(`${backendUrl}/api/catalog/birds`, { cache: "no-store" });
  const result = (await response.json()) as { data?: Bird[]; message?: string };

  if (!response.ok || !result.data) {
    throw new Error(result.message || "Katalog bird tidak dapat dimuat.");
  }

  return result.data;
}

export async function getHomepageBirds(): Promise<Bird[]> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (!backendUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL belum dikonfigurasi.");

  const response = await fetch(`${backendUrl}/api/catalog/birds/homepage`, { cache: "no-store" });
  const result = (await response.json()) as { data?: Bird[]; message?: string };

  if (!response.ok || !result.data) {
    throw new Error(result.message || "Katalog bird tidak dapat dimuat.");
  }

  return result.data;
}

export async function getCatalogPairs(): Promise<BirdPairCatalog[]> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (!backendUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL belum dikonfigurasi.");

  const response = await fetch(`${backendUrl}/api/catalog/pairs`, { cache: "no-store" });
  const result = (await response.json()) as { data?: BirdPairCatalog[]; message?: string };

  if (!response.ok || !result.data) {
    throw new Error(result.message || "Katalog pasangan tidak dapat dimuat.");
  }

  return result.data;
}

export async function getHomepagePairs(): Promise<BirdPairCatalog[]> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (!backendUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL belum dikonfigurasi.");

  const response = await fetch(`${backendUrl}/api/catalog/pairs/homepage`, { cache: "no-store" });
  const result = (await response.json()) as { data?: BirdPairCatalog[]; message?: string };

  if (!response.ok || !result.data) {
    throw new Error(result.message || "Katalog pasangan tidak dapat dimuat.");
  }

  return result.data;
}

export async function submitReservationApplication(
  payload: ReservationApplicationPayload
): Promise<{
  bookingCode: string;
  accessToken: string;
  applicationStatus: string;
  documentVerificationStatus: string;
  paymentStatus: string;
}> {
  const formData = new FormData();
  formData.append("reservation_type", payload.reservationType);
  formData.append("weekly_release_id", payload.weeklyReleaseId);
  formData.append("customer_name", payload.customerName);
  formData.append("customer_email", payload.customerEmail);
  formData.append("customer_phone", payload.customerPhone);
  formData.append("handover_method", payload.handoverMethod);
  formData.append("payment_type", payload.paymentType);
  formData.append("payment_method", payload.paymentMethod);
  formData.append("price", String(payload.price));
  formData.append("deposit_amount", String(payload.depositAmount));
  formData.append("remaining_amount", String(payload.remainingAmount));
  formData.append("identity_document", payload.identityDocument);

  if (payload.address) formData.append("address", payload.address);
  if (payload.city) formData.append("city", payload.city);
  if (payload.birdId) formData.append("bird_id", payload.birdId);
  if (payload.pairId) formData.append("pair_id", payload.pairId);
  if (payload.paymentProof) formData.append("payment_proof", payload.paymentProof);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL belum dikonfigurasi.");
  }

  const response = await fetch(`${backendUrl}/api/reservations`, {
    method: "POST",
    body: formData,
  });
  const result = (await response.json()) as {
    bookingCode?: string;
    accessToken?: string;
    applicationStatus?: string;
    documentVerificationStatus?: string;
    paymentStatus?: string;
    error?: string;
  };

  if (
    !response.ok ||
    !result.bookingCode ||
    !result.accessToken ||
    !result.applicationStatus ||
    !result.documentVerificationStatus ||
    !result.paymentStatus
  ) {
    throw new Error(result.error || "Pengajuan reservasi gagal dikirim.");
  }

  return {
    bookingCode: result.bookingCode,
    accessToken: result.accessToken,
    applicationStatus: result.applicationStatus,
    documentVerificationStatus: result.documentVerificationStatus,
    paymentStatus: result.paymentStatus,
  };
}

export async function getCustomerReservationStatus(
  bookingCode: string,
  accessToken: string,
): Promise<CustomerReservationStatus> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (!backendUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL belum dikonfigurasi.");

  const response = await fetch(`${backendUrl}/api/reservations/${encodeURIComponent(bookingCode)}`, {
    headers: { "X-Application-Token": accessToken },
    cache: "no-store",
  });
  const result = (await response.json()) as CustomerReservationStatus & { message?: string };

  if (!response.ok) throw new Error(result.message || "Status reservasi tidak dapat dimuat.");
  return result;
}

export async function uploadManualPaymentProof(
  bookingCode: string,
  accessToken: string,
  file: File,
): Promise<{
  bookingCode: string;
  applicationStatus: string;
  paymentStatus: string;
  documents?: CustomerReservationDocument[];
}> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (!backendUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL belum dikonfigurasi.");

  const formData = new FormData();
  formData.append("access_token", accessToken);
  formData.append("payment_proof", file);
  const response = await fetch(`${backendUrl}/api/reservations/${encodeURIComponent(bookingCode)}/payment-proof`, {
    method: "POST",
    body: formData,
  });
  const result = (await response.json()) as {
    bookingCode?: string;
    applicationStatus?: string;
    paymentStatus?: string;
    documents?: CustomerReservationDocument[];
    message?: string;
  };

  if (!response.ok || !result.bookingCode || !result.applicationStatus || !result.paymentStatus) {
    throw new Error(result.message || "Bukti pembayaran gagal diunggah.");
  }

  return {
    bookingCode: result.bookingCode,
    applicationStatus: result.applicationStatus,
    paymentStatus: result.paymentStatus,
    documents: result.documents,
  };
}

export async function lookupReservation(
  bookingCode: string,
  identifier: string,
): Promise<{
  bookingCode: string;
  token: string;
  redirectUrl: string;
}> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (!backendUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL belum dikonfigurasi.");

  const response = await fetch(`${backendUrl}/api/reservations/lookup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingCode, identifier }),
  });
  const result = (await response.json()) as {
    bookingCode?: string;
    token?: string;
    redirectUrl?: string;
    message?: string;
  };

  if (!response.ok || !result.bookingCode || !result.token || !result.redirectUrl) {
    throw new Error(result.message || "Pengajuan tidak ditemukan. Periksa kembali Kode Booking dan No HP/Email.");
  }

  return {
    bookingCode: result.bookingCode,
    token: result.token,
    redirectUrl: result.redirectUrl,
  };
}

export const api = {
  birds,
  availability,
  submitReservationApplication,
  getCustomerReservationStatus,
  uploadManualPaymentProof,
  lookupReservation,
  getCatalogBirds,
  getHomepageBirds,
  getCatalogPairs,
  getHomepagePairs,
};

export default api;

