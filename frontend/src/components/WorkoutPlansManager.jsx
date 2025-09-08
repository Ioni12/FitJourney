import React, { useState, useEffect } from "react";
import { getWorkoutPlans } from "../services/planService";

const WorkoutPlansManager = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Fetch workout plans on component mount
  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const fetchWorkoutPlans = async () => {
    setLoading(true);
    setError(null);

    const result = await getWorkoutPlans();

    console.log(result);

    if (result.success) {
      // Fix: Access the workoutPlans array from the nested data structure
      setWorkoutPlans(result.data.workoutPlans || []);
      setPagination(result.data.pagination);
    } else {
      setError(result.error);
      console.error("Failed to fetch workout plans:", result.error);
    }

    setLoading(false);
  };

  // Helper function to format goals array
  const formatGoals = (goals) => {
    if (!goals || goals.length === 0) return "No goals specified";
    return goals.map((goal) => goal.replace("_", " ")).join(", ");
  };

  // Helper function to get total exercises in a plan
  const getTotalExercises = (workouts) => {
    if (!workouts || !Array.isArray(workouts)) return 0;
    return workouts.reduce(
      (total, workout) => total + (workout.exercises?.length || 0),
      0
    );
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto pt-24">
          <div className="flex justify-center items-center p-8">
            <div className="rounded-[40px] shadow-lg border border-zinc-400 bg-white/80 backdrop-blur-sm px-8 py-6">
              <div className="text-lg font-mono tracking-wider">
                Loading workout plans...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto pt-24">
          <div className="p-8">
            <div className="rounded-[40px] shadow-lg border border-red-400 bg-red-100/80 backdrop-blur-sm px-8 py-6">
              <div className="font-mono tracking-wide">
                <strong>Error:</strong>{" "}
                {typeof error === "string"
                  ? error
                  : "Failed to load workout plans"}
              </div>
              <button
                onClick={fetchWorkoutPlans}
                className="mt-4 bg-purple-100 text-gray-900 px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-amber-500 transition-colors duration-200"
              >
                <span className="tracking-wide">RETRY</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(workoutPlans) || workoutPlans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto pt-24">
          <div className="p-8 text-center">
            <div className="rounded-[40px] shadow-lg border border-zinc-400 bg-white/80 backdrop-blur-sm px-8 py-12">
              <div className="text-slate-800 text-xl font-mono tracking-wider mb-4">
                No workout plans found
              </div>
              <p className="text-slate-600 font-mono tracking-wide">
                Create your first workout plan to get started!
              </p>
              {pagination && (
                <div className="mt-4 text-sm text-slate-500 font-mono">
                  Total plans: {pagination.total}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="rounded-[40px] shadow-lg border border-zinc-400 bg-white/80 backdrop-blur-sm">
            <div className="flex justify-between items-center px-8 py-6">
              <h1 className="text-3xl font-mono tracking-wider text-slate-800">
                YOUR WORKOUT PLANS
              </h1>
              <div className="flex gap-4 items-center">
                {pagination && (
                  <span className="text-sm text-slate-600 font-mono tracking-wide">
                    {pagination.total} total plans
                  </span>
                )}
                <button
                  onClick={fetchWorkoutPlans}
                  className="bg-purple-100 text-gray-900 px-6 py-3 rounded-2xl font-bold text-lg shadow-lg hover:bg-amber-500 transition-colors duration-200"
                >
                  <span className="tracking-wide">REFRESH</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutPlans.map((plan) => (
            <div
              key={plan._id}
              className="rounded-[40px] shadow-lg border border-zinc-400 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-200"
            >
              <div className="p-8">
                {/* Plan Header */}
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-mono tracking-wider text-slate-800 truncate">
                    {plan.name}
                  </h3>
                  <span
                    className={`px-4 py-2 rounded-2xl text-sm font-bold tracking-wide ${
                      plan.isActive
                        ? "bg-slate-400 text-slate-800 shadow-lg"
                        : "bg-white bg-opacity-20 text-slate-800"
                    }`}
                  >
                    {plan.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                {/* Plan Description */}
                {plan.description && (
                  <p className="text-slate-600 text-sm mb-6 font-mono tracking-wide line-clamp-3">
                    {plan.description}
                  </p>
                )}

                {/* Plan Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-mono tracking-wider text-slate-800 font-black">
                      {plan.duration || "N/A"}
                    </div>
                    <div className="text-sm text-slate-600 font-mono tracking-wide">
                      WEEKS
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-mono tracking-wider text-slate-800 font-black">
                      {plan.daysPerWeek || "N/A"}
                    </div>
                    <div className="text-sm text-slate-600 font-mono tracking-wide">
                      DAYS/WEEK
                    </div>
                  </div>
                </div>

                {/* Workouts Summary */}
                <div className="mb-6 space-y-2">
                  <div className="text-sm text-slate-600 font-mono tracking-wide">
                    <strong>{plan.workouts?.length || 0}</strong> workout
                    sessions
                  </div>
                  <div className="text-sm text-slate-600 font-mono tracking-wide">
                    <strong>{getTotalExercises(plan.workouts)}</strong> total
                    exercises
                  </div>
                </div>

                {/* Preferences */}
                {plan.preferences && (
                  <div className="mb-6 space-y-2">
                    <div className="text-sm text-slate-600 font-mono tracking-wide">
                      <strong>Goals:</strong>{" "}
                      {formatGoals(plan.preferences.goals)}
                    </div>
                    {plan.preferences.fitnessLevel && (
                      <div className="text-sm text-slate-600 font-mono tracking-wide">
                        <strong>Level:</strong> {plan.preferences.fitnessLevel}
                      </div>
                    )}
                  </div>
                )}

                {/* Dates */}
                <div className="text-xs text-slate-500 mb-6 space-y-1 font-mono tracking-wide">
                  <div>
                    Created: {formatDate(plan.generatedAt || plan.createdAt)}
                  </div>
                  <div>Updated: {formatDate(plan.updatedAt)}</div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className="flex-1 bg-white bg-opacity-20 text-slate-800 py-3 px-4 rounded-2xl text-sm font-bold tracking-wide hover:bg-opacity-30 transition-colors duration-200"
                  >
                    VIEW DETAILS
                  </button>
                  <button className="flex-1 bg-purple-100 text-gray-900 py-3 px-4 rounded-2xl text-sm font-bold tracking-wide hover:bg-amber-500 transition-colors duration-200">
                    START NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed View Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="rounded-[40px] shadow-lg border border-zinc-400 bg-white/90 backdrop-blur-sm max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-mono tracking-wider text-slate-800">
                    {selectedPlan.name}
                  </h2>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="bg-white bg-opacity-20 text-slate-800 hover:bg-opacity-30 px-4 py-2 rounded-2xl text-2xl font-mono transition-colors duration-200"
                  >
                    ×
                  </button>
                </div>

                {selectedPlan.description && (
                  <p className="text-slate-600 mb-8 font-mono tracking-wide">
                    {selectedPlan.description}
                  </p>
                )}

                {/* Plan Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-6 rounded-[30px] shadow-lg border border-zinc-400 bg-white/60 backdrop-blur-sm">
                    <div className="text-3xl font-mono tracking-wider text-slate-800 font-black">
                      {selectedPlan.duration || "N/A"}
                    </div>
                    <div className="text-sm text-slate-600 font-mono tracking-wide">
                      WEEKS
                    </div>
                  </div>
                  <div className="text-center p-6 rounded-[30px] shadow-lg border border-zinc-400 bg-white/60 backdrop-blur-sm">
                    <div className="text-3xl font-mono tracking-wider text-slate-800 font-black">
                      {selectedPlan.daysPerWeek || "N/A"}
                    </div>
                    <div className="text-sm text-slate-600 font-mono tracking-wide">
                      DAYS/WEEK
                    </div>
                  </div>
                  <div className="text-center p-6 rounded-[30px] shadow-lg border border-zinc-400 bg-white/60 backdrop-blur-sm">
                    <div className="text-3xl font-mono tracking-wider text-slate-800 font-black">
                      {selectedPlan.workouts?.length || 0}
                    </div>
                    <div className="text-sm text-slate-600 font-mono tracking-wide">
                      WORKOUTS
                    </div>
                  </div>
                  <div className="text-center p-6 rounded-[30px] shadow-lg border border-zinc-400 bg-white/60 backdrop-blur-sm">
                    <div className="text-3xl font-mono tracking-wider text-slate-800 font-black">
                      {getTotalExercises(selectedPlan.workouts)}
                    </div>
                    <div className="text-sm text-slate-600 font-mono tracking-wide">
                      EXERCISES
                    </div>
                  </div>
                </div>

                {/* Workouts List */}
                <div className="mb-8">
                  <h3 className="text-xl font-mono tracking-wider text-slate-800 mb-6">
                    WORKOUT SESSIONS
                  </h3>
                  <div className="space-y-4">
                    {selectedPlan.workouts?.map((workout, index) => (
                      <div
                        key={index}
                        className="rounded-[30px] shadow-lg border border-zinc-400 bg-white/60 backdrop-blur-sm p-6"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-mono tracking-wider text-slate-800">
                            {workout.name}
                          </h4>
                          <div className="flex gap-2">
                            {workout.dayOfWeek && (
                              <span className="bg-slate-400 text-slate-800 px-4 py-2 rounded-2xl text-sm font-bold tracking-wide shadow-lg">
                                {workout.dayOfWeek}
                              </span>
                            )}
                            {workout.difficulty && (
                              <span
                                className={`px-4 py-2 rounded-2xl text-sm font-bold tracking-wide shadow-lg ${
                                  workout.difficulty === "Beginner"
                                    ? "bg-purple-100 text-gray-900"
                                    : workout.difficulty === "Intermediate"
                                    ? "bg-white bg-opacity-20 text-slate-800"
                                    : "bg-slate-400 text-slate-800"
                                }`}
                              >
                                {workout.difficulty}
                              </span>
                            )}
                          </div>
                        </div>

                        {workout.description && (
                          <p className="text-slate-600 text-sm mb-4 font-mono tracking-wide">
                            {workout.description}
                          </p>
                        )}

                        <div className="text-sm text-slate-600 mb-4 font-mono tracking-wide">
                          <span className="mr-6">
                            <strong>{workout.exercises?.length || 0}</strong>{" "}
                            exercises
                          </span>
                          {workout.estimatedDuration && (
                            <span>
                              <strong>{workout.estimatedDuration}</strong>{" "}
                              minutes
                            </span>
                          )}
                        </div>

                        {/* Exercise List */}
                        {workout.exercises && workout.exercises.length > 0 && (
                          <div className="mt-4">
                            <div className="text-sm font-mono tracking-wider text-slate-800 mb-4">
                              EXERCISES:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {workout.exercises.map(
                                (exercise, exerciseIndex) => (
                                  <div
                                    key={exerciseIndex}
                                    className="bg-white bg-opacity-30 p-4 rounded-2xl text-sm font-mono tracking-wide"
                                  >
                                    <div className="font-bold text-slate-800 mb-2">
                                      {exercise.exerciseTemplate?.name ||
                                        `Exercise ${exerciseIndex + 1}`}
                                    </div>
                                    {exercise.sets && (
                                      <div className="text-slate-600">
                                        Sets: {exercise.sets}
                                      </div>
                                    )}
                                    {exercise.targetReps && (
                                      <div className="text-slate-600">
                                        Reps: {exercise.targetReps}
                                      </div>
                                    )}
                                    {exercise.targetTime && (
                                      <div className="text-slate-600">
                                        Time: {exercise.targetTime}s
                                      </div>
                                    )}
                                    {exercise.restTime && (
                                      <div className="text-slate-600">
                                        Rest: {exercise.restTime}s
                                      </div>
                                    )}
                                    {exercise.notes && (
                                      <div className="text-slate-500 mt-2">
                                        Notes: {exercise.notes}
                                      </div>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )) || (
                      <div className="text-slate-500 font-mono tracking-wide text-center py-8">
                        No workouts available
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                {selectedPlan.preferences && (
                  <div>
                    <h3 className="text-xl font-mono tracking-wider text-slate-800 mb-6">
                      PREFERENCES
                    </h3>
                    <div className="rounded-[30px] shadow-lg border border-zinc-400 bg-white/60 backdrop-blur-sm p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono tracking-wide">
                        <div className="text-slate-600">
                          <strong>Goals:</strong>{" "}
                          {formatGoals(selectedPlan.preferences.goals)}
                        </div>
                        {selectedPlan.preferences.fitnessLevel && (
                          <div className="text-slate-600">
                            <strong>Fitness Level:</strong>{" "}
                            {selectedPlan.preferences.fitnessLevel}
                          </div>
                        )}
                        {selectedPlan.preferences.sessionDuration && (
                          <div className="text-slate-600">
                            <strong>Session Duration:</strong>{" "}
                            {selectedPlan.preferences.sessionDuration} minutes
                          </div>
                        )}
                        {selectedPlan.preferences.equipment &&
                          selectedPlan.preferences.equipment.length > 0 && (
                            <div className="text-slate-600">
                              <strong>Equipment:</strong>{" "}
                              {selectedPlan.preferences.equipment.join(", ")}
                            </div>
                          )}
                        {selectedPlan.preferences.injuries &&
                          selectedPlan.preferences.injuries.length > 0 && (
                            <div className="text-slate-600">
                              <strong>Injuries:</strong>{" "}
                              {selectedPlan.preferences.injuries.join(", ")}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlansManager;
