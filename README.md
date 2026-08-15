PROJECT: AI-Powered Smart Career & Resume Analytics Engine
TECH STACK: MERN + Google Gemini AI
DEPLOYMENT: Backend (Render), Frontend (Vercel)
GITHUB: https://github.com/GAkshaya5/Resume_AI_Analyzer

================================================================================
STEP 1 – PROJECT ARCHITECTURE & FOLDER STRUCTURE
================================================================================

Monorepo with two main folders:
- server/  → Node.js + Express backend
- client/  → React + Vite frontend

Full structure:

resume-ai-analyzer/
├── server/
│   ├── config/db.js
│   ├── controllers/resumeController.js
│   ├── middleware/uploadMiddleware.js
│   ├── middleware/errorHandler.js
│   ├── models/JobAnalysis.js
│   ├── routes/resumeRoutes.js
│   ├── services/geminiService.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── FileUpload.jsx
    │   │   ├── ScoreGauge.jsx
    │   │   ├── SkillGap.jsx
    │   │   └── InterviewPrep.jsx
    │   ├── services/api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js

================================================================================
STEP 2 – BACKEND SETUP (Node + Express + MongoDB)
================================================================================

2.1 Install dependencies (inside server/):
    npm init -y
    npm install express mongoose dotenv cors multer pdf-parse @google/generative-ai
    npm install --save-dev nodemon

2.2 Key backend files:
    - config/db.js          : Mongoose connection to MONGO_URI
    - models/JobAnalysis.js : Schema (candidateName, targetRole, jobDescription,
                              matchScore, matchingSkills, missingSkills,
                              experienceFeedback, recommendedCourses,
                              interviewQuestions, createdAt)
    - middleware/uploadMiddleware.js : Multer memoryStorage, accepts PDF only, 5MB limit
    - middleware/errorHandler.js : Global error handler for PDF, AI, Multer errors
    - services/geminiService.js : analyzeResumeWithAI(pdfText, JD, role)
          * Uses @google/generative-ai with model "gemini-1.5-flash"
          * Sends strict prompt, returns JSON matching schema
          * Throws AI_API_ERROR on failure
    - controllers/resumeController.js :
          * analyzeResume : receives file, parses PDF, calls Gemini, saves to MongoDB
          * getHistory : returns last 10 analyses (sorted by createdAt)
    - routes/resumeRoutes.js :
          * POST /api/resume/analyze  (with upload middleware)
          * GET  /api/resume/history
    - server.js : Express app with CORS (allowed origins from CLIENT_URL),
          JSON middleware, health check /healthz, routes, error handler,
          listens on PORT (default 5000)

2.3 Environment variables (server/.env):
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/resume_analytics   (or Atlas URI)
    GEMINI_API_KEY=your_gemini_key_here   (starts with AQ... or AIza...)
    CLIENT_URL=http://localhost:5173      (or your deployed Vercel URL)

================================================================================
STEP 3 – FRONTEND SETUP (React + Vite + Tailwind)
================================================================================

3.1 Install dependencies (inside client/):
    npm create vite@latest . -- --template react
    npm install axios lucide-react framer-motion clsx tailwind-merge
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p

3.2 Key frontend files:
    - services/api.js : Axios instance with baseURL from VITE_API_BASE_URL
          * analyzeResume(formData) – POST /api/resume/analyze
          * getHistory() – GET /api/resume/history
    - components/FileUpload.jsx : Drag‑and‑drop PDF uploader, target role & JD inputs,
          submit button with loading spinner, sends FormData
    - components/ScoreGauge.jsx : SVG circular gauge with dynamic color
          (green ≥75, yellow 50‑74, red <50) and experienceFeedback display
    - components/SkillGap.jsx : Pill badges for matching/missing skills,
          grid of recommended courses
    - components/InterviewPrep.jsx : Accordion rendering AI questions with context
    - App.jsx : Dashboard with upload form, result display (ScoreGauge + SkillGap +
          InterviewPrep), history cards fetched on load and after new analysis

3.3 Environment variables (client/.env):
    VITE_API_BASE_URL=http://localhost:5000

================================================================================
STEP 4 – LOCAL TESTING
================================================================================

