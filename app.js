const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import middleware
const ErrorHandler = require("./middleware/errorHandler");
const RequestLogger = require("./middleware/requestLogger");

// Initialize error handlers
ErrorHandler.init();

const app = express();
// Port configuration for different environments
// Replit detection: check for REPLIT_DB_URL or if we're running on replit.dev
const isReplit = process.env.REPLIT_DB_URL || process.env.REPL_ID || process.env.REPL_SLUG;
const port = process.env.PORT || (isReplit ? 3000 : 5000);

console.log('🔧 Environment Detection:');
console.log('- Is Replit:', !!isReplit);
console.log('- Port:', port);
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');

// Middleware setup
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Initialize request logger
const requestLogger = new RequestLogger();
app.use(requestLogger.middleware());
app.use(RequestLogger.securityLogger);

const transporter = require("./utils/emailTransporter");

// CORS Configuration - Updated for Replit compatibility
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allow localhost and Replit domains
    const allowedOrigins = [
      'http://localhost:3002',
      'http://127.0.0.1:3002',
      /\.replit\.dev$/,
      /\.picard\.replit\.dev$/,
      /https:\/\/.*\.replit\.dev$/,
      /https:\/\/.*\.picard\.replit\.dev$/
    ];
    
    const isAllowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') {
        return origin === pattern;
      }
      return pattern.test(origin);
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all for now to debug
    }
  },
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

// Log all requests with more details
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  console.log('User-Agent:', req.headers['user-agent']);
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

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Backend is alive!');
});

// Debug endpoint to test backend
app.get('/api/debug', (req, res) => {
  console.log('🔍 Debug endpoint called');
  res.json({
    status: 'Backend is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: port,
    mongodb: {
      uri: process.env.MONGODB_URI ? 'Connected' : 'Not configured',
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    },
    cors: {
      origin: req.headers.origin,
      userAgent: req.headers['user-agent']
    }
  });
});

// Add logging middleware for all API routes
app.use('/api/*', (req, res, next) => {
  console.log(`🌐 API Request: ${req.method} ${req.path}`);
  console.log('MongoDB Status:', mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected');
  next();
});

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

// Global error handler for API routes
app.use('/api/*', (err, req, res, next) => {
  console.error(`❌ API Error on ${req.method} ${req.path}:`, err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Catch-all for undefined API routes
app.use('/api/*', (req, res) => {
  console.log(`❌ API route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'API route not found',
    path: req.path,
    method: req.method,
    availableRoutes: [
      '/api/projects',
      '/api/services', 
      '/api/videos',
      '/api/faq',
      '/api/auth',
      '/api/contact'
    ]
  });
});

// Error handling middleware (must be last)
app.use(ErrorHandler.notFound);
app.use(ErrorHandler.handle);

// Catch-all handler for React Router (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const host = isReplit ? '0.0.0.0' : 'localhost';
app.listen(port, host, () => {
  console.log(`🚀 Server running on http://${host}:${port}`);
  console.log(`📡 Environment: ${isReplit ? 'Replit' : 'Local'}`);
  console.log(`🌐 External access: ${isReplit ? 'Enabled' : 'Local only'}`);
  
  // Log all registered routes for debugging
  console.log('\n📋 Registered API Routes:');
  console.log('- GET  /health');
  console.log('- GET  /api/debug');
  console.log('- GET  /api/projects');
  console.log('- GET  /api/services');
  console.log('- GET  /api/videos');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/contact');
});
