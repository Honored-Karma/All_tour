import { ru, type Dictionary } from "./ru";
import { kz } from "./kz";
import type { Locale } from "../lib/whatsapp";

export const dictionaries: Record<Locale, Dictionary> = {
  ru,
  kz,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || ru;
}
