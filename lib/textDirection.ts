const ARABIC_CHARS =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
const LATIN_CHARS = /[A-Za-z]/g;

/**
 * Direction of the text itself, so Arabic shown as a fallback on the English
 * site still reads right-to-left. Falls back to the page locale when the text
 * has no letters to judge by.
 */
export const getTextDir = (
  text: string | null | undefined,
  fallbackLang = "ar",
): "rtl" | "ltr" => {
  const plain = (text ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ");

  const arabicCount = plain.match(ARABIC_CHARS)?.length ?? 0;
  const latinCount = plain.match(LATIN_CHARS)?.length ?? 0;

  if (arabicCount === 0 && latinCount === 0) {
    return fallbackLang === "ar" ? "rtl" : "ltr";
  }

  return arabicCount >= latinCount ? "rtl" : "ltr";
};
