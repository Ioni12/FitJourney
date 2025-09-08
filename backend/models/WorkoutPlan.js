const mongoose = require("mongoose");

const workoutExerciseSchema = new mongoose.Schema({
  exerciseTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExerciseTemplate",
    required: true,
  },
  sets: {
    type: Number,
    default: 1,
  },
  targetReps: Number,
  targetTime: Number,
  restTime: Number,
  notes: String,
});

const workoutSessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  dayOfWeek: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  exercises: [workoutExerciseSchema],
  estimatedDuration: Number,
  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Intermediate",
  },
});

const workoutPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  duration: {
    type: Number, // Duration in weeks
    default: 4,
  },
  daysPerWeek: {
    type: Number,
    default: 3,
  },
  workouts: [workoutSessionSchema],
  preferences: {
    goals: [String], // e.g., ['weight_loss', 'muscle_gain', 'endurance']
    fitnessLevel: {
      type: String,
    },
    daysPerWeek: Number,
    sessionDuration: Number, // in minutes
    preferredExerciseTypes: [String],
    excludedExercises: [String],
    injuries: [String],
    equipment: [String],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

workoutPlanSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);

module.exports = WorkoutPlan;
