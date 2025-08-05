// Vercel API Route Handler
// This file ensures that all API routes work properly on Vercel

const app = require('../app');

// Export the Express app as a Vercel serverless function
module.exports = app;
