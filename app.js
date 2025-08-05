const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

const transporter = require("./utils/emailTransporter");

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3002', 'http://127.0.0.1:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Additional middleware
app.use(cors(corsOptions));

// زيادة مهلة الطلب للملفات الكبيرة
app.use((req, res, next) => {
  res.setTimeout(300000, () => {
    console.log('Request has timed out.');
    res.status(408).send('Request Timeout');
  });
  next();
});
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

// Log all requests
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.path);
  next();
});

// Database connection
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/architectbot";

// Enable Mongoose debugging
mongoose.set('debug', true);

// Better connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4 // Use IPv4, skip trying IPv6
};

console.log('Attempting to connect to MongoDB...');
console.log('Connection string:', mongoUri);

// Connect to MongoDB
mongoose.connect(mongoUri, mongooseOptions)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    
    // Verify the connection
    const db = mongoose.connection;
    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    db.once('open', () => {
      console.log('MongoDB connection is open');
    });
    
    // List all collections
    db.db.listCollections().toArray((err, collections) => {
      if (err) {
        console.error('Error listing collections:', err);
        return;
      }
      console.log('Available collections:');
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    console.error('Connection URI used:', mongoUri);
    console.error('Please check if MongoDB is running and accessible');
    
    // Attempt to provide helpful troubleshooting
    if (err.name === 'MongoServerSelectionError') {
      console.error('\nTroubleshooting:');
      console.error('1. Is MongoDB installed and running?');
      console.error('2. Is the connection string correct?');
      console.error('3. Is there a firewall blocking the connection?');
      console.error('4. Is the MongoDB service running? (Run "net start MongoDB" as administrator)');
    }
    
    // Exit with error code if in production
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

// Routes
const faqRoutes = require("./routes/faq");
const uploadRoutes = require("./routes/upload");
const projectRoutes = require("./routes/projects");
const videoRoutes = require("./routes/videos");
const authRoutes = require("./routes/auth");
const cloudinaryRoutes = require("./routes/cloudinary");
const serviceRoutes = require("./routes/services");
const engineerRoutes = require("./routes/engineers");
const userRoutes = require("./routes/users");
const contactRoutes = require("./routes/contact");

// Set a default JWT secret if not provided in environment variables
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "your-default-secret-key";
  console.log("JWT_SECRET not found, using default secret key");
}

console.log("Setting up routes...");
app.use("/api/faq", faqRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/engineers", engineerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);

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
