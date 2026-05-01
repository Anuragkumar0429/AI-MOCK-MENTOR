<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=🤖%20AI-MOCK-MENTOR&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=The%20Intelligent%20Virtual%20Interviewer%20Platform&descAlignY=58&descSize=18&animation=fadeIn" width="100%"/>

<br/>

<p>
  <img src="https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=for-the-badge&logo=statuspage&logoColor=white"/>
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge&logo=semver&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=opensourceinitiative&logoColor=white"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-ff69b4?style=for-the-badge&logo=github&logoColor=white"/>
</p>

<p>
  <img src="https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
</p>

<br/>

> ### *"Practice like it's real. Perform like it's practice."*
> AI-Mock-Mentor conducts adaptive mock interviews powered by AI — analyzing your speech, confidence, and technical knowledge to make you interview-ready in record time.

<br/>

<a href="#-demo">🎮 Live Demo</a> · <a href="#-features">✨ Features</a> · <a href="#-tech-stack">🛠 Tech Stack</a> · <a href="#-getting-started">🚀 Get Started</a> · <a href="#-contributing">🤝 Contribute</a>

<br/>

</div>

---

## 🎯 Project Objective

**AI-Mock-Mentor** is a full-stack, AI-powered interview simulation platform built for:

- 🎓 **Students** preparing for campus placements
- 💼 **Job Seekers** targeting product-based and service-based companies
- 🧠 **Developers** grinding for FAANG/MAANG-level technical interviews
- 📈 **Professionals** leveling up their communication and leadership interview skills

It doesn't just ask questions — it *thinks*, *adapts*, and *coaches* you like a real human interviewer would.

---

## ✨ Features

<details>
<summary><b>🧠 1. Smart Adaptive AI Interviewer</b></summary>

<br/>

- **Dynamic Difficulty Scaling** — The AI analyzes each response and adjusts the complexity of the next question accordingly.
- **Domain-Specific Tracks** — Choose from:
  - 💻 Software Development
  - 📊 Data Science & ML
  - 🏢 HR & Behavioral
  - 📚 MBA & Group Discussion
- **HR + Technical Mix** — Simulates real-world interview rounds with a blend of soft-skill and hard-skill questions.

</details>

<details>
<summary><b>📄 2. Resume-Based Personalized Questions (Advanced)</b></summary>

<br/>

- **Upload your resume** (PDF/DOCX) and the AI parses it to extract your skills, projects, and experience.
- **Hyper-Personalized Questions** — If you listed Python and a web-scraping project, expect:
  - *"Walk me through the architecture of your web scraper."*
  - *"How did you handle rate-limiting and anti-bot mechanisms?"*
- Every interview is **uniquely yours** — no two sessions are identical.

</details>

<details>
<summary><b>📊 3. AI Feedback & Performance Analytics</b></summary>

<br/>

After every session, receive a **comprehensive performance report** with:

| Metric | What It Measures |
|--------|-----------------|
| 🗣️ Communication Score | Clarity, pace, vocabulary, and filler word frequency |
| 🧪 Technical Accuracy | Correctness and depth of technical answers |
| 💪 Confidence Score | Vocal tone, hesitation, and eye contact (video mode) |
| ⭐ Overall Rating | Weighted composite score out of 10 |

**Actionable Feedback Examples:**
- *"You used 'um' 14 times. Practice pausing instead of filling silence."*
- *"Your answer lacked depth — explain time complexity next time."*
- *"Maintain eye contact with the camera to project confidence."*

</details>

<details>
<summary><b>💻 4. Coding Interview Mode 🔥 (Killer Feature)</b></summary>

<br/>

A full **in-browser technical assessment environment**:

- **Integrated Code Editor** — Syntax highlighting, auto-complete, multi-language support
- **Question Bank** covering DSA, SQL Queries, and Python Scripting
- **Auto Code Evaluation** — AI reviews your solution for correctness, efficiency, and code style
- **Live Timer** — Simulates real interview pressure with configurable time limits
- **Hints System** — Reveal progressive hints without spoiling the full solution

</details>

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js + Tailwind CSS | Responsive, interactive UI |
| **Backend** | Node.js + Express.js | RESTful API, routing, auth |
| **AI Engine** | FastAPI / Flask (Python) | LLM integration, NLP processing |
| **LLM** | OpenAI GPT-4 API | Question generation, feedback analysis |
| **Voice Analysis** | Web Speech API + NLP | Filler word detection, pacing metrics |
| **Video Analysis** | OpenCV + MediaPipe | Facial expression & confidence scoring |
| **Database** | MongoDB / Firebase | User data, session history, analytics |
| **Auth** | JWT + OAuth 2.0 | Secure user authentication |

