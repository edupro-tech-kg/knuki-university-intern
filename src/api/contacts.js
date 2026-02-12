import { apiClient } from "./apiClient";

export async function sendContactMessage({ name, phone, faculty, message }) {
  const payload = {
    name,
    phone,
    faculty,
    message,
  };

  const response = await apiClient.post("/api/v1/contacts/messages/", payload, {
    // Render/free-tier cold starts can exceed the default 30s.
    timeout: 90_000,
  });
  return response.data;
}
