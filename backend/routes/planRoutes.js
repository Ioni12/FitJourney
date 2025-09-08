const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  generateExercisePlan,
  getUserWorkoutPlans,
  getWorkoutPlanById,
  deleteWorkoutPlan,
  regenerateWorkoutPlan,
  sendData,
} = require("../controllers/planGeneratorController");

router.post("/generate", generateExercisePlan);
router.post("/send", protect, sendData);
router.get("/", protect, getUserWorkoutPlans);
router.get("/:planId", getWorkoutPlanById);
router.delete("/:planId", deleteWorkoutPlan);
router.post("/:planId/regenerate", regenerateWorkoutPlan);

module.exports = router;
