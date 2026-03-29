import api from "./api";

export const generateTripPlan = async (payload) => {
  const { data } = await api.post("/trips/generate", payload);
  return data;
};

export const saveTripPlan = async (payload) => {
  const { data } = await api.post("/trips/save", payload);
  return data;
};

export const getSavedTrips = async () => {
  const { data } = await api.get("/trips");
  return data;
};

export const deleteSavedTrip = async (id) => {
  const { data } = await api.delete(`/trips/${id}`);
  return data;
};
