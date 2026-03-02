// export const getAccounting = async () => {
//   try {
//     const res = await fetch("/api/v1/accounting/pricing");
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error("Ошибка API:", error);
//     return [];
//   }
// };
import { apiClient } from './apiClient'

export async function getAccounting() {
    const res = await apiClient.get('/api/v1/accounting/pricing/',{
        timeout: 90_000,
    });
    return res.data
}