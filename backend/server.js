require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const multer   = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/* ─── Initialise ───────────────────────────────────── */
const app    = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Initialize Gemini with your new environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ─── CORS ─────────────────────────────────────────── */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    console.warn(`CORS blocked for origin: ${origin}`);
    cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

/* ─── Health check ─────────────────────────────────── */
app.get('/', (_req, res) => res.json({ status: 'MockMentor backend running ✅', version: '1.0.0' }));
app.get('/health', (_req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

/* ─── POST /extract-text ───────────────────────────── */
app.post('/extract-text', upload.single('resumeFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Send a PDF as form-data field "resumeFile".' });
    }
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are accepted.' });
    }

    const data = await pdfParse(req.file.buffer);
    const text = data.text?.trim();

    if (!text || text.length < 10) {
      return res.status(422).json({ error: 'Could not extract text from this PDF. Try pasting your resume manually.' });
    }

    return res.json({ text, pages: data.numpages, chars: text.length });
  } catch (err) {
    console.error('[extract-text]', err.message);
    return res.status(500).json({ error: 'PDF extraction failed. The file may be corrupted or image-only.' });
  }
});

/* ─── POST /question ───────────────────────────────── */
app.post('/question', async (req, res) => {
  const { topic = 'swe', resume = '', history = '', exp = 'junior' } = req.body;

  const domainLabels = {
    swe:     'Software Engineering (focus on DSA, system design, React, Node.js, coding problems)',
    data:    'Data Science & AI (focus on Python, machine learning, statistics, SQL, neural networks)',
    hr:      'Behavioural & HR (focus on leadership, conflict resolution, culture fit, situational questions)',
    product: 'Product Management (focus on strategy, UX, case studies, metrics, prioritisation frameworks)',
  };

  const domainContext = domainLabels[topic] || domainLabels.swe;
  const resumeContext = resume.trim()
    ? `Candidate's resume:\n"""\n${resume.slice(0, 3000)}\n"""\n\n`
    : 'No resume provided — ask a generic interview question.\n\n';

  const systemPrompt = `You are an expert technical interviewer conducting a ${domainContext} interview.
Experience level: ${exp}.
${resumeContext}
📌 INSTRUCTIONS FOR GENERATING UNIQUE QUESTIONS:
1. Each question MUST be different from all previously asked questions
2. Do NOT repeat or rephrase any previous question
3. Vary question types: technical, behavioural, scenario-based, case study, coding challenge, system design
4. If resume provided: reference candidate's specific experience and skills
5. Make questions progressively harder as the interview continues
6. Return ONLY the question text, nothing else - no numbers, no preamble

${history.trim() ? '⚠️ REMEMBER: Look at previous questions and ask something COMPLETELY DIFFERENT' : ''}

Generate ONE clear, professional interview question:`;

  const userPrompt = history.trim()
    ? `Previous conversation:\n${history.slice(-4000)}\n\nGenerate the NEXT question that is DIFFERENT from everything above.`
    : 'Generate the first interview question.';

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  try {
    console.log('[question] Request received:', { topic, exp, hasResume: !!resume, historyLength: history.length });
    console.log('[question] Full prompt:', fullPrompt.substring(0, 200) + '...');
    
    // Using Gemini 2.5 Flash for fast, free generations
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent(fullPrompt);
    
    const question = result.response.text().trim() || 'Tell me about yourself and your background.';
    console.log('[question] Generated:', question.substring(0, 100) + '...');
    console.log('[question] Response status:', result.response.candidates?.[0]?.finishReason);
    
    return res.json({ question });
  } catch (err) {
    console.error('[question] ERROR:', err.message);
    console.error('[question] Full error:', err);
    return res.status(500).json({
      question: 'Could you walk me through a challenging project you worked on and the technical decisions you made?',
      error: 'AI unavailable — using fallback question.',
    });
  }
});

/* ─── POST /answer ─────────────────────────────────── */
app.post('/answer', async (req, res) => {
  const { answer: transcript = '' } = req.body;

  if (!transcript.trim()) {
    return res.status(400).json({ error: 'No transcript provided.' });
  }

  const systemPrompt = `You are an expert interview coach. Analyse the following interview transcript and provide structured feedback.

Return your response in EXACTLY this format (include the labels):
Score: <integer 0-100>
Strength: <one concise sentence about the candidate's biggest strength>
Weakness: <one concise sentence about the most important area to improve>

Rules:
- Score should reflect: technical accuracy, communication clarity, depth of answers, use of examples.
- Strength and Weakness must each be a single sentence (max 20 words).
- Do not add any other text, headers, or explanations.`;

  const fullPrompt = `${systemPrompt}\n\nInterview transcript:\n\n${transcript.slice(-6000)}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(fullPrompt);
    
    const feedback = result.response.text().trim() || '';
    return res.json({ feedback });
  } catch (err) {
    console.error('[answer]', err.message);
    const fallbackScore = 65 + Math.floor(Math.random() * 20);
    return res.status(500).json({
      feedback: `Score: ${fallbackScore}\nStrength: Demonstrated clear communication throughout the interview.\nWeakness: Could provide more concrete examples to support your answers.`,
      error: 'AI grading unavailable — estimated score returned.',
    });
  }
});

/* ─── 404 catch-all ─────────────────────────────────── */
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));

/* ─── Global error handler ──────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error('[uncaught]', err.message);
  res.status(500).json({ error: err.message || 'Internal server error.' });
});

/* ─── Start ─────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀  MockMentor backend running at http://localhost:${PORT}`);
  console.log(`   Endpoints: GET /health | POST /extract-text | POST /question | POST /answer\n`);
});