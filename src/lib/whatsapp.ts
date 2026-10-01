const MOCK_WHATSAPP_NUMBER = "0000000000";

export type WhatsAppRedirectResult = "mocked" | "redirected" | "missing";

export function redirectToWhatsApp(
  phoneNumber: string | undefined,
  message: string
): WhatsAppRedirectResult {
  const normalizedNumber = phoneNumber?.replace(/\D/g, "");

  if (!normalizedNumber) {
    if (process.env.NODE_ENV === "production") return "missing";

    const mockUrl = `https://api.whatsapp.com/send?phone=${MOCK_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    console.info("[WhatsApp mock redirect]", mockUrl);
    return "mocked";
  }

  const url = `https://api.whatsapp.com/send?phone=${normalizedNumber}&text=${encodeURIComponent(message)}`;

  window.location.assign(url);
  return "redirected";
}