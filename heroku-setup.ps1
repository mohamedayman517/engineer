# Heroku Setup Script for ChatBot Project (PowerShell)
Write-Host "🚀 Setting up ChatBot project for Heroku deployment..." -ForegroundColor Green

# Check if Heroku CLI is installed
try {
    heroku --version | Out-Null
    Write-Host "✅ Heroku CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Heroku CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Yellow
    exit 1
}

# Login to Heroku
Write-Host "📝 Please login to Heroku..." -ForegroundColor Cyan
heroku login

# Create new Heroku app (or use existing)
$APP_NAME = Read-Host "Enter your Heroku app name (or press Enter to generate one)"

if ([string]::IsNullOrWhiteSpace($APP_NAME)) {
    Write-Host "🎲 Creating new Heroku app..." -ForegroundColor Yellow
    heroku create
} else {
    Write-Host "🎯 Creating Heroku app: $APP_NAME" -ForegroundColor Yellow
    heroku create $APP_NAME
}

# Set environment variables
Write-Host "🔧 Setting up environment variables..." -ForegroundColor Cyan
Write-Host "Please provide the following information:" -ForegroundColor White

$MONGODB_URI = Read-Host "MongoDB URI"
$JWT_SECRET = Read-Host "JWT Secret"
$EMAIL_USER = Read-Host "Email User"
$EMAIL_PASS = Read-Host "Email Password" -AsSecureString
$EMAIL_PASS_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($EMAIL_PASS))
$CLOUDINARY_CLOUD_NAME = Read-Host "Cloudinary Cloud Name"
$CLOUDINARY_API_KEY = Read-Host "Cloudinary API Key"
$CLOUDINARY_API_SECRET = Read-Host "Cloudinary API Secret" -AsSecureString
$CLOUDINARY_API_SECRET_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($CLOUDINARY_API_SECRET))

# Set config vars
Write-Host "⚙️ Setting Heroku config variables..." -ForegroundColor Yellow
heroku config:set MONGODB_URI="$MONGODB_URI"
heroku config:set JWT_SECRET="$JWT_SECRET"
heroku config:set EMAIL_USER="$EMAIL_USER"
heroku config:set EMAIL_PASS="$EMAIL_PASS_PLAIN"
heroku config:set CLOUDINARY_CLOUD_NAME="$CLOUDINARY_CLOUD_NAME"
heroku config:set CLOUDINARY_API_KEY="$CLOUDINARY_API_KEY"
heroku config:set CLOUDINARY_API_SECRET="$CLOUDINARY_API_SECRET_PLAIN"
heroku config:set NODE_ENV="production"

Write-Host "✅ Environment variables set successfully!" -ForegroundColor Green

# Deploy to Heroku
Write-Host "🚀 Deploying to Heroku..." -ForegroundColor Cyan
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Opening your app..." -ForegroundColor Cyan
heroku open

Write-Host "📊 View logs with: heroku logs --tail" -ForegroundColor Yellow
