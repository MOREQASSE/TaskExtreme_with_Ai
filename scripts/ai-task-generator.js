// AI Task Generator Backend Script (Node.js)
// Handles Azure AI Inference API calls securely
// Usage: node scripts/ai-task-generator.js

const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');
const ModelClient = require('@azure-rest/ai-inference').default;
const { isUnexpected } = require('@azure-rest/ai-inference');
const { AzureKeyCredential } = require('@azure/core-auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:8000',
    'http://localhost:3000',
    'https://yourusername.github.io', // Replace with your actual GitHub Pages URL
    'https://*.github.io', // Allow all GitHub Pages domains
    'https://*.railway.app', // Allow all Railway domains
    process.env.FRONTEND_URL // Allow custom frontend URL if set
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload());

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'TaskExtreme AI Backend'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'TaskExtreme AI Backend is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      generateTasks: '/api/ai-generate-tasks'
    }
  });
});

const endpoint = 'https://models.github.ai/inference';
const model = 'openai/gpt-4.1';
const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error('GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

// Helper: Extract text from PDF (simple, for demo)
const pdfParse = async (buffer) => {
  const pdfjsLib = require('pdfjs-dist');
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  return text;
};

// Helper: Get date from day offset
const getDateFromDayOffset = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split('T')[0];
};

// Helper: Get next specific day of week (0=Sunday, 1=Monday, etc.)
const getNextDayOfWeek = (dayOfWeek) => {
  const date = new Date();
  const currentDay = date.getDay();
  const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
  date.setDate(date.getDate() + daysUntilTarget);
  return date.toISOString().split('T')[0];
};

