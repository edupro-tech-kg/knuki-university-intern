import { apiClient } from './apiClient';

export async function getStudents() {
    const res = await apiClient.get('/api/v1/students/',{
        timeout: 90_000,
    });
    return res.data;
}