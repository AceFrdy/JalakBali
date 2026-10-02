import { ReservationDocument } from "@/types";

export const INITIAL_DOCUMENTS_TEMPLATE: ReservationDocument[] = [
  {
    id: "doc-identity",
    title: "Dokumen Identitas (KTP)",
    description: "KTP pengelola aviari terdaftar untuk verifikasi identitas.",
    required: true,
    status: "not_uploaded",
  },
];
