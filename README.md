# MockMentor 🎯
**AI-Powered Interview Practice Platform**

MockMentor uses Claude AI to conduct personalised mock interviews, grade your performance, and give you actionable feedback — in real time.

---

## ✨ Features

- 🔐 Sign-in / Sign-up flow
- 🎯 4 interview domains: SWE, Data Science, Behavioural, Product
- 📄 PDF resume upload → AI-personalised questions
- 🎙️ Voice (Web Speech API) + text answer modes
- 📹 Webcam feed during interview
- 📊 AI grading with score ring, skill breakdown chart, and feedback
- 📈 Score history across sessions

---

## 🗂️ Project Structure

```
mockmento/
├── backend/          ← Node.js + Express API
│   ├── server.js
│   ├── package.json
│   └── .env.example  ← Copy to .env and add your key
└── frontend/         ← React + Vite + Tailwind
    ├── src/
    │   ├── api.js        ← Centralised API calls
    │   ├── App.jsx       ← Routes with auth guards
    │   ├── main.jsx
    │   ├── index.css
    │   └── pages/
    │       ├── Auth.jsx
    │       ├── Setup.jsx
    │       ├── Resume.jsx
    │       ├── Interview.jsx
    │       └── Results.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started (Local)

### 1. Clone & enter the project
```bash
git clone https://github.com/YOUR_USERNAME/mockmento.git
cd mockmento
```

### 2. Set up the Backend
```bash
cd backend
npm install
cp .env.example .env
# Open .env and add your ANTHROPIC_API_KEY
npm run dev
# ✅ Backend running at http://localhost:5000
```

### 3. Set up the Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
# ✅ Frontend running at http://localhost:5173
```

> The Vite dev server proxies API calls to `localhost:5000` automatically — no CORS issues.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
ANTHROPIC_API_KEY=sk-ant-...     # Required — get at console.anthropic.com
PORT=5000                         # Optional, defaults to 5000
FRONTEND_URL=http://localhost:5173 # For CORS in production
```

### Frontend (`.env` in production)
```env
VITE_API_URL=https://your-backend-url.com
```
In development, leave `VITE_API_URL` empty — Vite proxy handles it.

---

## ☁️ Deployment

### Backend — Railway / Render / Fly.io
1. Push `backend/` folder to a service
2. Set `ANTHROPIC_API_KEY` and `FRONTEND_URL` as environment variables
3. Start command: `npm start`

### Frontend — Vercel / Netlify
1. Push `frontend/` folder
2. Set `VITE_API_URL` to your deployed backend URL
3. Build command: `npm run build`, publish directory: `dist`

---

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Health check |
| POST | `/extract-text` | Extract text from PDF (multipart) |
| POST | `/question` | Generate next interview question |
| POST | `/answer` | Grade full transcript |

---

## 🛠 Tech Stack

**Frontend:** React 18, Vite, React Router v6, Recharts, Tailwind CSS  
**Backend:** Node.js, Express, Multer, pdf-parse, Anthropic SDK  
**AI:** Claude (claude-opus-4-5)
