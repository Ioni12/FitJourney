import axios from "axios";

const API_URL = "http://localhost:3000/api/exercises";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const createTemplate = async (templateData) => {
  try {
    const res = await api.post("/createTemplate", templateData);

    if (!res) {
      console.log("no response");
    }

    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create template" };
  }
};

export const getTemplates = async () => {
  try {
    const res = await api.get("/getTemplates");

    if (!res) {
      console.log("no response");
    }

    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch templates" };
  }
};

export const deleteTemplate = async (templateId) => {
  try {
    const res = await api.delete(`/deleteTemplate/${templateId}`);

    if (!res) {
      console.log("no response");
    }

    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete template" };
  }
};
