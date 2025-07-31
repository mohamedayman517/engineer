const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

// Set UTF-8 encoding
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// Log all requests
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.path);
  next();
});

// Database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/architectbot", {})
  .then(() => {
    console.log("✅ connected to DB");
  })
  .catch((err) => {
    console.error("❌ Error connecting to DB:", err);
  });

// Routes
const faqRoutes = require("./routes/faq");
console.log("Setting up routes...");
app.use("/api", faqRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
