# Architecture ChatBot

A full-stack chatbot application built with React frontend and Node.js backend.

## Features

- Interactive chat interface
- FAQ management system
- MongoDB database integration
- Responsive design

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start MongoDB locally or update MONGODB_URI in .env
5. Seed the database:
   ```bash
   npm run seed
   ```
6. Start development server:
   ```bash
   npm run watch
   ```
7. In another terminal, start the frontend:
   ```bash
   npm run dev
   ```

## Production Deployment (Railway)

### Automatic Deployment

1. Connect your GitHub repository to Railway
2. Railway will automatically detect the configuration
3. Add MongoDB service to your Railway project
4. Set environment variables in Railway dashboard:
   - `MONGODB_URI`: Your MongoDB connection string

### Manual Deployment

1. Install Railway CLI
2. Login: `railway login`
3. Deploy: `railway up`

## Scripts

- `npm start`: Start production server
- `npm run dev`: Start Vite development server
- `npm run build`: Build React app for production
- `npm run watch`: Start backend with nodemon
- `npm run seed`: Seed database with sample data

## Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string

## Project Structure

```
├── src/                 # React frontend source
├── public/             # Static assets
├── routes/             # Express routes
├── models/             # MongoDB models
├── app.js              # Express server
├── seed.js             # Database seeder
└── dist/               # Built React app (generated)
```
