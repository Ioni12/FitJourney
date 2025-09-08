const mongoose = require("mongoose");
const WorkoutLog = require("../models/WorkoutLog");
const ExerciseTemplate = require("../models/ExerciseTemplate");

const CreateExerciseTemplate = async (req, res) => {
  const { name, type } = req.body;
  try {
    if (!name || !type) {
      return res
        .status(400)
        .json({ success: false, message: "Name and type are required fields" });
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const existingTemplate = await ExerciseTemplate.findOne({
      name: name.trim(),
      user: userId,
    });

    if (existingTemplate) {
      return res.status(409).json({
        success: false,
        message: "Exercise template with this name already exists",
      });
    }

    const newExerciseTemplate = await ExerciseTemplate.create({
      name: name.trim(),
      type: type,
      user: userId,
    });

    await newExerciseTemplate.save();

    res.status(201).json({
      success: true,
      message: "Exercise template created successfully",
      data: newExerciseTemplate,
    });
  } catch (error) {
    console.error("Error creating exercise template:", error);

    // Handle specific mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors,
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Exercise template already exists",
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const GetExerciseTemplates = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const templates = await ExerciseTemplate.find({ user: userId })
      .select("name type")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Templates retrieved successfully",
      data: templates,
    });
  } catch (error) {
    console.error("Error fetching workout templates:", error);

    // Handle cast errors (invalid ObjectId)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const DeleteExerciseTemplate = async (req, res) => {
  try {
    const userId = req.user?.id;
    const templateId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const result = await ExerciseTemplate.findOneAndDelete({
      _id: templateId,
      user: userId,
    });

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "the exercise could not be deleted" });
    }

    return res
      .status(200)
      .json({ success: true, message: "the exercise was deleted successfuly" });
  } catch (error) {
    console.error("Error deleting exercise template:", error);

    // Handle cast errors (invalid ObjectId)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid template ID format",
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  CreateExerciseTemplate,
  GetExerciseTemplates,
  DeleteExerciseTemplate,
};
