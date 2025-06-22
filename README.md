# TaskExtreme - AI-Powered Task Management

A modern, AI-enhanced task management application with intelligent task generation.

## Features

- 📅 **Date-based Task Management**: Each calendar date has unique tasks
- 🤖 **AI Task Generation**: Generate tasks from project descriptions, PDFs, or Google Sheets
- 📱 **Mobile-First Design**: Fully responsive interface
- 🎨 **Dark/Light Theme**: Toggle between themes
- 📊 **Calendar View**: Visual task overview with clickable dates
- 📄 **PDF Export**: Export your tasks to PDF
- ⏱️ **Focus Mode**: Pomodoro technique integration
- 🔄 **Task Repeating**: Daily, custom day, or one-time tasks

## Quick Start

### Option 1: Local Development
1. Clone the repository
2. Run `./deploy.sh` for automated setup
3. Or follow manual setup below

### Option 2: Hybrid Hosting (Recommended)
- **Frontend**: GitHub Pages (free)
- **Backend**: Cloud server (Railway/Vercel/Netlify/Glitch)
- See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions

## Setup

### Frontend (Web App)
1. Open `index.html` in your browser
2. Or run a local server: `python -m http.server 8000`
3. Access at `http://localhost:8000`

### AI Backend (Optional)
To enable AI task generation:

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   PORT=3001
   GITHUB_TOKEN=your_github_token_here
   NODE_ENV=development
   FRONTEND_URL=https://yourusername.github.io
   ```

3. **Get a GitHub token:**
   - Go to https://github.com/settings/tokens
   - Create a new token with appropriate permissions
   - Add it to your `.env` file

4. **Start the AI backend:**
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Access the AI backend at:** `http://localhost:3001`

## Deployment Options

### 🚀 Hybrid Hosting (Recommended)
- **Frontend**: GitHub Pages (static hosting)
- **Backend**: Cloud platform (Node.js API)
- **Benefits**: Free frontend, scalable backend, professional setup

**Quick Deploy:**
1. Run `./deploy.sh` for setup guidance
2. Follow [DEPLOYMENT.md](DEPLOYMENT.md) for detailed steps
3. Choose your preferred cloud platform (no credit card required):
   - [Railway](https://railway.app) (recommended - $5/month credit)
   - [Vercel](https://vercel.com) (100GB bandwidth/month)
   - [Netlify](https://netlify.com) (125K function calls/month)
   - [Glitch](https://glitch.com) (completely free)

### 🌐 GitHub Pages Only
- Hosts only the frontend
- AI features won't work without backend
- Good for demo/testing

### ☁️ Full Cloud Deployment
- Deploy everything to a single platform
- More complex setup
- Higher costs

## Usage

### Basic Task Management
- Add tasks manually using the form
- Set time blocks, due dates, and repeat patterns
- Navigate between days using arrows or calendar
- Check off completed tasks

### AI Task Generation
1. Go to the "AI Task Generator" section
2. Enter a project description, upload a PDF, or provide a Google Sheet URL
3. Click "Generate Tasks"
4. AI will create relevant tasks with time blocks and scheduling

### Calendar Navigation
- Click any date in the calendar to navigate to that day
- Use the "Today" button to return to current date
- Week navigation arrows move day by day

## File Structure

```
TaskExtreme/
├── index.html              # Main application
├── styles/
│   └── main.css           # Styling
├── scripts/
│   ├── app.js             # Main application logic
│   ├── calendar2.js       # Calendar functionality
│   ├── ai-task-generator.js # AI backend (Node.js)
│   ├── drag-drop.js       # Drag and drop features
│   ├── pdf-export.js      # PDF generation
│   ├── focus-mode.js      # Pomodoro timer
│   └── theme.js           # Theme switching
├── package.json           # Node.js dependencies
├── render.yaml            # Render deployment config
├── vercel.json            # Vercel deployment config
├── deploy.sh              # Deployment helper script
├── DEPLOYMENT.md          # Detailed deployment guide
└── README.md             # This file
```

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI Backend**: Node.js, Express, Azure AI Inference API
- **PDF Processing**: PDF.js
- **Styling**: Custom CSS with responsive design

## Development

### Adding New Features
1. Create your feature branch
2. Make changes in the appropriate script files
3. Test thoroughly across different devices
4. Update this README if needed

### AI Backend Customization
The AI backend uses Azure's inference API with GPT-4. You can:
- Modify the system prompt in `ai-task-generator.js`
- Add new input types (images, documents)
- Customize task generation rules
- Integrate with other AI providers

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check that your frontend URL is in the CORS origins
2. **API Not Responding**: Verify environment variables and backend logs
3. **GitHub Token Issues**: Ensure token has correct permissions

### Getting Help
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues
- Run `./deploy.sh` for automated setup and testing
- Review browser console for frontend errors
- Check cloud platform logs for backend issues

## License

MIT License - feel free to use and modify as needed.

## Contact

Created by MoReqasse
- Email: reqasse@gmail.com
- Phone: +212-700-82-13-40 