const WorkoutLog = require("../models/WorkoutLog");
const ExerciseTemplate = require("../models/ExerciseTemplate");
const WorkoutPlan = require("../models/WorkoutPlan");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { startDate, endDate, period = "7d" } = req.query;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    // Date filtering logic
    let dateFilter = {};
    const now = new Date();

    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    } else {
      // Default periods
      const periodDays = period === "30d" ? 30 : period === "90d" ? 90 : 7;
      const periodStart = new Date(now.setDate(now.getDate() - periodDays));
      dateFilter = { date: { $gte: periodStart } };
    }

    // 1. Basic Stats
    const totalWorkouts = await WorkoutLog.countDocuments({ user: userId });
    const periodWorkouts = await WorkoutLog.countDocuments({
      user: userId,
      ...dateFilter,
    });
    const totalExercises = await ExerciseTemplate.countDocuments({
      user: userId,
    });
    const totalPlans = await WorkoutPlan.countDocuments({ user: userId });

    // 2. Weekly Trend Data (last 4 weeks)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const weeklyTrend = await WorkoutLog.aggregate([
      { $match: { user: userId, date: { $gte: fourWeeksAgo } } },
      {
        $group: {
          _id: {
            week: { $week: "$date" },
            year: { $year: "$date" },
          },
          workouts: { $sum: 1 },
          totalExercises: { $sum: { $size: "$exercises" } },
        },
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
    ]);

    // 3. Goal Tracking (based on workout plans)
    const activeWorkoutPlan = await WorkoutPlan.findOne({
      user: userId,
      isActive: true,
    });

    let goalProgress = null;
    if (activeWorkoutPlan) {
      const weeklyGoal = activeWorkoutPlan.daysPerWeek || 3;
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);

      const thisWeekWorkouts = await WorkoutLog.countDocuments({
        user: userId,
        date: { $gte: thisWeek },
      });

      goalProgress = {
        weeklyGoal,
        completed: thisWeekWorkouts,
        percentage: Math.round((thisWeekWorkouts / weeklyGoal) * 100),
        planName: activeWorkoutPlan.name,
      };
    }

    // 4. Recent Activity
    const recentLogs = await WorkoutLog.find({
      user: userId,
      ...dateFilter,
    })
      .populate("exercises.exerciseTemplate", "name type")
      .sort({ date: -1 })
      .limit(5);

    // 5. Most Used Exercises
    const exerciseStats = await WorkoutLog.aggregate([
      { $match: { user: userId, ...dateFilter } },
      { $unwind: "$exercises" },
      {
        $group: {
          _id: "$exercises.exerciseTemplate",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "exercisetemplates",
          localField: "_id",
          foreignField: "_id",
          as: "template",
        },
      },
      { $unwind: "$template" },
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalWorkouts,
          periodWorkouts,
          totalExercises,
          totalPlans,
        },
        weeklyTrend,
        goalProgress,
        recentActivity: recentLogs,
        topExercises: exerciseStats,
        period: period,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getDashboardStats };
