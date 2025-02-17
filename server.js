// backend/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jobRoutes = require("./routes/jobRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Use the job routes
app.use('/api', jobRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Job Tracker API is running...");
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
