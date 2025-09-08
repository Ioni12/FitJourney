const mongoose = require("mongoose");

const exerciseTemplateSchema = new mongoose.Schema({
  name: String,
  type: {
    type: String,
    enum: ["reps", "time", "distance", "weight", "calories", "custom", "other"],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const ExerciseTemplate = mongoose.model(
  "ExerciseTemplate",
  exerciseTemplateSchema
);

module.exports = ExerciseTemplate;