4.1 Start backend (in server/):
    npm run dev   → runs on http://localhost:5000

4.2 Start frontend (in client/ – new terminal):
    npm run dev   → runs on http://localhost:5173 (or 5174 if port busy)

4.3 Test flow:
    - Open http://localhost:5173
    - Upload a PDF, fill target role and job description
    - Click "Analyze Resume"
    - Verify loading spinner, results appear, history updates

4.4 Troubleshooting:
    - Ensure MongoDB service is running (local or Atlas)
    - Confirm GEMINI_API_KEY is valid (AQ... or AIza... format)
    - Check backend logs and browser console for errors
    - If port 5000 is in use, change PORT in .env and update VITE_API_BASE_URL

================================================================================
STEP 5 – DEPLOYMENT WORKFLOW
================================================================================

5.1 MongoDB Atlas (Production Database)
    - Create a free M0 cluster on MongoDB Atlas
    - Create a database user (username/password)
    - Network Access → IP Whitelist → add 0.0.0.0/0 (allow from anywhere)
    - Get connection string:
        mongodb+srv://<username>:<password>@cluster0.mongodb.net/resume_analytics?retryWrites=true&w=majority

5.2 Backend → Render
    - Push code to GitHub (ensure .env is in .gitignore)
    - Log in to Render.com → New Web Service → connect GitHub repo
    - Configure:
        Name: resume-ai-backend
        Root Directory: server
        Build Command: npm install
        Start Command: node server.js
    - Add environment variables (same as .env but with Atlas URI)
    - Deploy → get URL like https://resume-ai-backend.onrender.com

5.3 Frontend → Vercel
    - Log in to Vercel.com → Add New Project → import GitHub repo
    - Configure:
        Framework Preset: Vite
        Root Directory: client
        Build Command: npm run build
        Output Directory: dist
    - Add environment variable:
        VITE_API_BASE_URL = your Render backend URL (e.g., https://resume-ai-backend.onrender.com)
    - Deploy → get URL like https://resume-ai-analyzer.vercel.app

5.4 Final CORS Update
    - Go back to Render → Environment → update CLIENT_URL to your Vercel URL
    - Redeploy if needed

================================================================================
STEP 6 – GEMINI API KEY (Correct Format)
================================================================================

- Go to Google AI Studio (https://aistudio.google.com/)
- Click "Get API Key" → select or create a project
- Click "Create API Key" – copy the key (starts with AQ... or AIza...)
- Both formats work with the latest @google/generative-ai SDK
- Never share it publicly. Store only in .env and Render environment variables.

================================================================================
STEP 7 – GIT WORKFLOW & README
================================================================================

- Initialize Git, add remote (your GitHub repo), commit and push.
- Add a professional README.md containing:
    - Project overview, features, tech stack
    - Workflow diagram (user → frontend → backend → Gemini → MongoDB → response)
    - Local setup instructions (clone, install, run)
    - Deployment steps (Render + Vercel)
    - Environment variables summary
    - Folder structure
    - Acknowledgements

================================================================================
STEP 8 – LIVE TESTING
================================================================================

- Open your Vercel frontend URL
- Upload a sample PDF, enter target role and job description
- Click Analyze – AI should respond, results appear, history stored in Atlas
- Check Render logs for any errors

================================================================================
ENVIRONMENT VARIABLES SUMMARY (Production)
================================================================================

| Variable            | Where        | Purpose                                      |
|---------------------|--------------|----------------------------------------------|
| PORT                | server/.env  | Backend port (usually 5000)                  |
| MONGO_URI           | server/.env  | MongoDB connection string (Atlas)            |
| GEMINI_API_KEY      | server/.env  | Google Gemini API key                        |
| CLIENT_URL          | server/.env  | Allowed CORS origin (your Vercel URL)        |
| VITE_API_BASE_URL   | client/.env  | Backend URL for frontend (Render URL)        |

================================================================================
FINAL NOTES
================================================================================

- All code is production‑ready with error handling and logging.
- The app is fully functional after deployment – share the Vercel link.
- For local development, use npm run dev in both folders.
- Security: never commit .env; rotate keys if exposed.

================================================================================
END OF SUMMARY
================================================================================
