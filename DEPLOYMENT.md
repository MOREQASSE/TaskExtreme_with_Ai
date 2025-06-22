# TaskExtreme Hybrid Hosting Deployment Guide

This guide explains how to deploy TaskExtreme using hybrid hosting:
- **Frontend**: GitHub Pages (static files)
- **Backend**: Cloud server (Node.js AI backend)

## Architecture Overview

```
┌─────────────────┐    HTTP Requests    ┌─────────────────┐
│   GitHub Pages  │ ──────────────────► │  Cloud Server   │
│   (Frontend)    │                     │   (Backend)     │
│                 │ ◄────────────────── │                 │
│ - index.html    │   JSON Responses    │ - Node.js API   │
│ - CSS/JS files  │                     │ - AI Processing │
└─────────────────┘                     └─────────────────┘
```

## Step 1: Deploy Backend to Cloud Platform

### Option A: Railway (Recommended - No Credit Card Required)

1. **Sign up for Railway**:
   - Go to [railway.app](https://railway.app)
   - Create account with GitHub (no credit card needed)
   - Free tier includes $5 credit monthly

2. **Deploy your app**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your TaskExtreme repository
   - Railway will auto-detect Node.js

3. **Set environment variables**:
   - Go to Variables tab
   - Add:
     - `GITHUB_TOKEN`: Your GitHub token for AI API
     - `NODE_ENV`: `production`
     - `PORT`: `3000`

4. **Your app will be available at**:
   - `https://your-app-name.railway.app`

### Option B: Vercel (No Credit Card Required)

1. **Sign up for Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Create account with GitHub (no credit card needed)
   - Free tier includes 100GB bandwidth/month

2. **Deploy your app**:
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Node.js

3. **Set environment variables**:
   - Go to Settings → Environment Variables
   - Add:
     - `GITHUB_TOKEN`: Your GitHub token for AI API
     - `NODE_ENV`: `production`

4. **Your app will be available at**:
   - `https://your-app-name.vercel.app`

### Option C: Netlify Functions (No Credit Card Required)

1. **Sign up for Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Create account with GitHub (no credit card needed)
   - Free tier includes 125K function invocations/month

2. **Deploy your app**:
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build command: `npm install`
   - Publish directory: `/`

3. **Set environment variables**:
   - Go to Site settings → Environment variables
   - Add:
     - `GITHUB_TOKEN`: Your GitHub token for AI API
     - `NODE_ENV`: `production`

4. **Your app will be available at**:
   - `https://your-app-name.netlify.app`

### Option D: Glitch (No Credit Card Required)

1. **Sign up for Glitch**:
   - Go to [glitch.com](https://glitch.com)
   - Create account with GitHub (no credit card needed)
   - Completely free for small projects

2. **Create new project**:
   - Click "New Project" → "Import from GitHub"
   - Enter your repository URL
   - Glitch will clone and set up your project

3. **Set environment variables**:
   - Go to .env file in the editor
   - Add:
     - `GITHUB_TOKEN=your_github_token_here`
     - `NODE_ENV=production`

4. **Your app will be available at**:
   - `https://your-project-name.glitch.me`

### Option E: Render (Requires Credit Card)

1. **Sign up for Render**:
   - Go to [render.com](https://render.com)
   - Create a free account (requires credit card for verification)

2. **Connect your GitHub repository**:
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your TaskExtreme repository

3. **Configure the service**:
   - **Name**: `taskextreme-ai-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Set environment variables**:
   - Go to Environment → Environment Variables
   - Add:
     - `GITHUB_TOKEN`: Your GitHub token for AI API
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (Render will override this)

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Note your app URL: `https://your-app-name.onrender.com`

## Step 2: Update Frontend Configuration

1. **Update API URL in app.js**:
   ```javascript
   // Replace this line in scripts/app.js
   const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
     ? 'http://localhost:3001' 
     : 'https://your-actual-app-name.railway.app'; // Your actual platform URL
   ```

2. **Update CORS in backend**:
   ```javascript
   // In scripts/ai-task-generator.js, update the origin array
   origin: [
     'http://localhost:8000',
     'http://localhost:3000',
     'https://yourusername.github.io', // Your GitHub Pages URL
     'https://*.github.io',
     process.env.FRONTEND_URL
   ]
   ```

## Step 3: Deploy Frontend to GitHub Pages

1. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` (or your default branch)
   - Folder: `/ (root)`
   - Click "Save"

2. **Your site will be available at**:
   - `https://yourusername.github.io/your-repo-name`

## Step 4: Test the Deployment

1. **Test the backend**:
   ```bash
   # For Railway
   curl https://your-app-name.railway.app/health
   
   # For Vercel
   curl https://your-app-name.vercel.app/health
   
   # For Netlify
   curl https://your-app-name.netlify.app/.netlify/functions/ai-task-generator/health
   ```

2. **Test the frontend**:
   - Visit your GitHub Pages URL
   - Try the AI task generation feature

## Environment Variables

### Backend (.env file for local development)
```env
PORT=3001
GITHUB_TOKEN=your_github_token_here
NODE_ENV=development
FRONTEND_URL=https://yourusername.github.io
```

### Production (Set in cloud platform dashboard)
- `GITHUB_TOKEN`: Your GitHub token for AI API
- `NODE_ENV`: `production`
- `FRONTEND_URL`: Your GitHub Pages URL

## Platform Comparison

| Platform | Free Tier | Credit Card Required | Ease of Use | Limitations |
|----------|-----------|---------------------|-------------|-------------|
| **Railway** | $5/month credit | ❌ No | ⭐⭐⭐⭐⭐ | 500 hours/month |
| **Vercel** | 100GB bandwidth | ❌ No | ⭐⭐⭐⭐⭐ | Serverless functions |
| **Netlify** | 125K function calls | ❌ No | ⭐⭐⭐⭐ | Function timeout |
| **Glitch** | Unlimited | ❌ No | ⭐⭐⭐ | Sleeps after inactivity |
| **Render** | 750 hours/month | ✅ Yes | ⭐⭐⭐⭐ | Sleeps after inactivity |

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check that your GitHub Pages URL is in the CORS origins
   - Verify the backend URL is correct in app.js

2. **API Not Responding**:
   - Check platform logs
   - Verify environment variables are set
   - Test the health endpoint

3. **GitHub Token Issues**:
   - Ensure token has correct permissions
   - Check token is not expired
   - Verify token is set in environment variables

### Debugging

1. **Check backend logs**:
   - Railway: Deployments → Latest → View logs
   - Vercel: Functions → View function logs
   - Netlify: Functions → View function logs
   - Glitch: Console tab in editor

2. **Test API endpoints**:
   ```bash
   # Health check
   curl https://your-app-url/health
   
   # Test AI endpoint
   curl -X POST https://your-app-url/api/ai-generate-tasks \
     -H "Content-Type: application/json" \
     -d '{"desc":"Test task"}'
   ```

## Cost Considerations

### Free Tier Limits
- **Railway**: $5/month credit (free tier)
- **Vercel**: 100GB bandwidth/month (free tier)
- **Netlify**: 125K function invocations/month (free tier)
- **Glitch**: Unlimited (free tier)
- **Render**: 750 hours/month (free tier)

### Scaling
- Upgrade to paid plans for more resources
- Consider caching strategies for AI responses
- Implement rate limiting for API calls

## Security Considerations

1. **Environment Variables**:
   - Never commit `.env` files
   - Use platform-specific secret management
   - Rotate tokens regularly

2. **CORS Configuration**:
   - Only allow necessary origins
   - Use HTTPS in production
   - Validate input data

3. **API Security**:
   - Consider adding API key authentication
   - Implement rate limiting
   - Validate file uploads

## Monitoring

1. **Set up monitoring**:
   - Railway: Built-in monitoring
   - Vercel: Analytics and monitoring
   - Netlify: Function logs and analytics
   - Glitch: Console logs
   - Render: Built-in monitoring

2. **Health checks**:
   - Monitor `/health` endpoint
   - Set up uptime monitoring
   - Configure alerts for downtime

## Next Steps

1. **Custom Domain**:
   - Add custom domain to GitHub Pages
   - Update CORS configuration
   - Configure SSL certificates

2. **Performance Optimization**:
   - Implement caching
   - Optimize bundle sizes
   - Add CDN for static assets

3. **Advanced Features**:
   - Add user authentication
   - Implement database storage
   - Add real-time features 