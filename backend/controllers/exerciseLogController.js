const mongoose = require("mongoose");
const WorkoutLog = require("../models/WorkoutLog");
const ExerciseTemplate = require("../models/ExerciseTemplate");

const logExercise = async (req, res) => {
  const templateId = req.params.id;
  const { reps, time } = req.body;
  try {
    const userId = req.user?.id;

    if (!templateId) {
      return res
        .status(400)
        .json({ success: false, message: "no template id" });
    }

    const existingTemplate = await ExerciseTemplate.findOne({
      _id: templateId,
      user: userId,
    });

    if (!existingTemplate) {
      return res.status(400).json({ success: false, message: "no exercise" });
    }

    let workoutLog = await WorkoutLog.findOne({
      user: userId,
      date: { $gte: new Date().setHours(0, 0, 0, 0) },
    });

    if (!workoutLog) {
      workoutLog = new WorkoutLog({ user: userId, exercises: [] });
    }

    // push a new exercise log entry
    workoutLog.exercises.push({
      exerciseTemplate: templateId,
      reps,
      time,
    });

    await workoutLog.save();

    return res.status(201).json({
      success: true,
      message: "Exercise logged successfully",
      workoutLog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getExerciseLogs = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const exerciseLogs = await WorkoutLog.find({ user: userId })
      .populate("exercises.exerciseTemplate", "name type")
      .sort({ date: -1 });

    return res.status(200).json({ success: true, data: exerciseLogs });
  } catch (error) {
    console.error("Error fetching exercise logs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { logExercise, getExerciseLogs };
