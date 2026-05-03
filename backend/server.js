import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { createRequire } from 'module';
import { GoogleGenerativeAI } from '@google/generative-ai';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

dotenv.config();
const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// 📄 1. PDF PARSER ROUTE
app.post('/parse-pdf', async (req, res) => {
    try {
        if (!req.files || !req.files.resumeFile) return res.json({ text: "" });
        const data = await pdfParse(req.files.resumeFile.data);
        res.json({ text: data.text });
    } catch (error) {
        res.json({ text: "" });
    }
});

// 🧠 2. THE FIXED AI QUESTION ROUTE
app.post('/question', async (req, res) => {
    try {
        const { resume, history, topic, exp } = req.body;
        console.log("\n--- NEW QUESTION REQUEST ---");
        console.log("History Received?:", history ? "YES" : "EMPTY");

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `You are a strict Technical Interviewer.
        RESUME: ${resume}
        CONTEXT: The user is applying for a ${exp} ${topic} role.
        
        CURRENT CONVERSATION LOG:
        ${history || "No questions have been asked yet."}

        INSTRUCTION: 
        - Review the LOG above carefully.
        - You MUST NOT ask a question that has already been asked.
        - You MUST NOT repeat topics already covered.
        - Ask the NEXT logical technical interview question. 
        - Be concise. One question only.`;

        const result = await model.generateContent(prompt);
        const nextQuestion = result.response.text().trim();
        res.json({ question: nextQuestion });
    } catch (error) {
        console.error("🔥 AI Error:", error.message);
        res.json({ question: "Could you explain your favorite technical project?" });
    }
});

// 📊 3. THE RESTORED GRADING ROUTE
app.post('/grade', async (req, res) => {
    try {
        const { transcript } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const prompt = `You are an expert technical recruiter evaluating an interview.
        TRANSCRIPT:
        ${transcript}
        
        Provide a JSON response evaluating the candidate. Use exactly this format:
        {"score": 85, "feedback": "Your detailed feedback here."}
        Respond ONLY with valid JSON. Do not include markdown formatting like \`\`\`json.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();
        
        // Clean up markdown just in case the AI includes it
        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        res.json(JSON.parse(responseText));
    } catch (error) {
        console.error("🔥 Grading Error:", error.message);
        res.json({ score: 0, feedback: "Error grading the interview. Please check your backend logs." });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend running on port ${PORT}`);
});