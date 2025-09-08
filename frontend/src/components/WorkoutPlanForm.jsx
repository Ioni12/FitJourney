import React, { useState } from "react";
import {
  User,
  Target,
  Dumbbell,
  Calendar,
  Clock,
  Activity,
  X,
  AlertTriangle,
} from "lucide-react";
import { sendData, getWorkoutPlans } from "../services/planService";

const WorkoutPlanForm = () => {
  const [formData, setFormData] = useState({
    fitnessLevel: "",
    goals: [],
    equipment: [],
    days_per_week: "",
    session_duration: "",
    preferred_exercise_types: [],
    excluded_exercises: "",
    injuries: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  const fitnessLevels = [
    { value: "beginner", label: "BEGINNER" },
    { value: "intermediate", label: "INTERMEDIATE" },
    { value: "advanced", label: "ADVANCED" },
  ];

  const goalOptions = [
    "WEIGHT LOSS",
    "MUSCLE GAIN",
    "STRENGTH BUILDING",
    "ENDURANCE",
    "FLEXIBILITY",
    "GENERAL FITNESS",
    "ATHLETIC PERFORMANCE",
  ];

  const equipmentOptions = [
    "NO EQUIPMENT",
    "DUMBBELLS",
    "BARBELL",
    "RESISTANCE BANDS",
    "PULL-UP BAR",
    "KETTLEBELLS",
    "GYM ACCESS",
    "YOGA MAT",
    "MEDICINE BALL",
    "CABLE MACHINE",
  ];

  const exerciseTypes = [
    "CARDIO",
    "WEIGHT TRAINING",
    "BODYWEIGHT",
    "HIIT",
    "YOGA",
    "PILATES",
    "FUNCTIONAL TRAINING",
    "PLYOMETRICS",
    "STRETCHING",
  ];

  const sessionDurations = [
    { value: 20, label: "15-30 MINUTES" },
    { value: 35, label: "30-45 MINUTES" },
    { value: 50, label: "45-60 MINUTES" },
    { value: 75, label: "60-90 MINUTES" },
    { value: 90, label: "90+ MINUTES" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await sendData(formData);

      if (response.success) {
        setSubmitStatus({
          type: "success",
          message:
            "✅ WORKOUT PLAN SUBMITTED SUCCESSFULLY! FETCHING YOUR PERSONALIZED PLAN...",
        });

        // Reset form
        setFormData({
          fitnessLevel: "",
          goals: [],
          equipment: [],
          days_per_week: "",
          session_duration: "",
          preferred_exercise_types: [],
          excluded_exercises: "",
          injuries: "",
        });

        // Fetch the workout plan
        setIsLoadingPlan(true);
        try {
          const planResponse = await getWorkoutPlans();
          if (
            planResponse.success &&
            planResponse.data &&
            planResponse.data.length > 0
          ) {
            setWorkoutPlan(planResponse.data[0]);
            setSubmitStatus({
              type: "success",
              message: "✅ YOUR PERSONALIZED WORKOUT PLAN IS READY!",
            });
          } else {
            setSubmitStatus({
              type: "warning",
              message:
                "⚠️ PLAN SUBMITTED SUCCESSFULLY, BUT COULD NOT FETCH THE GENERATED PLAN. PLEASE REFRESH THE PAGE.",
            });
          }
        } catch (planError) {
          console.error("Error fetching workout plan:", planError);
          setSubmitStatus({
            type: "warning",
            message:
              "⚠️ PLAN SUBMITTED SUCCESSFULLY, BUT COULD NOT FETCH THE GENERATED PLAN. PLEASE REFRESH THE PAGE.",
          });
        } finally {
          setIsLoadingPlan(false);
        }
      } else {
        setSubmitStatus({
          type: "error",
          message: `❌ ${response.error || "FAILED TO SUBMIT WORKOUT PLAN"}`,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: "error",
        message: "❌ NETWORK ERROR. PLEASE TRY AGAIN.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.fitnessLevel &&
      formData.goals.length > 0 &&
      formData.equipment.length > 0 &&
      formData.days_per_week &&
      formData.session_duration &&
      formData.preferred_exercise_types.length > 0
    );
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100">
      <div className="w-full max-w-6xl my-22">
        <div className="rounded-[40px] shadow-lg border border-zinc-400 bg-white/80 backdrop-blur-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-mono tracking-wider mb-2 flex items-center justify-center gap-3">
              <Dumbbell className="w-8 h-8" />
              CREATE YOUR WORKOUT PLAN
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full mb-4"></div>
            <p className="font-mono text-sm tracking-wide text-slate-600">
              TELL US ABOUT YOUR FITNESS GOALS AND PREFERENCES
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Fitness Level */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-mono tracking-wider text-slate-800">
                <User className="w-5 h-5" />
                FITNESS LEVEL
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {fitnessLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() =>
                      handleInputChange("fitnessLevel", level.value)
                    }
                    className={`p-4 rounded-2xl border border-zinc-400 font-mono tracking-wide shadow-lg transition-all duration-200 ${
                      formData.fitnessLevel === level.value
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-slate-800"
                        : "bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:-translate-y-1"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-mono tracking-wider text-slate-800">
                <Target className="w-5 h-5" />
                FITNESS GOALS (SELECT ALL THAT APPLY)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleMultiSelect("goals", goal)}
                    className={`p-3 rounded-xl border border-zinc-400 text-sm font-mono tracking-wide shadow-lg transition-all duration-200 ${
                      formData.goals.includes(goal)
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-slate-800"
                        : "bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:-translate-y-1"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-mono tracking-wider text-slate-800">
                <Dumbbell className="w-5 h-5" />
                AVAILABLE EQUIPMENT (SELECT ALL THAT APPLY)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {equipmentOptions.map((equipment) => (
                  <button
                    key={equipment}
                    type="button"
                    onClick={() => handleMultiSelect("equipment", equipment)}
                    className={`p-3 rounded-xl border border-zinc-400 text-sm font-mono tracking-wide shadow-lg transition-all duration-200 ${
                      formData.equipment.includes(equipment)
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-slate-800"
                        : "bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:-translate-y-1"
                    }`}
                  >
                    {equipment}
                  </button>
                ))}
              </div>
            </div>

            {/* Days per Week */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-mono tracking-wider text-slate-800">
                <Calendar className="w-5 h-5" />
                DAYS PER WEEK
              </label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleInputChange("days_per_week", day)}
                    className={`p-4 rounded-2xl border border-zinc-400 font-mono tracking-wide shadow-lg transition-all duration-200 ${
                      formData.days_per_week === day
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-slate-800"
                        : "bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:-translate-y-1"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Duration */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-mono tracking-wider text-slate-800">
                <Clock className="w-5 h-5" />
                SESSION DURATION
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sessionDurations.map((duration) => (
                  <button
                    key={duration.value}
                    type="button"
                    onClick={() =>
                      handleInputChange("session_duration", duration.value)
                    }
                    className={`p-4 rounded-2xl border border-zinc-400 font-mono tracking-wide shadow-lg transition-all duration-200 ${
                      formData.session_duration === duration.value
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-slate-800"
                        : "bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:-translate-y-1"
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Exercise Types */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-mono tracking-wider text-slate-800">
                <Activity className="w-5 h-5" />
                PREFERRED EXERCISE TYPES (SELECT ALL THAT APPLY)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {exerciseTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      handleMultiSelect("preferred_exercise_types", type)
                    }
                    className={`p-3 rounded-xl border border-zinc-400 text-sm font-mono tracking-wide shadow-lg transition-all duration-200 ${
                      formData.preferred_exercise_types.includes(type)
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-slate-800"
                        : "bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:-translate-y-1"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Excluded Exercises */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-mono tracking-wider text-slate-800">
                <X className="w-5 h-5" />
                EXCLUDED EXERCISES (OPTIONAL)
              </label>
              <textarea
                value={formData.excluded_exercises}
                onChange={(e) =>
                  handleInputChange("excluded_exercises", e.target.value)
                }
                placeholder="List any exercises you want to avoid (e.g., burpees, jumping exercises, etc.)"
                className="w-full p-4 border border-zinc-400 rounded-2xl font-mono tracking-wide bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200 resize-none"
                rows={3}
              />
            </div>

            {/* Injuries */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-mono tracking-wider text-slate-800">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                INJURIES OR PHYSICAL LIMITATIONS (OPTIONAL)
              </label>
              <textarea
                value={formData.injuries}
                onChange={(e) => handleInputChange("injuries", e.target.value)}
                placeholder="Describe any injuries, physical limitations, or areas of concern"
                className="w-full p-4 border border-zinc-400 rounded-2xl font-mono tracking-wide bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200 resize-none"
                rows={3}
              />
            </div>

            {/* Status Messages */}
            {submitStatus && (
              <div
                className={`p-4 rounded-2xl border font-mono tracking-wide text-sm ${
                  submitStatus.type === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : submitStatus.type === "warning"
                    ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            {/* Loading Plan */}
            {isLoadingPlan && (
              <div className="flex items-center justify-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-400">
                <div className="w-6 h-6 border-2 border-slate-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                <span className="font-mono tracking-wide text-slate-800">
                  GENERATING YOUR PERSONALIZED WORKOUT PLAN...
                </span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-4 px-8 rounded-2xl font-mono text-lg tracking-wide shadow-lg transition-all duration-200 ${
                  isFormValid() && !isSubmitting
                    ? "bg-purple-100 text-gray-900 hover:bg-amber-500 cursor-pointer"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    SUBMITTING...
                  </div>
                ) : (
                  "CREATE MY WORKOUT PLAN"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Workout Plan Display */}
        {workoutPlan && (
          <div className="mt-8 rounded-[40px] shadow-lg border border-zinc-400 bg-white/80 backdrop-blur-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-mono tracking-wider mb-2 flex items-center justify-center gap-3">
                <Target className="w-6 h-6" />
                YOUR PERSONALIZED WORKOUT PLAN
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full mb-4"></div>
              <p className="font-mono text-sm tracking-wide text-slate-600">
                {workoutPlan.name}
              </p>
            </div>

            {/* Plan Overview */}
            <div className="mb-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-400">
              <h3 className="text-lg font-mono tracking-wider text-slate-800 mb-3">
                PLAN OVERVIEW
              </h3>
              <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4"></div>
              <p className="font-mono text-sm tracking-wide text-slate-600 mb-4">
                {workoutPlan.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-mono tracking-wider text-slate-800">
                    {workoutPlan.duration}
                  </div>
                  <div className="text-sm font-mono tracking-wide text-slate-600">
                    WEEKS
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-mono tracking-wider text-slate-800">
                    {workoutPlan.daysPerWeek}
                  </div>
                  <div className="text-sm font-mono tracking-wide text-slate-600">
                    DAYS/WEEK
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-mono tracking-wider text-slate-800">
                    {workoutPlan.workouts?.[0]?.estimatedDuration || 45}
                  </div>
                  <div className="text-sm font-mono tracking-wide text-slate-600">
                    MINUTES
                  </div>
                </div>
              </div>
            </div>

            {/* Workouts */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-mono tracking-wider text-slate-800 mb-2">
                  WEEKLY WORKOUT SCHEDULE
                </h3>
                <div className="w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full mb-4"></div>
              </div>

              {workoutPlan.workouts &&
                workoutPlan.workouts.map((workout, index) => (
                  <div
                    key={workout._id}
                    className="border border-zinc-400 rounded-2xl p-6 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                      <h4 className="text-lg font-mono tracking-wider text-slate-800">
                        {workout.name.toUpperCase()}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-sm font-mono tracking-wide">
                        <span className="bg-gradient-to-r from-yellow-100 to-orange-100 text-slate-800 px-3 py-1 rounded-full border border-zinc-400">
                          {workout.dayOfWeek.toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1 bg-white/60 px-3 py-1 rounded-full border border-zinc-400">
                          <Clock className="w-4 h-4" />
                          {workout.estimatedDuration} MIN
                        </span>
                        <span className="bg-gradient-to-r from-yellow-100 to-orange-100 text-slate-800 px-3 py-1 rounded-full border border-zinc-400">
                          {workout.difficulty.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="font-mono text-sm tracking-wide text-slate-600 mb-4">
                      {workout.description}
                    </p>

                    {/* Exercises */}
                    <div className="space-y-3">
                      <h5 className="font-mono tracking-wider text-slate-800">
                        EXERCISES:
                      </h5>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4"></div>
                      {workout.exercises &&
                        workout.exercises.map((exercise, exerciseIndex) => (
                          <div
                            key={exercise._id}
                            className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-zinc-300"
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                              <span className="font-mono tracking-wide text-slate-800">
                                EXERCISE {exerciseIndex + 1}
                              </span>
                              <div className="flex flex-wrap gap-4 text-sm font-mono tracking-wide text-slate-600">
                                {exercise.sets && (
                                  <span>{exercise.sets} SETS</span>
                                )}
                                {exercise.targetReps && (
                                  <span>{exercise.targetReps} REPS</span>
                                )}
                                {exercise.targetTime && (
                                  <span>{exercise.targetTime}S HOLD</span>
                                )}
                                {exercise.restTime && (
                                  <span>{exercise.restTime}S REST</span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm font-mono tracking-wide text-slate-600 leading-relaxed">
                              {exercise.notes}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Preferences Summary */}
            {workoutPlan.preferences && (
              <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-400">
                <h3 className="text-lg font-mono tracking-wider text-slate-800 mb-2">
                  YOUR PREFERENCES
                </h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-mono tracking-wide text-slate-700">
                      GOALS:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {workoutPlan.preferences.goals?.map((goal) => (
                        <span
                          key={goal}
                          className="bg-gradient-to-r from-yellow-100 to-orange-100 text-slate-800 px-2 py-1 rounded text-xs font-mono tracking-wide border border-zinc-300"
                        >
                          {goal.replace("_", " ").toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-mono tracking-wide text-slate-700">
                      EXERCISE TYPES:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {workoutPlan.preferences.preferredExerciseTypes?.map(
                        (type) => (
                          <span
                            key={type}
                            className="bg-gradient-to-r from-yellow-100 to-orange-100 text-slate-800 px-2 py-1 rounded text-xs font-mono tracking-wide border border-zinc-300"
                          >
                            {type.replace("_", " ").toUpperCase()}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlanForm;
