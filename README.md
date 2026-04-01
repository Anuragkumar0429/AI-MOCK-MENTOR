# 🤖 AI-MOCK-MENTOR (AI Virtual Interviewer)

**AI Virtual Interviewer** is a smart, full-stack web platform designed to conduct mock interviews just like a real human interviewer using Artificial Intelligence. It dynamically asks questions, analyzes user responses (via text, voice, or video), and provides instant, actionable feedback on communication, confidence, and technical knowledge. 

Built as a top-tier portfolio and startup-level project, this platform is perfect for students preparing for placements, job seekers, and developers practicing for FAANG/tech interviews.

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS *(Update these if you used something else)*
* **Backend:** Node.js, Express.js, Python (FastAPI/Flask for AI integration)
* **AI & Machine Learning:** * OpenAI API / LLMs (For dynamic question generation & feedback)
    * SpeechRecognition API (For voice analysis)
    * OpenCV (For facial expression and confidence analysis)
    * NLP (For analyzing answer accuracy and filler words)
* **Database:** MongoDB / Firebase 

## 🎯 Project Objective

Build a comprehensive platform that:
* Conducts real-time, adaptive mock interviews.
* Uses cutting-edge AI to generate context-aware questions.
* Analyzes answers across multiple mediums (Text/Voice/Video).
* Delivers instant performance reports with targeted improvement tips.

## 🔑 Key Features

### 1. Smart AI Interviewer
* **Adaptive Questioning:** Asks a mix of HR and Technical questions, adjusting the difficulty based on the user's previous answers.
* **Domain Specific:** Supports specialized interview tracks including Software Development, Data Science, HR, and MBA/Group Discussions.

### 2. Resume-Based Questions (Advanced)
* **Dynamic Parsing:** Users upload their resume, and the AI generates tailored questions based on their specific experience.
* *Example:* If a user lists Python and a specific web scraping project, the AI will drill down into Python concepts and ask for architectural explanations of that project.

### 3. AI Feedback & Analytics System
* **Comprehensive Reporting:** After the interview, users receive a detailed breakdown of their performance.
* **Scoring Metrics:** Includes specific scores for Communication, Technical Knowledge, and Confidence, plus an Overall Rating.
* **Actionable Insights:** Provides specific feedback such as:
    * *Speak slower and clearer.*
    * *Avoid filler words (um, like).*
    * *Improve eye contact.*
    * *Provide more depth in technical explanations.*

### 4. Coding Interview Mode (🔥 Killer Feature)
* **Live Assessment:** Dedicated environment for technical coding rounds.
* **Question Bank:** Includes Data Structures & Algorithms (DSA), SQL queries, and Python scripting.
* **Built-in Tools:** Features an integrated code editor, automatic code evaluation, and time tracking to simulate real technical assessments.

## 🌐 Project Setup

To set up and run this project locally on your machine:

**1. Clone the Repository:**
bash
git clone [https://github.com/Anuragkumar0429/AI-MOCK-MENTOR.git](https://github.com/Anuragkumar0429/AI-MOCK-MENTOR.git)
cd AI-MOCK-MENTOR

**2. Install Frontend Dependencies:**
```bash
cd frontend
npm install



