import axios from "axios";
import env from "../config/env";

const API_BASE = `${env.apiBaseUrl}/admin-panel`;

export const verifyAdminCode = async (code) => {
  try {
    const response = await axios.post(`${API_BASE}/verify-code`, { code });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminStats = async (token) => {
  try {
    const response = await axios.get(`${API_BASE}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminUsersWithTrips = async (token) => {
  try {
    const response = await axios.get(`${API_BASE}/users-with-trips`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminTrips = async (token) => {
  try {
    const response = await axios.get(`${API_BASE}/trips`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeAdminUser = async (token, id) => {
  try {
    const response = await axios.delete(`${API_BASE}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
