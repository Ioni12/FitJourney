import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Target,
  Activity,
  Clock,
  Award,
  AlertCircle,
  RefreshCw,
  Download,
  Filter,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Search,
  BarChart3,
  PieChart as PieChartIcon,
  Timer,
  Dumbbell,
  Zap,
  List,
  Grid3X3,
} from "lucide-react";

// Your actual service import
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getDashboardData = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.period) params.append("period", filters.period);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const queryString = params.toString();
    const url = queryString
      ? `/dashboard/stats?${queryString}`
      : "/dashboard/stats";

    const response = await api.get(url);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data : "Network Error",
    };
  }
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [viewSettings, setViewSettings] = useState({
    showAdvancedMetrics: false,
    chartType: "line",
    exercisesView: "grid",
    showAllExercises: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExerciseType, setSelectedExerciseType] = useState("all");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const filters = {
        period: selectedPeriod,
        ...(dateRange.startDate &&
          dateRange.endDate && {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }),
      };

      const response = await getDashboardData(filters);

      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.error?.message || "Failed to load dashboard data");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod, dateRange]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setDateRange({ startDate: "", endDate: "" });
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
    if (value) setSelectedPeriod("");
  };

  const toggleViewSetting = (setting) => {
    setViewSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const formatWeeklyTrendData = (weeklyTrend) => {
    if (!weeklyTrend || !Array.isArray(weeklyTrend)) return [];

    return weeklyTrend.map((item) => ({
      week: `Week ${item._id?.week || "N/A"}`,
      workouts: item.workouts || 0,
      exercises: item.totalExercises || 0,
    }));
  };

  const formatTopExercisesData = (topExercises) => {
    if (!topExercises || !Array.isArray(topExercises)) return [];

    return topExercises.map((item) => ({
      name: item.template?.name || "Unknown Exercise",
      count: item.count || 0,
      type: item.template?.type || "unknown",
    }));
  };

  // Extract all exercises from recent activity for comprehensive view
  const getAllExercisesFromActivity = (recentActivity) => {
    if (!recentActivity || !Array.isArray(recentActivity)) return [];

    const allExercises = [];

    recentActivity.forEach((workout) => {
      if (workout.exercises && Array.isArray(workout.exercises)) {
        workout.exercises.forEach((exercise) => {
          allExercises.push({
            ...exercise,
            workoutDate: workout.date,
            workoutId: workout._id,
          });
        });
      }
    });

    return allExercises;
  };

  const getFilteredExercises = (exercises) => {
    let filtered = exercises;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((exercise) =>
        exercise.exerciseTemplate?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by exercise type
    if (selectedExerciseType !== "all") {
      filtered = filtered.filter(
        (exercise) => exercise.exerciseTemplate?.type === selectedExerciseType
      );
    }

    return filtered;
  };

  const getExerciseTypeIcon = (type) => {
    switch (type) {
      case "reps":
        return <Dumbbell className="w-4 h-4" />;
      case "time":
        return <Timer className="w-4 h-4" />;
      case "distance":
        return <Activity className="w-4 h-4" />;
      case "weight":
        return <Target className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getGoalProgressColor = (percentage) => {
    if (percentage >= 100) return "text-green-600 bg-green-100";
    if (percentage >= 75) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const exportData = () => {
    if (!dashboardData) return;

    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `fitness-dashboard-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-[30px] border border-zinc-300 p-8 shadow-lg">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
                <span className="text-lg font-mono text-slate-800 tracking-wide">
                  Loading dashboard...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[30px] bg-white bg-opacity-60 backdrop-blur-sm border border-zinc-400 shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h3 className="text-2xl font-mono font-black text-slate-800 tracking-wide">
                Error Loading Dashboard
              </h3>
            </div>
            <p className="mt-2 text-lg text-slate-600 font-medium mb-6">
              {error}
            </p>
            <button
              onClick={fetchDashboardData}
              className="bg-purple-100 text-gray-900 px-6 py-3 rounded-2xl font-black text-lg shadow-lg hover:bg-amber-500 transition-all duration-200 transform hover:scale-105"
            >
              <span className="tracking-wide">TRY AGAIN</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const weeklyTrendData = formatWeeklyTrendData(dashboardData?.weeklyTrend);
  const topExercisesData = formatTopExercisesData(dashboardData?.topExercises);
  const goalProgress = dashboardData?.goalProgress;
  const recentActivity = dashboardData?.recentActivity || [];
  const allExercises = getAllExercisesFromActivity(recentActivity);
  const filteredExercises = getFilteredExercises(allExercises);
  const uniqueExerciseTypes = [
    ...new Set(
      allExercises.map((ex) => ex.exerciseTemplate?.type).filter(Boolean)
    ),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8 mt-22">
        {/* Header */}
        <div className="rounded-[30px] bg-white bg-opacity-60 backdrop-blur-sm border border-zinc-400 shadow-lg p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-mono font-black tracking-wider text-slate-800 leading-tight">
                FITNESS DASHBOARD
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                Track your workout progress with advanced insights
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Period Selector */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-slate-600" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  className="px-4 py-3 bg-white bg-opacity-50 border border-zinc-300 rounded-2xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="">Custom Range</option>
                </select>
              </div>

              {/* Custom Date Range */}
              {!selectedPeriod && (
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      handleDateRangeChange("startDate", e.target.value)
                    }
                    className="px-4 py-3 bg-white bg-opacity-50 border border-zinc-300 rounded-2xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <span className="text-slate-600 font-medium">to</span>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      handleDateRangeChange("endDate", e.target.value)
                    }
                    className="px-4 py-3 bg-white bg-opacity-50 border border-zinc-300 rounded-2xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleViewSetting("showAdvancedMetrics")}
                  className={`px-4 py-3 rounded-2xl font-bold transition-all duration-200 flex items-center space-x-2 transform hover:scale-105 ${
                    viewSettings.showAdvancedMetrics
                      ? "bg-purple-100 text-gray-900 shadow-lg"
                      : "bg-white bg-opacity-50 text-slate-800 border border-zinc-300 hover:bg-opacity-70"
                  }`}
                >
                  {viewSettings.showAdvancedMetrics ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                  <span className="tracking-wide">ADVANCED</span>
                </button>

                <button
                  onClick={exportData}
                  className="bg-white bg-opacity-50 text-slate-800 px-4 py-3 rounded-2xl font-bold shadow-lg hover:bg-opacity-70 transition-all duration-200 border border-zinc-300 flex items-center space-x-2 transform hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span className="tracking-wide">EXPORT</span>
                </button>

                <button
                  onClick={fetchDashboardData}
                  className="bg-purple-100 text-gray-900 px-4 py-3 rounded-2xl font-black shadow-lg hover:bg-amber-500 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="tracking-wide">REFRESH</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-[25px] border border-zinc-300 p-6 shadow-lg transition-all duration-200 hover:bg-opacity-50 hover:shadow-xl hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-600 tracking-wide uppercase mb-2">
                  Total Workouts
                </p>
                <p className="text-3xl font-mono font-black text-slate-800 tracking-wider mb-1">
                  {stats.totalWorkouts || 0}
                </p>
                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                  {stats.periodWorkouts || 0} this period
                </p>
              </div>
              <div className="bg-blue-100 bg-opacity-50 rounded-2xl p-3">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-[25px] border border-zinc-300 p-6 shadow-lg transition-all duration-200 hover:bg-opacity-50 hover:shadow-xl hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-600 tracking-wide uppercase mb-2">
                  Total Exercises
                </p>
                <p className="text-3xl font-mono font-black text-slate-800 tracking-wider mb-1">
                  {stats.totalExercises || 0}
                </p>
                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                  Unique exercises
                </p>
              </div>
              <div className="bg-green-100 bg-opacity-50 rounded-2xl p-3">
                <Dumbbell className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-[25px] border border-zinc-300 p-6 shadow-lg transition-all duration-200 hover:bg-opacity-50 hover:shadow-xl hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-600 tracking-wide uppercase mb-2">
                  Workout Plans
                </p>
                <p className="text-3xl font-mono font-black text-slate-800 tracking-wider mb-1">
                  {stats.totalPlans || 0}
                </p>
                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                  Available plans
                </p>
              </div>
              <div className="bg-purple-100 bg-opacity-50 rounded-2xl p-3">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-[25px] border border-zinc-300 p-6 shadow-lg transition-all duration-200 hover:bg-opacity-50 hover:shadow-xl hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-600 tracking-wide uppercase mb-2">
                  Avg Duration
                </p>
                <p className="text-3xl font-mono font-black text-slate-800 tracking-wider mb-1">
                  {stats.avgWorkoutDuration || 0}m
                </p>
                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                  Per workout
                </p>
              </div>
              <div className="bg-orange-100 bg-opacity-50 rounded-2xl p-3">
                <Timer className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Metrics */}
        {viewSettings.showAdvancedMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-[25px] border border-zinc-300 p-6 shadow-lg transition-all duration-200 hover:bg-opacity-50 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-600 tracking-wide uppercase mb-2">
                    Current Streak
                  </p>
                  <p className="text-3xl font-mono font-black text-green-600 tracking-wider">
                    {stats.currentStreak || 0} days
                  </p>
                </div>
                <div className="bg-green-100 bg-opacity-50 rounded-2xl p-3">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-[25px] border border-zinc-300 p-6 shadow-lg transition-all duration-200 hover:bg-opacity-50 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-600 tracking-wide uppercase mb-2">
                    Longest Streak
                  </p>
                  <p className="text-3xl font-mono font-black text-yellow-600 tracking-wider">
                    {stats.longestStreak || 0} days
                  </p>
                </div>
                <div className="bg-yellow-100 bg-opacity-50 rounded-2xl p-3">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-[25px] border border-zinc-300 p-6 shadow-lg transition-all duration-200 hover:bg-opacity-50 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-600 tracking-wide uppercase mb-2">
                    Total Volume
                  </p>
                  <p className="text-3xl font-mono font-black text-indigo-600 tracking-wider">
                    {stats.totalVolume || 0}
                  </p>
                </div>
                <div className="bg-indigo-100 bg-opacity-50 rounded-2xl p-3">
                  <BarChart3 className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goal Progress */}
        {goalProgress && (
          <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-[25px] border border-zinc-300 p-8 shadow-lg">
            <h3 className="text-2xl font-mono font-black text-slate-800 tracking-wider mb-6">
              WEEKLY GOAL PROGRESS
            </h3>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">
                  Active Plan: {goalProgress.planName}
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {goalProgress.completed} of {goalProgress.weeklyGoal} workouts
                  completed
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-2xl text-sm font-black tracking-wide ${getGoalProgressColor(
                  goalProgress.percentage
                )}`}
              >
                {goalProgress.percentage}%
              </div>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-2xl h-4 border border-zinc-300">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-2xl transition-all duration-300"
                style={{ width: `${Math.min(goalProgress.percentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Trend Chart */}
          <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-[25px] border border-zinc-300 p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-mono font-black text-slate-800 tracking-wider">
                WEEKLY WORKOUT TREND
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setViewSettings((prev) => ({
                      ...prev,
                      chartType: prev.chartType === "line" ? "area" : "line",
                    }))
                  }
                  className="p-2 rounded-2xl bg-white bg-opacity-50 text-slate-600 hover:bg-opacity-70 transition-all duration-200 border border-zinc-300"
                >
                  {viewSettings.chartType === "line" ? (
                    <BarChart3 className="w-4 h-4" />
                  ) : (
                    <Activity className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {weeklyTrendData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  {viewSettings.chartType === "line" ? (
                    <LineChart data={weeklyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="workouts"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="exercises"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  ) : (
                    <AreaChart data={weeklyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="workouts"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="exercises"
                        stackId="1"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8 font-medium">
                No trend data available
              </p>
            )}
          </div>

          {/* Top Exercises */}
          <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-[25px] border border-zinc-300 p-8 shadow-lg">
            <h3 className="text-xl font-mono font-black text-slate-800 tracking-wider mb-6">
              MOST USED EXERCISES
            </h3>
            {topExercisesData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topExercisesData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8 font-medium">
                No exercise data available
              </p>
            )}
          </div>
        </div>

        {/* All Exercises Section */}
        <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-[25px] border border-zinc-300 p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-mono font-black text-slate-800 tracking-wider">
                ALL EXERCISES COMPLETED
              </h3>
              <span className="bg-blue-100 bg-opacity-50 text-blue-800 text-sm font-bold px-3 py-1 rounded-2xl border border-blue-200">
                {filteredExercises.length} exercises
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-3 bg-white bg-opacity-50 border border-zinc-300 rounded-2xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-48"
                />
              </div>

              {/* Exercise Type Filter */}
              <select
                value={selectedExerciseType}
                onChange={(e) => setSelectedExerciseType(e.target.value)}
                className="px-4 py-3 bg-white bg-opacity-50 border border-zinc-300 rounded-2xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="all">All Types</option>
                {uniqueExerciseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex items-center bg-white bg-opacity-30 border border-zinc-300 rounded-2xl p-1">
                <button
                  onClick={() =>
                    setViewSettings((prev) => ({
                      ...prev,
                      exercisesView: "grid",
                    }))
                  }
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    viewSettings.exercisesView === "grid"
                      ? "bg-white shadow-lg text-purple-600"
                      : "text-slate-600 hover:bg-white hover:bg-opacity-50"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setViewSettings((prev) => ({
                      ...prev,
                      exercisesView: "list",
                    }))
                  }
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    viewSettings.exercisesView === "list"
                      ? "bg-white shadow-lg text-purple-600"
                      : "text-slate-600 hover:bg-white hover:bg-opacity-50"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {filteredExercises.length > 0 ? (
            viewSettings.exercisesView === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExercises.map((exercise, index) => (
                  <div
                    key={`${exercise.workoutId}-${index}`}
                    className="bg-white bg-opacity-30 backdrop-blur-sm rounded-2xl border border-zinc-300 p-6 hover:bg-opacity-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-bold text-slate-800 tracking-wide">
                        {exercise.exerciseTemplate?.name || "Unknown Exercise"}
                      </h4>
                      <div className="flex items-center text-slate-500 bg-white bg-opacity-50 rounded-xl p-2">
                        {getExerciseTypeIcon(exercise.exerciseTemplate?.type)}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between font-medium">
                        <span>Date:</span>
                        <span className="font-bold">
                          {new Date(exercise.workoutDate).toLocaleDateString()}
                        </span>
                      </div>

                      {exercise.reps && (
                        <div className="flex justify-between font-medium">
                          <span>Reps:</span>
                          <span className="font-black text-blue-600">
                            {exercise.reps}
                          </span>
                        </div>
                      )}

                      {exercise.time && (
                        <div className="flex justify-between font-medium">
                          <span>Time:</span>
                          <span className="font-black text-green-600">
                            {exercise.time}s
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between font-medium">
                        <span>Type:</span>
                        <span className="capitalize font-black text-slate-800">
                          {exercise.exerciseTemplate?.type || "unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto bg-white bg-opacity-30 rounded-2xl border border-zinc-300">
                <table className="min-w-full">
                  <thead className="bg-white bg-opacity-20">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-800 uppercase tracking-wider">
                        Exercise
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-800 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-800 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-800 uppercase tracking-wider">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredExercises.map((exercise, index) => (
                      <tr
                        key={`${exercise.workoutId}-${index}`}
                        className="hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="mr-3 text-slate-400 bg-white bg-opacity-50 rounded-xl p-2">
                              {getExerciseTypeIcon(
                                exercise.exerciseTemplate?.type
                              )}
                            </div>
                            <div className="text-sm font-bold text-slate-800">
                              {exercise.exerciseTemplate?.name ||
                                "Unknown Exercise"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-2xl text-xs font-bold capitalize bg-blue-100 bg-opacity-50 text-blue-800 border border-blue-200">
                            {exercise.exerciseTemplate?.type || "unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                          {new Date(exercise.workoutDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            {exercise.reps && (
                              <span className="inline-flex items-center px-3 py-1 rounded-2xl bg-blue-50 bg-opacity-70 text-blue-700 text-xs font-bold border border-blue-200">
                                {exercise.reps} reps
                              </span>
                            )}
                            {exercise.time && (
                              <span className="inline-flex items-center px-3 py-1 rounded-2xl bg-green-50 bg-opacity-70 text-green-700 text-xs font-bold border border-green-200">
                                {exercise.time}s
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <div className="bg-white bg-opacity-50 rounded-2xl p-3 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Activity className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 text-xl font-bold mb-2">
                No exercises found
              </p>
              <p className="text-slate-400 text-sm font-medium">
                {searchTerm || selectedExerciseType !== "all"
                  ? "Try adjusting your filters"
                  : "Complete some workouts to see your exercises here"}
              </p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-[25px] border border-zinc-300 p-8 shadow-lg">
          <h3 className="text-xl font-mono font-black text-slate-800 tracking-wider mb-6">
            RECENT ACTIVITY
          </h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity._id || index}
                  className="flex items-center justify-between py-6 border-b border-zinc-200 last:border-b-0 hover:bg-white hover:bg-opacity-20 rounded-2xl px-4 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-white bg-opacity-50 rounded-2xl p-3">
                      <Clock className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-lg tracking-wide">
                        Workout on{" "}
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mt-2 font-medium">
                        <span>{activity.exercises?.length || 0} exercises</span>
                        {activity.duration && (
                          <span>{activity.duration} minutes</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500 flex flex-wrap gap-2 justify-end">
                      {activity.exercises?.map((ex, i) => (
                        <span
                          key={i}
                          className="inline-block px-3 py-1 bg-white bg-opacity-50 rounded-2xl text-xs font-bold border border-zinc-200"
                        >
                          {ex.exerciseTemplate?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white bg-opacity-50 rounded-2xl p-3 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 text-xl font-bold">
                No recent activity found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
