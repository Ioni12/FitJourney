const mongoose = require("mongoose");
const WorkoutLog = require("../models/WorkoutLog");
const ExerciseTemplate = require("../models/ExerciseTemplate");

const logExercise = async (req, res) => {
  const templateId = req.params.id;
  const { reps, time, workoutLogId } = req.body; // Add workoutLogId
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

    let workoutLog;

    // If workoutLogId provided, use that specific workout session
    if (workoutLogId) {
      workoutLog = await WorkoutLog.findOne({
        _id: workoutLogId,
        user: userId,
        status: "active",
      });

      if (!workoutLog) {
        return res.status(404).json({
          success: false,
          message: "Active workout session not found",
        });
      }
    } else {
      // Your existing logic for daily logging
      workoutLog = await WorkoutLog.findOne({
        user: userId,
        date: { $gte: new Date().setHours(0, 0, 0, 0) },
      });

      if (!workoutLog) {
        workoutLog = new WorkoutLog({ user: userId, exercises: [] });
      }
    }

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

const startWorkoutFromPlan = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { planId, workoutIndex } = req.body;

    const workoutPlan = await WorkoutPlan.findOne({
      _id: planId,
      user: userId,
    });

    if (!workoutPlan || !workoutPlan.workouts[workoutIndex]) {
      return res
        .status(404)
        .json({ success: false, message: "Workout not found" });
    }

    const selectedWorkout = workoutPlan.workouts[workoutIndex];

    const workoutLog = new WorkoutLog({
      user: userId,
      planId: planId,
      workoutName: selectedWorkout.name,
      status: "active",
      exercises: [],
    });

    await workoutLog.save();

    res.json({
      success: true,
      workoutLogId: workoutLog._id,
      workoutName: selectedWorkout.name,
      message: "Workout session started from plan",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const pauseWorkout = async (req, res) => {
  try {
    const { workoutLogId } = req.params;
    const userId = req.user?.id;

    await WorkoutLog.findOneAndUpdate(
      { _id: workoutLogId, user: userId },
      { status: "paused" }
    );

    res.json({ success: true, message: "Workout paused" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const resumeWorkout = async (req, res) => {
  try {
    const { workoutLogId } = req.params;
    const userId = req.user?.id;

    await WorkoutLog.findOneAndUpdate(
      { _id: workoutLogId, user: userId },
      { status: "active" }
    );

    res.json({ success: true, message: "Workout resumed" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const completeWorkout = async (req, res) => {
  try {
    const { workoutLogId } = req.params;
    const userId = req.user?.id;

    await WorkoutLog.findOneAndUpdate(
      { _id: workoutLogId, user: userId },
      { status: "completed" }
    );

    res.json({ success: true, message: "Workout completed" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  logExercise,
  getExerciseLogs,
  completeWorkout,
  resumeWorkout,
  pauseWorkout,
  startWorkoutFromPlan,
};