---

## 🏗️ System Architecture

┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│              React.js  ·  Tailwind CSS  ·  WebRTC           │
└──────────────────────────┬──────────────────────────────────┘
│ HTTPS / WebSocket
┌──────────────────────────▼──────────────────────────────────┐
│                        API GATEWAY                           │
│              Node.js  ·  Express.js  ·  JWT Auth            │
└──────┬──────────────────┬──────────────────────┬────────────┘
│                  │                      │
┌──────▼───────┐  ┌───────▼──────┐  ┌───────────▼───────────┐
│   MongoDB    │  │  AI Service  │  │    Media Processor     │
│  (Sessions,  │  │  FastAPI +   │  │   OpenCV · MediaPipe   │
│   Profiles)  │  │  OpenAI API  │  │   Speech Recognition   │
└──────────────┘  └──────────────┘  └───────────────────────┘
---

## 🚀 Getting Started

### ✅ Prerequisites

```bash
node >= 18.0.0
npm  >= 9.0.0
python >= 3.10
mongodb >= 6.0
```

### 📦 Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/ai-mock-mentor.git
cd ai-mock-mentor
```

**2. Setup the Frontend**
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

**3. Setup the Backend (Node.js)**
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

**4. Setup the AI Service (Python)**
```bash
cd ai-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

**5. Environment Variables**

```env
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:5000
VITE_AI_SERVICE_URL=http://localhost:8000

# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aimockmentor
JWT_SECRET=your_jwt_secret_here
OPENAI_API_KEY=your_openai_api_key_here

# AI Service (.env)
OPENAI_API_KEY=your_openai_api_key_here
ALLOWED_ORIGINS=http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) and start your mock interview! 🎉

---

## 📁 Project Structure

ai-mock-mentor/
│
├── 📂 client/                    # React.js Frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Interview.jsx     # Live interview room
│   │   │   ├── CodingMode.jsx    # Technical coding round
│   │   │   └── Report.jsx        # Performance analytics
│   │   ├── hooks/
│   │   ├── context/
│   │   └── services/
│   └── package.json
│
├── 📂 server/                    # Node.js + Express Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
│
├── 📂 ai-service/                # Python AI Engine (FastAPI)
│   ├── routers/
│   │   ├── questions.py
│   │   ├── feedback.py
│   │   └── vision.py
│   ├── services/
│   │   ├── llm_service.py
│   │   ├── nlp_service.py
│   │   └── cv_service.py
│   ├── main.py
│   └── requirements.txt
│
├── docker-compose.yml
└── README.md

---

## 🗺️ Roadmap

- [x] Core AI interview engine (GPT-4 integration)
- [x] Text-based mock interview sessions
- [x] Real-time performance scoring
- [x] Coding interview mode with code editor
- [x] Resume parsing & personalized questions
- [ ] 🔄 Voice mode with real-time transcription
- [ ] 🔄 Video mode with emotion & confidence analysis
- [ ] 🔄 Group Discussion / GD simulation mode
- [ ] 🔄 Mobile app (React Native)
- [ ] 🔄 Company-specific interview packs (Google, Amazon, etc.)

---

## 🤝 Contributing

Contributions are what make the open-source community thrive. Any contribution you make is **greatly appreciated**!

```bash
# Fork the project
# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m "feat: add AmazingFeature"

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

---

## 📬 Connect With Me

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/YOUR_PROFILE)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/YOUR_HANDLE)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://yourportfolio.dev)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your.email@gmail.com)

</div>

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 🙏 Acknowledgements

- [OpenAI](https://openai.com) — For the powerful GPT-4 API
- [Shields.io](https://shields.io) — For beautiful badges
- [Capsule Render](https://github.com/kyechan99/capsule-render) — For the animated banner
- [FastAPI](https://fastapi.tiangolo.com) — For the blazing-fast Python API layer

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=120&section=footer&animation=fadeIn" width="100%"/>

**If this project helped you, please ⭐ star the repo — it means the world!**

Made with ❤️ by **[Your Name](https://github.com/YOUR_USERNAME)**

</div>
