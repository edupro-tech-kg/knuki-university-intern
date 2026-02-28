import { apiClient } from './apiClient';

export default async function getOrganizations() {
    const res = await apiClient.get('/api/v1/students/organizations/', {
      timeout: 90_000
    });
    return res.data;
}