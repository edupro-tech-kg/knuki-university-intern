import { apiClient } from "./apiClient";

export async function getFaculty() {
    const response = await apiClient.get("/api/v1/faculties/");
    return response.data;
}