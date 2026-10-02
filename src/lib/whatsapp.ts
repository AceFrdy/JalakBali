const TEST_WHATSAPP_NUMBER = "082182579496";

export type WhatsAppRedirectResult = "redirected" | "missing";

/**
 * Builds the minimal WhatsApp message for a reservation.
 * Only includes booking code and customer name — all other data
 * stays in the backend and is accessible via Filament Admin Panel.
 */
export function buildReservationWhatsAppMessage(params: {
  bookingCode: string;
  customerName: string;
}): string {
  return (
    `Hallo, saya ingin mengajukan reservasi Jalak Bali.\n\n` +
    `Kode Pengajuan: ${params.bookingCode}\n` +
    `Nama: ${params.customerName}\n\n` +
    `Mohon informasi mengenai proses selanjutnya.`
  );
}

export function getWhatsAppUrl(
  phoneNumber: string | undefined,
  message: string
): string | null {
  const number =
    process.env.NODE_ENV === "development" ? TEST_WHATSAPP_NUMBER : phoneNumber;
  const digits = number?.replace(/\D/g, "");
  const normalizedNumber = digits?.startsWith("0")
    ? `62${digits.slice(1)}`
    : digits;

  if (!normalizedNumber) {
    return null;
  }

  return `https://api.whatsapp.com/send?phone=${normalizedNumber}&text=${encodeURIComponent(message)}`;
}

export function redirectToWhatsApp(
  phoneNumber: string | undefined,
  message: string,
  target: "_self" | "_blank" = "_self"
): WhatsAppRedirectResult {
  const url = getWhatsAppUrl(phoneNumber, message);

  if (!url) {
    return "missing";
  }

  if (target === "_blank") {
    const opened = window.open(url, "_blank");
    if (!opened) {
      window.location.assign(url);
    }
  } else {
    window.location.assign(url);
  }

  return "redirected";
}