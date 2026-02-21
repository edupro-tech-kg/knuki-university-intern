import { apiClient } from "./apiClient"

export async function getNews() {
     const response = await apiClient.get("/api/v1/news",  {
 
    timeout: 90_000,
  });
  return response.data;
}