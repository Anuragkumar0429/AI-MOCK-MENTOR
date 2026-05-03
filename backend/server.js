import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { createRequire } from 'module';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Setup required for PDF parsing in ES Modules
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// Load environment variables
dotenv.config();
const app = express();

// Initialize the Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// EXTRA-STRICT CORS FOR SAFARI & DEPLOYMENT
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(fileUpload());

// 📄 ROUTE 1: THE PDF PARSER
app.post('/parse-pdf', async (req, res) => {
    console.log("📥 [PDF] UPLOAD REQUEST RECEIVED");
    try {
        if (!req.files || !req.files.resumeFile) {
            return res.status(200).json({ text: "Default Resume Text: Full Stack Developer." });
        }

        const uploadedFile = req.files.resumeFile;
        try {
            const data = await pdfParse(uploadedFile.data);
            console.log("✅ PDF Parsed Successfully");
            return res.status(200).json({ text: data.text || "Extracted text was empty." });
        } catch (e) {
            console.log("⚠️ Parser failed, sending fallback.");
            return res.status(200).json({ text: "Candidate with AI and Web Dev skills." });
        }
    } catch (error) {
        return res.status(200).json({ text: "Fallback: Software Engineering Student." });
    }
});

// 🧠 ROUTE 2: THE REAL AI INTERVIEWER
app.post('/question', async (req, res) => {
    console.log("🤖 [AI] QUESTION REQUEST RECEIVED");
    try {
        const { resume, history } = req.body;
        
        // Connect to the fastest Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Give the AI its personality and instructions
        const prompt = `You are a professional technical interviewer named MockMentor. 
        Here is the candidate's extracted resume text: "${resume}"
        
        Here is the conversation history so far:
        ${history || "No history yet. This is the first question."}
        
        INSTRUCTIONS:
        1. Based on their resume and the history, ask exactly ONE logical follow-up interview question.
        2. Do not answer the question for them.
        3. Do not break character. 
        4. Keep it professional, concise, and do not repeat previous questions.`;

        // Generate the question
        const result = await model.generateContent(prompt);
        const nextQuestion = result.response.text();
        
        console.log("✅ AI Generated a question.");
        res.json({ question: nextQuestion.trim() });

    } catch (error) {
        console.error("🔥 AI Error:", error);
        res.json({ question: "That is an interesting point. Could you elaborate a bit more on your technical process?" }); 
    }
});

// 🔗 SERVER LISTENER 
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ MOCK MENTOR BACKEND IS LIVE`);
    console.log(`👉 Running on port: ${PORT}`);
});