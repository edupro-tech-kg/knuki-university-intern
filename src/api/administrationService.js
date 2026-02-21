import apiClient from "./apiClient";

// 🔹 Получить список администрации
export const getAdministrationList = async () => {
  const { data } = await apiClient.get("/api/v1/administration/");
  return data;
};

// 🔹 Получить одного человека по id
export const getAdministrationById = async (id) => {
  const { data } = await apiClient.get(`/api/v1/administration/${id}/`);
  return data;
};