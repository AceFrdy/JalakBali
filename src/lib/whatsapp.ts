const TEST_WHATSAPP_NUMBER = "082182579496";

export type WhatsAppRedirectResult = "redirected" | "missing";

export function redirectToWhatsApp(
  phoneNumber: string | undefined,
  message: string
): WhatsAppRedirectResult {
  const number =
    process.env.NODE_ENV === "development" ? TEST_WHATSAPP_NUMBER : phoneNumber;
  const digits = number?.replace(/\D/g, "");
  const normalizedNumber = digits?.startsWith("0")
    ? `62${digits.slice(1)}`
    : digits;

  if (!normalizedNumber) {
    return "missing";
  }

  const url = `https://api.whatsapp.com/send?phone=${normalizedNumber}&text=${encodeURIComponent(message)}`;

  window.location.assign(url);
  return "redirected";
}