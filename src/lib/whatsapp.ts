export const WHATSAPP_NUMBER = "16135137243";
export const WHATSAPP_DISPLAY = "+1 613-513-7243";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
