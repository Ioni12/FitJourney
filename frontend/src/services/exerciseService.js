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

// Existing exercise logging functions
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
    console.error("Request failed:", error.response?.data || error.message);
    throw error;
  }
};

// Workout Session Management Functions
export const startWorkoutFromPlan = async (planId, workoutIndex) => {
  try {
    console.log("Starting workout from plan:", { planId, workoutIndex });

    const res = await api.post("/workout/start", {
      planId,
      workoutIndex,
    });

    if (!res) {
      throw new Error("Failed to start workout");
    }

    console.log("Workout started:", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "Failed to start workout:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const pauseWorkout = async (workoutLogId) => {
  try {
    console.log("Pausing workout:", workoutLogId);

    const res = await api.patch(`/workout/${workoutLogId}/pause`);

    if (!res) {
      throw new Error("Failed to pause workout");
    }

    console.log("Workout paused:", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "Failed to pause workout:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const resumeWorkout = async (workoutLogId) => {
  try {
    console.log("Resuming workout:", workoutLogId);

    const res = await api.patch(`/workout/${workoutLogId}/resume`);

    if (!res) {
      throw new Error("Failed to resume workout");
    }

    console.log("Workout resumed:", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "Failed to resume workout:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const completeWorkout = async (workoutLogId) => {
  try {
    console.log("Completing workout:", workoutLogId);

    const res = await api.patch(`/workout/${workoutLogId}/complete`);

    if (!res) {
      throw new Error("Failed to complete workout");
    }

    console.log("Workout completed:", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "Failed to complete workout:",
      error.response?.data || error.message
    );
    throw error;
  }
};
