const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  logExercise,
  getExerciseLogs,
} = require("../controllers/exerciseLogController");
const {
  CreateExerciseTemplate,
  GetExerciseTemplates,
  DeleteExerciseTemplate,
} = require("../controllers/exerciseController");

router.use(protect);

router.post("/createTemplate", CreateExerciseTemplate);
router.get("/getTemplates", GetExerciseTemplates);
router.delete("/deleteTemplate/:id", DeleteExerciseTemplate);

router.post("/logExercise/:id", logExercise);
router.get("/logs", getExerciseLogs);

module.exports = router;
