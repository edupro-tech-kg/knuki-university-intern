import { apiClient } from './apiClient';

export async function getDocuments() {
    const res = await apiClient.get('/api/v1/documents', {
        timeout: 90_000,
    });
    return res.data;
}