import React, { useState, useEffect } from "react";
import { getTemplates, deleteTemplate } from "../services/templateService";
import { logExercise } from "../services/exerciseService";

const TemplateList = ({ refreshTrigger }) => {
  const [templates, setTemplates] = useState([]);
  const [fetchingTemplates, setFetchingTemplates] = useState(false);
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  const [logData, setLogData] = useState({ value: "", notes: "" });
  const [loggingSuccess, setLoggingSuccess] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const exerciseTypes = [
    { value: "reps", label: "Reps" },
    { value: "time", label: "Time" },
    { value: "distance", label: "Distance" },
    { value: "weight", label: "Weight" },
    { value: "calories", label: "Calories" },
    { value: "custom", label: "Custom" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    fetchTemplates();
  }, [refreshTrigger]);

  const fetchTemplates = async () => {
    setFetchingTemplates(true);
    try {
      const result = await getTemplates();
      if (result.success) {
        setTemplates(result.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    } finally {
      setFetchingTemplates(false);
    }
  };

  const handleTemplateClick = (template) => {
    if (expandedTemplate && expandedTemplate._id === template._id) {
      // If clicking the same template, collapse it
      setExpandedTemplate(null);
      setLogData({ value: "", notes: "" });
      setLoggingSuccess("");
      setDeleteConfirm(null);
    } else {
      // Expand the clicked template
      setExpandedTemplate(template);
      setLogData({ value: "", notes: "" });
      setLoggingSuccess("");
      setDeleteConfirm(null);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    setIsDeleting(true);
    try {
      await deleteTemplate(templateId);
      setTemplates(templates.filter((template) => template._id !== templateId));
      setDeleteConfirm(null);
      setExpandedTemplate(null);
    } catch (err) {
      console.error("Failed to delete template:", err);
      alert("Failed to delete template. Check console.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setIsLogging(true);

    const numValue = parseFloat(logData.value);
    if (isNaN(numValue) || numValue < 0) {
      alert("Please enter a valid number");
      setIsLogging(false);
      return;
    }

    try {
      const logPayload = {};
      if (expandedTemplate.type === "reps") {
        logPayload.reps = numValue;
      } else if (expandedTemplate.type === "time") {
        logPayload.time = numValue;
      }

      await logExercise(expandedTemplate._id, logPayload);

      setLoggingSuccess(`✅ Logged ${numValue} ${expandedTemplate.type}!`);
      setLogData({ value: "", notes: "" });

      setTimeout(() => {
        setExpandedTemplate(null);
        setLoggingSuccess("");
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to log exercise. Check console.");
    } finally {
      setIsLogging(false);
    }
  };

  const getTypeLabel = (type) => {
    const typeObj = exerciseTypes.find((t) => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-4xl">
        <div className="rounded-[40px] shadow-lg border border-zinc-400 bg-white/80 backdrop-blur-sm p-8 lg:-mt-20 -mt-[34vh]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-mono tracking-wider mb-2">
              YOUR TEMPLATES
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <button
              onClick={fetchTemplates}
              disabled={fetchingTemplates}
              className="px-6 py-3 rounded-2xl font-mono text-lg tracking-wide shadow-lg transition-colors duration-200 bg-purple-100 text-gray-900 hover:bg-amber-500 cursor-pointer disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              {fetchingTemplates ? "REFRESHING..." : "REFRESH"}
            </button>
          </div>

          {fetchingTemplates ? (
            <div className="text-center py-8 font-mono text-lg tracking-wide text-slate-800">
              LOADING TEMPLATES...
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-10 bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-400">
              <p className="font-mono text-lg tracking-wide text-slate-600">
                NO TEMPLATES FOUND. CREATE YOUR FIRST TEMPLATE!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((tmpl) => (
                <div
                  key={tmpl._id}
                  className={`group relative border border-zinc-400 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 ${
                    expandedTemplate && expandedTemplate._id === tmpl._id
                      ? "bg-white/90 backdrop-blur-sm shadow-xl col-span-full"
                      : "bg-white/60 backdrop-blur-sm hover:shadow-xl hover:bg-white/80 hover:-translate-y-1"
                  }`}
                  onClick={() => handleTemplateClick(tmpl)}
                >
                  <div className="p-6 relative">
                    {/* Delete Confirmation Overlay */}
                    {deleteConfirm === tmpl._id && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10 border-2 border-red-200">
                        <div className="text-center p-6">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-xl">⚠️</span>
                          </div>
                          <h3 className="text-lg font-mono tracking-wide mb-2 text-gray-900">
                            DELETE TEMPLATE
                          </h3>
                          <div className="w-12 h-0.5 bg-gradient-to-r from-red-400 to-red-500 mx-auto rounded-full mb-4"></div>

                          <p className="font-mono text-sm mb-6 text-slate-600 leading-relaxed max-w-xs">
                            Are you sure you want to delete this template? This
                            action cannot be undone.
                          </p>

                          <div className="flex flex-col gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirm(null);
                              }}
                              className="px-4 py-2 rounded-xl font-mono text-sm tracking-wide shadow-lg transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                            >
                              CANCEL
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTemplate(tmpl._id);
                              }}
                              disabled={isDeleting}
                              className="px-4 py-2 rounded-xl font-mono text-sm tracking-wide shadow-lg transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed border border-red-600 disabled:border-gray-500"
                            >
                              {isDeleting ? "DELETING..." : "DELETE"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Main Template Content */}
                    <div
                      className={`relative transition-opacity duration-200 ${
                        deleteConfirm === tmpl._id ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-gray-900 text-xl font-mono tracking-wide font-semibold leading-tight">
                          {tmpl.name}
                        </h3>
                        <div className="flex gap-2">
                          {expandedTemplate &&
                            expandedTemplate._id === tmpl._id && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirm(tmpl._id);
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xl font-bold"
                                  title="Delete template"
                                >
                                  🗑️
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedTemplate(null);
                                    setLogData({ value: "", notes: "" });
                                    setLoggingSuccess("");
                                  }}
                                  className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                  ×
                                </button>
                              </>
                            )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-slate-800 font-mono tracking-wide text-sm font-medium mb-2">
                          TYPE
                        </p>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full font-mono tracking-wide text-sm font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-slate-800 border border-zinc-400">
                          {getTypeLabel(tmpl.type)}
                        </span>
                      </div>

                      {tmpl.createdAt && (
                        <div className="flex items-center text-slate-600 text-xs font-mono tracking-wide mb-4">
                          <svg
                            className="w-3 h-3 mr-1.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          CREATED{" "}
                          {new Date(tmpl.createdAt).toLocaleDateString()}
                        </div>
                      )}

                      {/* Expanded Logging Form */}
                      {expandedTemplate &&
                        expandedTemplate._id === tmpl._id && (
                          <div className="border-t border-zinc-300 pt-6 mt-4">
                            <div className="text-center mb-6">
                              <h4 className="text-xl font-mono tracking-wider mb-2">
                                LOG EXERCISE
                              </h4>
                              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
                            </div>

                            <form
                              onSubmit={handleLogSubmit}
                              className="space-y-4"
                            >
                              <div>
                                <label className="block mb-3 font-mono text-lg tracking-wide text-slate-800">
                                  {tmpl.type === "reps"
                                    ? "REPS"
                                    : tmpl.type === "time"
                                    ? "TIME (MINUTES)"
                                    : "VALUE"}
                                </label>
                                <input
                                  type="number"
                                  step={tmpl.type === "time" ? "0.1" : "1"}
                                  value={logData.value}
                                  onChange={(e) =>
                                    setLogData({
                                      ...logData,
                                      value: e.target.value,
                                    })
                                  }
                                  required
                                  placeholder={`Enter ${tmpl.type}`}
                                  className="w-full p-4 border border-zinc-400 rounded-2xl text-lg font-mono tracking-wide bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>

                              <div>
                                <label className="block mb-3 font-mono text-lg tracking-wide text-slate-800">
                                  NOTES (OPTIONAL)
                                </label>
                                <textarea
                                  value={logData.notes}
                                  onChange={(e) =>
                                    setLogData({
                                      ...logData,
                                      notes: e.target.value,
                                    })
                                  }
                                  rows="3"
                                  className="w-full p-4 border border-zinc-400 rounded-2xl text-lg font-mono tracking-wide bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>

                              {loggingSuccess && (
                                <div className="text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg font-mono tracking-wide">
                                  {loggingSuccess}
                                </div>
                              )}

                              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedTemplate(null);
                                    setLogData({ value: "", notes: "" });
                                    setLoggingSuccess("");
                                  }}
                                  className="px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-mono text-base md:text-lg tracking-wide shadow-lg transition-colors duration-200 bg-gray-400 text-gray-600 hover:bg-gray-500 cursor-pointer"
                                >
                                  CANCEL
                                </button>
                                <button
                                  type="submit"
                                  disabled={isLogging}
                                  className="px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-mono text-base md:text-lg tracking-wide shadow-lg transition-colors duration-200 bg-purple-100 text-gray-900 hover:bg-amber-500 cursor-pointer disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {isLogging ? "LOGGING..." : "LOG EXERCISE"}
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateList;
