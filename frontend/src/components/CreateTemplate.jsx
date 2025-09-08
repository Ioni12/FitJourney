import React, { useState } from "react";
import { createTemplate } from "../services/templateService";

const CreateTemplate = ({ onTemplateCreated }) => {
  const [template, setTemplate] = useState({ name: "", type: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const exerciseTypes = [
    { value: "", label: "Select exercise type" },
    { value: "reps", label: "Reps" },
    { value: "time", label: "Time" },
    { value: "distance", label: "Distance" },
    { value: "weight", label: "Weight" },
    { value: "calories", label: "Calories" },
    { value: "custom", label: "Custom" },
    { value: "other", label: "Other" },
  ];

  const submitTemplate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await createTemplate(template);

      if (result.success) {
        setMessage("Exercise template created successfully!");
        setTemplate({ name: "", type: "" });
        if (onTemplateCreated) {
          onTemplateCreated();
        }
      } else {
        setError(result.message || "Failed to create template");
      }
    } catch (err) {
      setError(err.message || "An error occurred while creating the template");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (message) setMessage("");
  };

  const validateForm = () => {
    if (!template.name.trim()) {
      setError("Exercise name is required");
      return false;
    }
    if (!template.type) {
      setError("Exercise type is required");
      return false;
    }
    return true;
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-4xl">
        <div className="rounded-[40px] shadow-lg border border-zinc-400 bg-white/80 backdrop-blur-sm p-8 mt-22">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-mono tracking-wider mb-2">
              CREATE TEMPLATE
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
          </div>

          <form onSubmit={submitTemplate} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block mb-3 font-mono text-lg tracking-wide text-slate-800"
              >
                EXERCISE NAME
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={template.name}
                onChange={handleInputChange}
                placeholder="Enter exercise name (e.g., Push-ups)"
                className="w-full p-4 border border-zinc-400 rounded-2xl text-lg font-mono tracking-wide bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block mb-3 font-mono text-lg tracking-wide text-slate-800"
              >
                EXERCISE TYPE
              </label>
              <select
                id="type"
                name="type"
                value={template.type}
                onChange={handleInputChange}
                className="w-full p-4 border border-zinc-400 rounded-2xl text-lg font-mono tracking-wide bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200"
              >
                {exerciseTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg">
                {error}
              </div>
            )}

            {message && (
              <div className="text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-8 py-4 rounded-2xl font-mono text-lg tracking-wide shadow-lg transition-colors duration-200 ${
                loading
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-purple-100 text-gray-900 hover:bg-amber-500 cursor-pointer"
              }`}
            >
              {loading ? "CREATING..." : "CREATE TEMPLATE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplate;
