const mongoose = require("mongoose");
const ExerciseTemplate = require("../models/ExerciseTemplate");
const WorkoutPlan = require("../models/WorkoutPlan");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

const generateWebhookToken = () => {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { algorithm: "HS256" });
};

const sendData = async (req, res) => {
  const token = generateWebhookToken();

  try {
    const userId = req.user?.id;
    const {
      fitnessLevel,
      goals,
      equipment,
      days_per_week,
      session_duration,
      preferred_exercise_types,
      excluded_exercises,
      injuries,
    } = req.body;

    const data = {
      fitnessLevel,
      goals,
      equipment,
      days_per_week,
      session_duration,
      preferred_exercise_types,
      excluded_exercises,
      injuries,
      userId,
    };

    if (!N8N_WEBHOOK_URL) {
      console.error("N8N_WEBHOOK_URL is not configured");
      return res.status(500).json({
        success: false,
        error: "Webhook URL not configured",
      });
    }

    const response = await axios.post(N8N_WEBHOOK_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 second timeout
    });

    return res.json({
      success: true,
      message: "Data sent to N8N webhook successfully",
      response: response.data,
    });
  } catch (error) {
    console.log(error);
  }
};

const generateExercisePlan = async (req, res) => {
  try {
    const userId = req.headers["id"];
    const data = req.body;

    if (!data) {
      return res.status(400).json({ success: false });
    }

    const exerciseTemplates = new Map();

    const allExercises = new Set();

    data.workouts?.forEach((workout) => {
      workout.exercises?.forEach((exercise) => {
        allExercises.add(exercise.exerciseName);
      });
    });

    for (const exerciseName of allExercises) {
      const existingTemplate = await ExerciseTemplate.findOne({
        name: exerciseName,
        user: userId,
      });

      if (!existingTemplate) {
        const newTemplate = new ExerciseTemplate({
          name: exerciseName,
          type: "reps",
          user: userId,
        });

        const savedTemplate = await newTemplate.save();
        exerciseTemplates.set(exerciseName, savedTemplate._id);
      } else {
        exerciseTemplates.set(exerciseName, existingTemplate._id);
      }
    }

    const processedWorkouts = data.workouts?.map((workout) => ({
      name: workout.name,
      description: workout.description,
      dayOfWeek: workout.dayOfWeek,
      difficulty: workout.difficulty,
      estimatedDuration: workout.estimatedDuration,
      exercises: workout.exercises?.map((exercise) => ({
        exerciseTemplate: exerciseTemplates.get(exercise.exerciseName),
        sets: exercise.sets,
        targetReps: exercise.targetReps,
        targetTime: exercise.targetTime,
        restTime: exercise.restTime,
        notes: exercise.notes,
      })),
    }));

    const preferences = {
      goals: Array.isArray(data.preferences?.goals)
        ? data.preferences.goals
        : typeof data.preferences?.goals === "string"
        ? data.preferences.goals.split(",").map((g) => g.trim())
        : [],
      fitnessLevel: data.preferences?.fitnessLevel || "",
      daysPerWeek: data.preferences?.daysPerWeek,
      sessionDuration: data.preferences?.sessionDuration,
      preferredExerciseTypes: Array.isArray(
        data.preferences?.preferredExerciseTypes
      )
        ? data.preferences.preferredExerciseTypes
        : typeof data.preferences?.preferredExerciseTypes === "string"
        ? data.preferences.preferredExerciseTypes
            .split(",")
            .map((t) => t.trim())
        : [],
      excludedExercises: Array.isArray(data.preferences?.excludedExercises)
        ? data.preferences.excludedExercises
        : typeof data.preferences?.excludedExercises === "string"
        ? data.preferences.excludedExercises.split(",").map((e) => e.trim())
        : [],
      injuries: Array.isArray(data.preferences?.injuries)
        ? data.preferences.injuries
        : typeof data.preferences?.injuries === "string"
        ? data.preferences.injuries.split(",").map((i) => i.trim())
        : [],
      equipment: Array.isArray(data.preferences?.equipment)
        ? data.preferences.equipment
        : typeof data.preferences?.equipment === "string"
        ? data.preferences.equipment.split(",").map((e) => e.trim())
        : [],
    };

    const workoutPlan = new WorkoutPlan({
      user: userId,
      name: data.name,
      description: data.description,
      duration: data.duration,
      daysPerWeek: data.daysPerWeek,
      workouts: processedWorkouts,
      preferences: preferences,
    });

    const savedWorkoutPlan = await workoutPlan.save();

    // Populate the exercise templates for the response
    await savedWorkoutPlan.populate("workouts.exercises.exerciseTemplate");

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error("Error processing workout data:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getUserWorkoutPlans = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    if (!userId) {
      return res.status(400).json({ success: false, message: "no user" });
    }

    const workoutPlans = await WorkoutPlan.find({ user: userId })
      .populate("workouts.exercises.exerciseTemplate")
      .sort({ generatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await WorkoutPlan.countDocuments({ user: userId });

    res.status(200).json({
      workoutPlans,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getWorkoutPlanById = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;

    const workoutPlan = await WorkoutPlan.findOne({
      _id: planId,
      user: userId,
    }).populate("workouts.exercises.exerciseTemplate");

    if (!workoutPlan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }

    res.status(200).json({ workoutPlan });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteWorkoutPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;

    const workoutPlan = await WorkoutPlan.findOneAndDelete({
      _id: planId,
      user: userId,
    });

    if (!workoutPlan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }

    res.status(200).json({
      message: "Workout plan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const regenerateWorkoutPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;

    const existingPlan = await WorkoutPlan.findOne({
      _id: planId,
      user: userId,
    });

    if (!existingPlan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }

    // Get all current exercise templates (including any new ones created since original plan)
    const exerciseTemplates = await ExerciseTemplate.find({ user: userId });

    // Use the existing preferences to regenerate
    const n8nPayload = {
      userId,
      preferences: existingPlan.preferences,
      existingExercises: exerciseTemplates.map((template) => ({
        id: template._id,
        name: template.name,
        type: template.type,
        muscleGroups: template.muscleGroups || [],
        equipment: template.equipment || [],
        description: template.description,
        instructions: template.instructions,
      })),
      shouldCreateNewExercises: true, // Allow creating new exercises during regeneration
    };

    const n8nResponse = await axios.post(N8N_WEBHOOK_URL, n8nPayload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 60000,
    });

    const generatedPlan = n8nResponse.data;

    // Handle any new exercise templates from regeneration
    let newExerciseTemplates = [];
    if (
      generatedPlan.newExerciseTemplates &&
      generatedPlan.newExerciseTemplates.length > 0
    ) {
      const templatesToSave = generatedPlan.newExerciseTemplates.map(
        (template) => ({
          user: userId,
          name: template.name,
          type: template.type || "strength",
          muscleGroups: template.muscleGroups || [],
          equipment: template.equipment || [],
          description: template.description || "",
          instructions: template.instructions || "",
          difficulty:
            template.difficulty || existingPlan.preferences.fitnessLevel,
          isAIGenerated: true,
          createdAt: new Date(),
        })
      );

      try {
        newExerciseTemplates = await ExerciseTemplate.insertMany(
          templatesToSave
        );
      } catch (saveError) {
        console.error(
          "Error saving new exercise templates during regeneration:",
          saveError
        );
      }
    }

    // Process the workouts with new exercise templates
    const processedWorkouts = generatedPlan.workouts.map((workout) => ({
      ...workout,
      exercises: workout.exercises.map((exercise) => {
        if (exercise.isNewTemplate && exercise.tempId) {
          const matchingNewTemplate = newExerciseTemplates.find(
            (template) => template.name === exercise.templateName
          );
          if (matchingNewTemplate) {
            return {
              ...exercise,
              exerciseTemplate: matchingNewTemplate._id,
            };
          }
        }
        return exercise;
      }),
    }));

    // Update the existing plan
    existingPlan.workouts = processedWorkouts;
    existingPlan.description =
      generatedPlan.description || existingPlan.description;
    existingPlan.generatedAt = new Date();

    await existingPlan.save();
    await existingPlan.populate("workouts.exercises.exerciseTemplate");

    res.status(200).json({
      message: "Exercise plan regenerated successfully",
      workoutPlan: existingPlan,
      newExerciseTemplatesCreated: newExerciseTemplates.length,
    });
  } catch (error) {
    console.error("Error regenerating exercise plan:", error);
    res.status(500).json({
      message: "Server error while regenerating exercise plan",
      error: error.message,
    });
  }
};

module.exports = {
  generateExercisePlan,
  getUserWorkoutPlans,
  getWorkoutPlanById,
  deleteWorkoutPlan,
  regenerateWorkoutPlan,
  sendData,
};
