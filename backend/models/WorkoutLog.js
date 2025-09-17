const mongoose = require("mongoose");

const exerciseLogSchema = new mongoose.Schema({
  exerciseTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExerciseTemplate",
    required: true,
  },
  performedAt: {
    type: Date,
    default: Date.now,
  },
  reps: Number,
  time: Number,
});

const workoutLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // Add these new fields:
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkoutPlan",
  },
  workoutName: String, // "Full Body Foundation", etc.
  status: {
    type: String,
    enum: ["active", "paused", "completed"],
    default: "active",
  },
  exercises: [exerciseLogSchema],
});

const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema);

module.exports = WorkoutLog;
