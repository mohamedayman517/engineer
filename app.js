const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, "dist")));

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
const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/architectbot";
mongoose
  .connect(mongoUri, {})
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

// Serve React app for specific routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
