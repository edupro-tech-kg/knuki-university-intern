import { apiClient } from "./apiClient";

export async function getScholarship(type) {
    const res = await apiClient.get(`/api/v1/students/${type}`, {
    timeout: 90_000,
});
    return res.data;
}