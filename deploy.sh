#!/bin/bash

# TaskExtreme Hybrid Deployment Script
# This script helps you deploy TaskExtreme to GitHub Pages + Cloud Backend

echo "🚀 TaskExtreme Hybrid Deployment Script"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the TaskExtreme root directory"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists git; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "📝 Creating .env template..."
    cat > .env << EOF
# TaskExtreme Environment Variables
PORT=3001
GITHUB_TOKEN=your_github_token_here
NODE_ENV=development
FRONTEND_URL=https://yourusername.github.io
EOF
    echo "📝 Please edit .env file with your actual values"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test local backend
echo "🧪 Testing local backend..."
echo "Starting backend server..."
echo "Press Ctrl+C to stop the test server"
echo ""

# Start backend in background
node scripts/ai-task-generator.js &
BACKEND_PID=$!

# Wait a moment for server to start
sleep 3

# Test health endpoint
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend is running successfully!"
else
    echo "❌ Backend failed to start. Check the logs above."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Stop test server
kill $BACKEND_PID 2>/dev/null

echo ""
echo "🎉 Local setup complete!"
echo ""
echo "📋 Next steps for deployment:"
echo ""
echo "1. 🚀 Deploy Backend to Cloud (No Credit Card Required):"
echo ""
echo "   Option A: Railway (Recommended)"
echo "   • Go to https://railway.app"
echo "   • Create account with GitHub (no credit card needed)"
echo "   • Click 'New Project' → 'Deploy from GitHub repo'"
echo "   • Set environment variables:"
echo "     - GITHUB_TOKEN=your_token"
echo "     - NODE_ENV=production"
echo ""
echo "   Option B: Vercel"
echo "   • Go to https://vercel.com"
echo "   • Create account with GitHub (no credit card needed)"
echo "   • Import your repository"
echo "   • Set environment variables in dashboard"
echo ""
echo "   Option C: Netlify"
echo "   • Go to https://netlify.com"
echo "   • Create account with GitHub (no credit card needed)"
echo "   • Deploy from Git repository"
echo "   • Set environment variables in site settings"
echo ""
echo "   Option D: Glitch"
echo "   • Go to https://glitch.com"
echo "   • Create account with GitHub (no credit card needed)"
echo "   • Import from GitHub repository"
echo "   • Add environment variables in .env file"
echo ""
echo "2. 🌐 Deploy Frontend to GitHub Pages:"
echo "   - Go to your GitHub repository"
echo "   - Settings → Pages"
echo "   - Source: Deploy from a branch"
echo "   - Branch: main, Folder: / (root)"
echo ""
echo "3. ⚙️  Update Configuration:"
echo "   - Update API_BASE_URL in scripts/app.js"
echo "   - Update CORS origins in scripts/ai-task-generator.js"
echo "   - Replace 'yourusername' with your actual GitHub username"
echo ""
echo "4. 🧪 Test Deployment:"
echo "   - Visit your GitHub Pages URL"
echo "   - Test AI task generation"
echo "   - Check browser console for errors"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🔧 Useful commands:"
echo "   npm start          - Start backend locally"
echo "   npm run dev        - Start backend with auto-restart"
echo "   python -m http.server 8000  - Serve frontend locally"
echo "" 