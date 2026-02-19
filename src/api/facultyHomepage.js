import { apiClient } from "./apiClient";


export async function getFacultiesHomepage() {
  const response = await apiClient.get("/api/v1/faculties/homepage/");
  return response.data;
}
