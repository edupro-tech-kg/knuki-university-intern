import { apiClient } from "./apiClient";

export async function getScholarship() {
    const res = await apiClient.get("/api/v1/students/", {
    timeout: 90_000,
});
    return res.data;
}