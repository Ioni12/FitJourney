import axios from "axios";

const apiUrl = "http://localhost:3000/api/user";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchUser = () => {
  const token = localStorage.getItem("token");

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        console.warn("Token expired");
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        return null;
      }

      return payload;
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      return null;
    }
  }
  return null;
};

export const createUser = async (userData) => {
  try {
    const response = await api.post("/create", userData);

    if (!response) {
      throw new Error("could not authenticate");
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data : "Network Error",
    };
  }
};

export const signInUser = async (email, password) => {
  try {
    const response = await api.post("/signin", { email, password });

    if (!response) {
      throw new Error("could not signin");
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data : "Network Error",
    };
  }
};

export const logOut = () => {
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
};

export default api;
