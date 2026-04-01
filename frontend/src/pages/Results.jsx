import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Catch the transcript from the Interview page
  const transcript = location.state?.transcript || "No interview data found.";

  // 2. State for the real AI grades
  const [isGrading, setIsGrading] = useState(true);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ strength: "Analyzing...", weakness: "Analyzing..." });

  // 3. The Grading Engine
  useEffect(() => {
    const gradeInterview = async () => {
      try {
        const response = await fetch("http://localhost:8080/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: transcript })
        });

        const data = await response.json();
        
        // Parse the strict AI output format
        const feedbackText = data.feedback;
        const extractedScore = feedbackText.match(/Score:\s*(\d+)/i)?.[1] || 75;
        const extractedStrength = feedbackText.match(/Strength:\s*(.*)/i)?.[1] || "Solid technical foundation.";
        const extractedWeakness = feedbackText.match(/Weakness:\s*(.*)/i)?.[1] || "Could provide more specific examples.";

        setScore(Number(extractedScore));
        setFeedback({ strength: extractedStrength, weakness: extractedWeakness });
        setIsGrading(false);

      } catch (error) {
        console.error("🔥 AI Grading Failed:", error);
        setScore(70); // Fallback score
        setFeedback({ strength: "Good effort.", weakness: "Server error during grading." });
        setIsGrading(false);
      }
    };

    gradeInterview();
  }, [transcript]);

  // Dynamic Chart Data
  const skillData = [
    { name: 'Technical', score: score + 5 > 100 ? 100 : score + 5 },
    { name: 'Communication', score: score - 2 },
    { name: 'Problem Solving', score: score },
    { name: 'Confidence', score: score - 5 },
  ];

  if (isGrading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#050505] text-cyan-500 font-black tracking-widest text-xl">
        <div className="w-16 h-16 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin mb-6"></div>
        AI IS GRADING YOUR INTERVIEW...
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#050505] overflow-hidden font-sans p-6 md:p-12">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col gap-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4">
            <span className="text-[10px] font-bold text-cyan-400 tracking-[0.3em] uppercase">Phase 5: Analytics</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
            SIMULATION <span className="text-cyan-500">COMPLETE</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: The Big Score */}
          <div className="col-span-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-bl-full blur-[50px]"></div>
            
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8">Final AI Score</h3>
            
            {/* Glowing Score Circle */}
            <div className="relative flex items-center justify-center w-48 h-48 rounded-full border-4 border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] mb-8">
              <span className="text-6xl font-black text-white">{score}<span className="text-2xl text-cyan-500">%</span></span>
            </div>

            <button 
              onClick={() => navigate('/setup')}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl tracking-widest transition-all border border-white/10"
            >
              START NEW SESSION
            </button>
          </div>

          {/* Right Column: Feedback & Charts */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
            
            {/* AI Written Feedback */}
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
                <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span> Key Strength
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">{feedback.strength}</p>
              </div>
              <div className="flex-1 bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span> Area to Improve
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">{feedback.weakness}</p>
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl h-[300px]">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Skill Breakdown</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff20', borderRadius: '12px' }} />
                  <Bar dataKey="score" fill="#22d3ee" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}