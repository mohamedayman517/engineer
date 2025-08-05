#!/bin/bash

# Heroku Setup Script for ChatBot Project
echo "🚀 Setting up ChatBot project for Heroku deployment..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first:"
    echo "https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Login to Heroku
echo "📝 Please login to Heroku..."
heroku login

# Create new Heroku app (or use existing)
read -p "Enter your Heroku app name (or press Enter to generate one): " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "🎲 Creating new Heroku app..."
    heroku create
else
    echo "🎯 Creating Heroku app: $APP_NAME"
    heroku create $APP_NAME
fi

# Set environment variables
echo "🔧 Setting up environment variables..."
echo "Please provide the following information:"

read -p "MongoDB URI: " MONGODB_URI
read -p "JWT Secret: " JWT_SECRET
read -p "Email User: " EMAIL_USER
read -s -p "Email Password: " EMAIL_PASS
echo
read -p "Cloudinary Cloud Name: " CLOUDINARY_CLOUD_NAME
read -p "Cloudinary API Key: " CLOUDINARY_API_KEY
read -s -p "Cloudinary API Secret: " CLOUDINARY_API_SECRET
echo

# Set config vars
heroku config:set MONGODB_URI="$MONGODB_URI"
heroku config:set JWT_SECRET="$JWT_SECRET"
heroku config:set EMAIL_USER="$EMAIL_USER"
heroku config:set EMAIL_PASS="$EMAIL_PASS"
heroku config:set CLOUDINARY_CLOUD_NAME="$CLOUDINARY_CLOUD_NAME"
heroku config:set CLOUDINARY_API_KEY="$CLOUDINARY_API_KEY"
heroku config:set CLOUDINARY_API_SECRET="$CLOUDINARY_API_SECRET"
heroku config:set NODE_ENV="production"

echo "✅ Environment variables set successfully!"

# Deploy to Heroku
echo "🚀 Deploying to Heroku..."
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main

echo "🎉 Deployment complete!"
echo "🌐 Opening your app..."
heroku open

echo "📊 View logs with: heroku logs --tail"
