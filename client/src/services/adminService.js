import api from "./api";

export const getAdminStats = async () => {
  const { data } = await api.get("/admin/stats");
  return data;
};

export const getAdminUsers = async () => {
  const { data } = await api.get("/admin/users");
  return data;
};

export const getAdminTrips = async () => {
  const { data } = await api.get("/admin/trips");
  return data;
};

export const removeUserByAdmin = async (id) => {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
};

export const removeTripByAdmin = async (id) => {
  const { data } = await api.delete(`/admin/trips/${id}`);
  return data;
};
