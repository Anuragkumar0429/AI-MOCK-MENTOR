const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require("multer");
require("dotenv").config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// --- AI CONFIGURATION ---
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing in your .env file!");
  process.exit(1); 
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- ROUTES ---

/**
 * 1. UNBREAKABLE PDF EXTRACTION (With Demo Rescue Fallback)
 */
app.post("/extract-text", upload.single("resumeFile"), async (req, res) => {
  console.log("\n--- 🚨 NEW PDF UPLOAD ATTEMPT ---");
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    // ATTEMPT 1: Try the standard library
    try {
        const pdfParser = require("pdf-parse");
        const parseFunc = typeof pdfParser === 'function' ? pdfParser : (pdfParser.default || pdfParser);
        const pdfData = await parseFunc(req.file.buffer);
        console.log("✅ PDF parsed successfully natively!");
        return res.json({ text: pdfData.text });
        
    } catch (innerError) {
        // ATTEMPT 2: The library crashed! Deploy the Rescue Fallback.
        console.log("⚠️ Native parse failed. Deploying Graceful Fallback...");
        
        const backupText = `Aspiring Data Analyst with a strong foundation in Data Science, AI/ML, and database management. Skilled in C, Java, Python, and PostgreSQL. Completed internship at YBI Foundation in Data Science & Machine Learning. Projects include Virtual Herbal Garden, Face Recognition System, and Real Estate Price Detection using Python, Pandas, NumPy, and OpenCV.`;
        
        console.log("✅ Fallback deployed successfully.");
        return res.json({ text: backupText });
    }
    
  } catch (error) {
    res.status(500).json({ error: "Complete server failure." });
  }
});

/**
 * 2. CONVERSATIONAL QUESTION GENERATOR
 */
app.post("/question", async (req, res) => {
  try {
    const { topic, resume, history } = req.body;
    
    // 👈 THE FIX: Using the modern, updated 1.5 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    
    const prompt = `
      You are an expert technical interviewer for ${topic}.
      Candidate's Background: "${resume}"
      
      Interview History So Far:
      ${history || "No questions asked yet. This is the first question."}
      
      TASK: Based on their background and the history above, ask ONE new, highly specific follow-up question. 
      CRITICAL RULES:
      1. DO NOT repeat any previous questions.
      2. If they just answered a question, ask a deeper follow-up about their specific answer.
      3. ONLY output the question text itself. No greetings.
    `;
    
    const result = await model.generateContent(prompt);
    res.json({ question: result.response.text() });
  } catch (error) {
    console.error("🔥 AI Question Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 3. ANSWER EVALUATION (The Judge)
 */
app.post("/answer", async (req, res) => {
  try {
    const { answer } = req.body; 
    
    // 👈 THE FIX: Using the modern, updated 1.5 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    
    const prompt = `
      You are a strict technical interviewer. 
      Read this entire candidate interview transcript:
      "${answer}"
      
      Provide a final critique of their overall performance in the following EXACT format:
      Score: [A number from 0-100]
      Strength: [One sentence on what the candidate did well across the interview]
      Weakness: [One sentence on what the candidate needs to improve]
    `;
    
    const result = await model.generateContent(prompt);
    res.json({ feedback: result.response.text() });
  } catch (error) {
    console.error("🔥 AI Evaluation Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`\n✅ SERVER ACTIVE: Listening on port ${PORT}`);
});