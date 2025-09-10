import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: apiUrl,
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

export const getDashboardData = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.period) params.append("period", filters.period);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const queryString = params.toString();
    const url = queryString
      ? `/dashboard/stats?${queryString}`
      : "/dashboard/stats";

    const response = await api.get(url);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data : "Network Error",
    };
  }
};
