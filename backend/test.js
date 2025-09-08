const axios = require("axios");
const express = require("express");

const app = express();

app.use(express.json());

const sendData = async () => {
  try {
    const fitnessData = {
      fitness_level: "Intermediate",
      goals: ["muscle_gain", "weight_loss"],
      equipment: ["bodyweight"], // Since "none" means bodyweight only
      days_per_week: 4,
      session_duration: 45, // in minutes
      preferred_exercise_types: [
        "bodyweight",
        "functional_movements",
        "compound_movements",
      ],
      excluded_exercises: ["heavy_squats", "back_squats", "overhead_squats"],
      injuries: ["lower_back"],
    };

    const res = await axios.post(
      "http://localhost:5678/webhook-test/0480acd1-850c-4b53-adbf-6da7af5709d5",
      fitnessData
    );

    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error sending webhook:", error.message);
    throw error;
  }
};

app.get("/data", (req, res) => {
  try {
    const data = req.body;
    if (data) {
      console.log(data);
    }

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error("Error processing workout data:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Test the webhook by visiting: http://localhost:${PORT}/send-webhook`
  );
  sendData();
});
