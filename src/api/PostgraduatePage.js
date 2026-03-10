import { apiClient } from "./apiClient";

export async function getPostgraduatePage(pageType) {
  const response = await apiClient.get(`/api/v1/postgraduate/pages/${pageType}/`);
  return response.data;
}