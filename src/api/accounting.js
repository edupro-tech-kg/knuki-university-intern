import { apiClient } from './apiClient'

export async function getAccounting() {
    const res = await apiClient.get('/api/v1/accounting/pricing/',{
        timeout: 90_000,
    });
    return res.data
}