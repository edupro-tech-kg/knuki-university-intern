import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultLocale, translations } from "../locales";

const resources = {
  ru: { translation: translations.ru },
  en: { translation: translations.en },
  ky: { translation: translations.ky },
};

const LANGUAGE_STORAGE_KEY = "preferred-language";

function normalizeLocale(value) {
  if (!value || typeof value !== "string") return null;
  const lower = value.toLowerCase().replace("_", "-").trim();
  const base = lower.split("-")[0];
  if (!base) return null;
  if (base === "kg") return "ky";
  return base;
}

function getStoredLocale() {
  if (typeof window === "undefined") return null;
  try {
    return normalizeLocale(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return null;
  }
}

function getNavigatorLocale() {
  if (typeof navigator === "undefined") return null;
  const raw =
    (Array.isArray(navigator.languages) && navigator.languages[0]) || navigator.language || null;
  return normalizeLocale(raw);
}

function getInitialLocale() {
  const supported = Object.keys(resources);
  const stored = getStoredLocale();
  if (stored && supported.includes(stored)) return stored;

  const browser = getNavigatorLocale();
  if (browser && supported.includes(browser)) return browser;

  return defaultLocale;
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLocale(),
    fallbackLng: "ky",
    interpolation: { escapeValue: false },
    returnObjects: true,
    initImmediate: false,
  })
  .catch((err) => console.error("i18n init error", err));

if (typeof window !== "undefined") {
  i18n.on("languageChanged", (lng) => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    } catch {
      // ignore storage errors (private mode, blocked storage, etc.)
    }
  });
}

export default i18n;
