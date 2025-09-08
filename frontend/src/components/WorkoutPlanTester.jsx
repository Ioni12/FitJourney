import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Loader2, Info } from "lucide-react";
import { generateExercisePlan } from "../services/planService";

const WorkoutPlanTester = () => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    goals: ["muscle_gain"],
    fitnessLevel: "Intermediate",
    daysPerWeek: 3,
    sessionDuration: 60,
    preferredExerciseTypes: ["strength"],
    excludedExercises: [],
    injuries: [],
    equipment: ["dumbbells"],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [testToken, setTestToken] = useState("");

  useEffect(() => {
    console.log("WorkoutPlanTester component mounted!");
    setMounted(true);
  }, []);

  const validateForm = () => {
    const errors = {};

    if (formData.goals.length === 0) {
      errors.goals = "At least one goal is required";
    }

    if (formData.daysPerWeek < 1 || formData.daysPerWeek > 7) {
      errors.daysPerWeek = "Days per week must be between 1 and 7";
    }

    if (formData.sessionDuration < 15 || formData.sessionDuration > 180) {
      errors.sessionDuration =
        "Session duration must be between 15 and 180 minutes";
    }

    if (formData.preferredExerciseTypes.length === 0) {
      errors.preferredExerciseTypes = "At least one exercise type is required";
    }

    if (formData.equipment.length === 0) {
      errors.equipment = "At least one piece of equipment is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Helper function to extract error message from error response
  const getErrorMessage = (errorResponse) => {
    if (typeof errorResponse === "string") {
      return errorResponse;
    }

    if (errorResponse && typeof errorResponse === "object") {
      // If it's an object, try to extract the message
      if (errorResponse.message) {
        return errorResponse.message;
      }

      // If there are multiple errors, combine them
      if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
        return errorResponse.errors.map((err) => err.message || err).join(", ");
      }

      // Fall back to JSON string representation
      try {
        return JSON.stringify(errorResponse, null, 2);
      } catch (e) {
        return "Unknown error occurred";
      }
    }

    return "Unknown error occurred";
  };

  const handleSubmit = async () => {
    console.log("Submit button clicked!");

    // Set the token in localStorage if provided
    if (testToken.trim()) {
      localStorage.setItem("token", testToken.trim());
      console.log("Test token set in localStorage");
    }

    if (!validateForm()) {
      console.log("Form validation failed:", validationErrors);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Making API call with data:", formData);

      // Call the actual API
      const response = await generateExercisePlan(formData);
      console.log("API response:", response);

      if (response.success) {
        setResult(response.data);
        console.log("Success! Plan generated:", response.data);
      } else {
        const errorMessage = getErrorMessage(response.error);
        setError(errorMessage);
        console.error("API Error:", response.error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArrayInput = (field, value) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({ ...prev, [field]: items }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  if (!mounted) {
    return <div>Loading component...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🏋️ Workout Plan Generator API Test
        </h1>
        <p className="text-gray-600">
          Testing connection to backend: http://localhost:3000/api/plan/generate
        </p>
        <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-green-800 text-sm">
          ✅ Component ready for API testing
        </div>

        {/* Authentication Token Input */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Token (Required for API access)
          </label>
          <input
            type="text"
            value={testToken}
            onChange={(e) => setTestToken(e.target.value)}
            placeholder="Paste your JWT token here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <p className="text-xs text-gray-600 mt-1">
            Get this token by logging in first or from your browser's
            localStorage
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goals <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.goals.join(", ")}
              onChange={(e) => handleArrayInput("goals", e.target.value)}
              placeholder="muscle_gain, weight_loss, endurance"
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                validationErrors.goals ? "border-red-500" : "border-gray-300"
              }`}
            />
            {validationErrors.goals && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.goals}
              </p>
            )}
          </div>

          {/* Fitness Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fitness Level
            </label>
            <select
              value={formData.fitnessLevel}
              onChange={(e) =>
                handleInputChange("fitnessLevel", e.target.value)
              }
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Days Per Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Days Per Week
            </label>
            <input
              type="number"
              min="1"
              max="7"
              value={formData.daysPerWeek}
              onChange={(e) =>
                handleInputChange("daysPerWeek", parseInt(e.target.value) || 0)
              }
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                validationErrors.daysPerWeek
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {validationErrors.daysPerWeek && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.daysPerWeek}
              </p>
            )}
          </div>

          {/* Session Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Duration (minutes)
            </label>
            <input
              type="number"
              min="15"
              max="180"
              value={formData.sessionDuration}
              onChange={(e) =>
                handleInputChange(
                  "sessionDuration",
                  parseInt(e.target.value) || 0
                )
              }
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                validationErrors.sessionDuration
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {validationErrors.sessionDuration && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.sessionDuration}
              </p>
            )}
          </div>

          {/* Exercise Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Exercise Types <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.preferredExerciseTypes.join(", ")}
              onChange={(e) =>
                handleArrayInput("preferredExerciseTypes", e.target.value)
              }
              placeholder="strength, cardio, flexibility"
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                validationErrors.preferredExerciseTypes
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {validationErrors.preferredExerciseTypes && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.preferredExerciseTypes}
              </p>
            )}
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Equipment <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.equipment.join(", ")}
              onChange={(e) => handleArrayInput("equipment", e.target.value)}
              placeholder="dumbbells, barbell, resistance_bands"
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                validationErrors.equipment
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {validationErrors.equipment && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.equipment}
              </p>
            )}
          </div>
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excluded Exercises (optional)
            </label>
            <input
              type="text"
              value={formData.excludedExercises.join(", ")}
              onChange={(e) =>
                handleArrayInput("excludedExercises", e.target.value)
              }
              placeholder="deadlifts, squats"
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Injuries (optional)
            </label>
            <input
              type="text"
              value={formData.injuries.join(", ")}
              onChange={(e) => handleArrayInput("injuries", e.target.value)}
              placeholder="knee, shoulder"
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Calling API...</span>
            </>
          ) : (
            <span>Generate Workout Plan</span>
          )}
        </button>
      </div>

      {/* API Connection Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-start space-x-2 text-blue-800">
          <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium mb-1">API Connection Info:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Endpoint: POST http://localhost:3000/api/plan/generate</li>
              <li>Uses Authorization header with Bearer token</li>
              <li>Check browser console for detailed logs</li>
              <li>Make sure your backend server is running on port 3000</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start space-x-2 text-red-800">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">API Error:</span>
              <pre className="text-red-700 mt-1 whitespace-pre-wrap text-sm">
                {error}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Success Display */}
      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center space-x-2 text-green-800 mb-3">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">API Call Successful!</span>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                API Response:
              </h3>
              <pre className="text-sm text-gray-600 overflow-auto max-h-96 whitespace-pre-wrap bg-gray-50 p-4 rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Request Data Preview */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h3 className="font-semibold text-gray-800 mb-2">Request Payload:</h3>
        <pre className="text-sm text-gray-600 overflow-auto max-h-40 whitespace-pre-wrap">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default WorkoutPlanTester;
