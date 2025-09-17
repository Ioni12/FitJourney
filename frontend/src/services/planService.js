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

// Existing workout plan functions
export const generateExercisePlan = async (planData) => {
  try {
    const response = await api.post("/plan/generate", planData);

    if (!response) {
      throw new Error("failed to generate exercises");
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

export const sendData = async (formData) => {
  try {
    const res = await api.post("/plan/send", formData);

    if (!res) {
      throw new Error("Failed to send data to webhook");
    }

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.error("Error sending data:", error);
    return {
      success: false,
      error: error.response ? error.response.data : "Network Error",
    };
  }
};

export const getWorkoutPlans = async () => {
  try {
    const response = await api.get("/plan/");

    if (!response) {
      throw new Error("Failed to fetch workout plans");
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

// Workout Session Management Functions
export const startWorkoutFromPlan = async (planId, workoutIndex) => {
  try {
    const response = await api.post("/exercises/workout/start", {
      planId,
      workoutIndex,
    });

    if (!response) {
      throw new Error("Failed to start workout");
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

export const pauseWorkout = async (workoutLogId) => {
  try {
    const response = await api.patch(
      `/exercises/workout/${workoutLogId}/pause`
    );

    if (!response) {
      throw new Error("Failed to pause workout");
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

export const resumeWorkout = async (workoutLogId) => {
  try {
    const response = await api.patch(
      `/exercises/workout/${workoutLogId}/resume`
    );

    if (!response) {
      throw new Error("Failed to resume workout");
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

export const completeWorkout = async (workoutLogId) => {
  try {
    const response = await api.patch(
      `/exercises/workout/${workoutLogId}/complete`
    );

    if (!response) {
      throw new Error("Failed to complete workout");
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
