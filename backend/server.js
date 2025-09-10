const express = require("express");
const cors = require("cors");
const path = require("path"); // <-- missing import
const connectDb = require("./config/db");
require("dotenv").config();

const userRoutes = require("./routes/userRoute");
const planRoutes = require("./routes/planRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

connectDb();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes first
app.use("/api/user", userRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Serve frontend build
app.use(express.static(path.join(__dirname, "build")));

// Catch-all: send index.html for SPA routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
