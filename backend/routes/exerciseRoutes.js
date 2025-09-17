const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  logExercise,
  getExerciseLogs,
  startWorkoutFromPlan,
  pauseWorkout,
  resumeWorkout,
  completeWorkout,
} = require("../controllers/exerciseLogController");
const {
  CreateExerciseTemplate,
  GetExerciseTemplates,
  DeleteExerciseTemplate,
} = require("../controllers/exerciseController");

router.use(protect);

// Exercise Template Routes
router.post("/createTemplate", CreateExerciseTemplate);
router.get("/getTemplates", GetExerciseTemplates);
router.delete("/deleteTemplate/:id", DeleteExerciseTemplate);

// Exercise Log Routes (existing)
router.post("/logExercise/:id", logExercise);
router.get("/logs", getExerciseLogs);

// Workout Session Management Routes (from your controller)
router.post("/workout/start", startWorkoutFromPlan); // Start workout from plan
router.patch("/workout/:workoutLogId/pause", pauseWorkout); // Pause workout
router.patch("/workout/:workoutLogId/resume", resumeWorkout); // Resume workout
router.patch("/workout/:workoutLogId/complete", completeWorkout); // Complete workout

module.exports = router;
