export type LocalizedText = {
  ar?: string;
  en?: string;
};

const pickText = (value?: string | null) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

/**
 * Prefer the active locale, then Arabic, then English, then an optional fallback.
 * Ensures EN site still shows AR content when English is missing.
 */
export const getLocalizedText = (
  value: LocalizedText | string | null | undefined,
  fallback?: string | null,
  lang = "ar",
): string => {
  if (typeof value === "string") {
    const text = pickText(value);
    if (text) return text;
  } else if (value && typeof value === "object" && !Array.isArray(value)) {
    const preferred = pickText(value[lang as keyof LocalizedText]);
    if (preferred) return preferred;

    const arabic = pickText(value.ar);
    if (arabic) return arabic;

    const english = pickText(value.en);
    if (english) return english;
  }

  return pickText(fallback);
};

export const getMixedText = (
  value: LocalizedText | string | null | undefined,
  fallback?: string | null,
  lang = "ar",
) => {
  if (typeof value === "string") {
    const text = pickText(value);
    if (text) return text;
    return pickText(fallback);
  }

  return getLocalizedText(value, fallback, lang);
};
