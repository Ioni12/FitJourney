const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
require("dotenv").config();

const userRoutes = require("./routes/userRoute");
const planRoutes = require("./routes/planRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");

connectDb();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/exercises", exerciseRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
