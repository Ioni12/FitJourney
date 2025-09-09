import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL + "/exercises";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set up request interceptor to add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const logExercise = async (templateId, exerciseData) => {
  try {
    console.log("Sending to server:");
    console.log("Template ID:", templateId);
    console.log("Exercise Data:", exerciseData);

    const res = await api.post(`/logExercise/${templateId}`, exerciseData);

    if (!res) {
      throw new Error("no data");
    }
    console.log("Server response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Request failed:", error.response?.data || error.message);
    throw error; // Re-throw so the UI can handle it
  }
};

export const getExerciseLogs = async () => {
  try {
    const res = await api.get("/logs");

    if (!res) {
      throw new Error("no exercise logs");
    }

    return res.data;
  } catch (error) {
    onsole.error("Request failed:", error.response?.data || error.message);
    throw error;
  }
};