// Helper: Convert time string to 24-hour format
const parseTimeString = (timeStr) => {
  if (!timeStr) return null;
  
  // Handle formats like "3pm", "3:30pm", "15:30", etc.
  const time = timeStr.toLowerCase().trim();
  
  // If already in 24-hour format
  if (/^\d{1,2}:\d{2}$/.test(time)) {
    return time;
  }
  
  // Handle 12-hour format with am/pm
  const match = time.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const period = match[3];
    
    if (period === 'pm' && hours !== 12) {
      hours += 12;
    } else if (period === 'am' && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  return null;
};

app.post('/api/ai-generate-tasks', async (req, res) => {
  try {
    let userContent = '';
    if (req.body.desc && req.body.desc.trim()) {
      userContent = req.body.desc.trim();
    } else if (req.files && req.files.pdf) {
      userContent = await pdfParse(req.files.pdf.data);
    } else if (req.body.sheet && req.body.sheet.trim()) {
      userContent = `The following Google Sheet describes the project: ${req.body.sheet.trim()}`;
    } else {
      return res.status(400).json({ error: 'No valid input provided.' });
    }

    const client = ModelClient(endpoint, new AzureKeyCredential(token));
    const response = await client.path('/chat/completions').post({
      body: {
        messages: [
          { role: 'system', content: (() => {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  const context = req.body.context || {};
  const deadline = context.deadline || 'None';

  return `You are TaskExtreme's AI scheduler. Convert project descriptions into tasks matching this EXACT JSON format:

{
  "tasks": [
    {
      "id": "generated_id_here",
      "title": "Task name",
      "details": "Specific steps",
      "timeStart": "HH:MM",
      "timeEnd": "HH:MM",
      "date": "YYYY-MM-DD",
      "repeat": null,
      "dueDate": "YYYY-MM-DD",
      "completed": false
    }
  ]
}

CRITICAL DATE/TIME PARSING RULES:
1. Current date: ${currentDate}
2. ALWAYS extract date/time information from user input:
   - "tomorrow" = current date + 1 day
   - "next week" = current date + 7 days
   - "morning" = 08:00-12:00
   - "afternoon" = 13:00-17:00
   - "evening" = 18:00-20:00
   - "night" = 20:00-22:00
   - Specific times like "3pm" = 15:00
   - Days like "Monday" = next Monday from current date
   - "next Monday" = Monday of next week
3. If user specifies a date/time, use that EXACTLY
4. If no date/time specified, distribute across 3-5 days starting from today
5. Time blocks must:
   - Be 30-120 minutes duration
   - Fall within 08:00-20:00 working hours (unless user specifies otherwise)
   - Have buffer time between tasks (at least 15 minutes)
   - Use 24-hour format (HH:MM)
6. Required fields: title, timeStart, timeEnd, date
7. Set repeat to null for one-time tasks
8. Date format: YYYY-MM-DD (NOT day numbers!)
9. NEVER use "day" field, always use "date" field with YYYY-MM-DD format

EXAMPLES OF DATE/TIME PARSING:
- "Tea session with wife tomorrow morning" → date: ${getDateFromDayOffset(1)}, time: 09:00-10:30
- "Meeting next Monday at 2pm" → date: ${getNextDayOfWeek(1)}, time: 14:00-15:30
- "Dinner tonight at 7pm" → date: ${currentDate}, time: 19:00-20:30
- "Weekly team meeting every Monday" → repeat: "days", days: [0] (Monday)

EXAMPLE OUTPUT FOR "Tea session with the wife next friday at 5pm":
{
  "tasks": [
    {
      "id": "ai_123456",
      "title": "Tea session with wife",
      "details": "Evening tea session with wife at 5pm",
      "timeStart": "17:00",
      "timeEnd": "18:30",
      "date": "${getNextDayOfWeek(5)}",
      "repeat": null,
      "dueDate": null,
      "completed": false
    }
  ]
}

EXAMPLE OUTPUT FOR "Build a login page":
{
  "tasks": [
    {
      "id": "ai_123456",
      "title": "Plan login page requirements",
      "details": "Define user stories, wireframes, and technical requirements",
      "timeStart": "09:00",
      "timeEnd": "10:30",
      "date": "${currentDate}",
      "repeat": null,
      "dueDate": null,
      "completed": false
    },
    {
      "id": "ai_789012",
      "title": "Design login UI mockups",
      "details": "Create Figma wireframes and mockups for login page",
      "timeStart": "14:00",
      "timeEnd": "16:00",
      "date": "${getDateFromDayOffset(1)}",
      "repeat": null,
      "dueDate": null,
      "completed": false
    },
    {
      "id": "ai_345678",
      "title": "Implement authentication system",
      "details": "Setup Firebase Auth and implement login/logout functionality",
      "timeStart": "09:00",
      "timeEnd": "11:30",
      "date": "${getDateFromDayOffset(2)}",
      "repeat": null,
      "dueDate": null,
      "completed": false
    },
    {
      "id": "ai_901234",
      "title": "Test login functionality",
      "details": "Write unit tests and integration tests for auth flow",
      "timeStart": "14:00",
      "timeEnd": "15:30",
      "date": "${getDateFromDayOffset(3)}",
      "repeat": null,
      "dueDate": null,
      "completed": false
    }
  ]
}

IMPORTANT: Always use "date" field with YYYY-MM-DD format, never use "day" field with numbers!

NOW PROCESS THIS PROJECT:`;
})() },
          { role: 'user', content: userContent }
        ],
        temperature: 0.7,
        top_p: 1,
        model: model
      }
    });
    if (isUnexpected(response)) {
      throw response.body.error;
    }
    // Improved: Extract the first valid JSON array from the response
    let raw = response.body.choices[0].message.content;
    let jsonArray = null;
    try {
      // Find the first [ ... ] block (non-greedy)
      const arrMatch = raw.match(/\[([\s\S]*?)\]/);
      if (arrMatch) {
        const arrStr = '[' + arrMatch[1] + ']';
        // Try to parse it to validate
        JSON.parse(arrStr);
        jsonArray = arrStr;
      }
    } catch (e) {
      // Parsing failed, fallback to raw
    }
    res.json({ tasks: jsonArray || raw });
  } catch (err) {
    res.status(500).json({ error: err.message || err.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`AI Task Generator backend running on port ${PORT}`);
});

// File upload handling
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('ai-project-pdf');
    const fileUploadBtn = document.querySelector('.file-upload-btn');
    const fileName = fileUploadBtn.querySelector('.file-name');
    const fileHint = fileUploadBtn.querySelector('.file-hint');

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Update the display
            fileName.textContent = file.name;
            fileHint.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
            fileUploadBtn.classList.add('has-file');
        } else {
            // Reset the display
            fileName.textContent = 'Choose PDF file';
            fileHint.textContent = 'Click to browse or drag and drop';
            fileUploadBtn.classList.remove('has-file');
        }
    });

    // Drag and drop functionality
    fileUploadBtn.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileUploadBtn.style.borderColor = 'var(--accent)';
        fileUploadBtn.style.background = 'var(--secondary)';
    });

    fileUploadBtn.addEventListener('dragleave', function(e) {
        e.preventDefault();
        if (!fileUploadBtn.classList.contains('has-file')) {
            fileUploadBtn.style.borderColor = 'var(--border)';
            fileUploadBtn.style.background = 'var(--primary)';
        }
    });

    fileUploadBtn.addEventListener('drop', function(e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            fileInput.files = files;
            fileInput.dispatchEvent(new Event('change'));
        }
    });
});
