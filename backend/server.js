import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

const app = express();

// 1. DEPLOYMENT UPDATE: Open CORS to allow any frontend to connect
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

// Parse incoming JSON payloads
app.use(express.json()); 

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Base route to verify server is running on the web
app.get('/', (req, res) => {
    res.send("✅ Mock Mentor Backend is Live and Running!");
});

// 🧠 ROUTE 1: Generate dynamic interview questions
app.post('/question', async (req, res) => {
    try {
        const { topic, resume, history } = req.body;
        
        // Ensure we are using the updated 2.5-flash model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are a strict, senior technical interviewer. 
        The candidate's background is: "${resume}".
        The interview topic is: "${topic}".
        
        Here is the conversation history so far:
        ${history}

        Based on the history and their resume, ask ONE challenging follow-up question. 
        Do not include any greetings, pleasantries, or extra text. Just ask the question directly.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ question: text.trim() });
    } catch (error) {
        console.error("🔥 Error generating question:", error);
        res.status(500).json({ error: "Failed to generate question" });
    }
});

// 📊 ROUTE 2: Grade the final interview transcript
app.post('/answer', async (req, res) => {
    try {
        const { answer } = req.body; // 'answer' is the full interview transcript
        
        // Ensure we are using the updated 2.5-flash model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are a strict, senior technical interviewer grading a candidate's interview transcript.
        
        Here is the full interview transcript:
        ${answer}

        Evaluate the candidate's performance. You MUST return your evaluation strictly in the following format:
        Score: [Insert a number between 1 and 100]
        Strength: [Insert 1 sentence describing their biggest strength]
        Weakness: [Insert 1 sentence describing their biggest area to improve]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ feedback: text });
    } catch (error) {
        console.error("🔥 Error grading interview:", error);
        res.status(500).json({ error: "Failed to grade interview" });
    }
});

// 2. DEPLOYMENT UPDATE: Use dynamic PORT provided by the host
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ SERVER ACTIVE: Listening on port ${PORT}`);
});