import axios from "axios";
import i18n from "../i18n/config";

const DEFAULT_BASE_URL = "https://knuki-university-backend.onrender.com";

function normalizeBaseUrl(url) {
  if (!url) return DEFAULT_BASE_URL;
  return url.replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
  timeout: 30_000,
});

function getLocale() {
  return i18n?.resolvedLanguage || i18n?.language || "ky";
}

apiClient.interceptors.request.use((config) => {
  const locale = getLocale();
  if (!locale) return config;

  const headers = config.headers;
  const hasAxiosHeaderSet = headers && typeof headers.set === "function";
  if (hasAxiosHeaderSet) headers.set("Accept-Language", locale);
  else config.headers = { ...(headers || {}), "Accept-Language": locale };

  return config;
});

export default apiClient;
