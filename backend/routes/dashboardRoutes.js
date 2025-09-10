const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware"); // Adjust path as needed

// Apply authentication middleware to all dashboard routes
router.use(protect);

// Dashboard routes
router.get("/stats", getDashboardStats);

module.exports = router;
