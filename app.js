const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Basic Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, "dist")));

// Database connection
const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/architectbot";
mongoose.connect(mongoUri)
  .then(() => {
    console.log("✅ connected to DB");
  })
  .catch((err) => {
    console.error("❌ Error connecting to DB:", err);
    process.exit(1);
  });

// Routes
const faqRoutes = require("./routes/faq");
app.use("/api", faqRoutes);

// The "catchall" handler: for any request that doesn't match an API route,
// send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler caught:", err);
  console.error("Error stack:", err.stack);
  if (!res.headersSent) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
