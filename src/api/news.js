import { apiClient } from "./apiClient";

export async function getNews() {
    const res = await apiClient.get("/api/v1/news/");
    return res.data;
} 