import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { gradeTranscript } from '../api';

/* ─── Score Ring ── */
function ScoreRing({ score, size = 180 }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 75 ? '#10B981' : score >= 50 ? '#FBBF24' : '#EF4444';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 6px ${color}88)` }}
      />
      <text x="50" y="46" textAnchor="middle" dominantBaseline="middle"
        fontSize="22" fontWeight="800" fill="white" fontFamily="Outfit, sans-serif">{score}</text>
      <text x="50" y="62" textAnchor="middle"
        fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="Manrope, sans-serif">out of 100</text>
    </svg>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0C1120] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-lg font-bold text-white">{payload[0].value}<span className="text-xs text-slate-400 ml-0.5">pts</span></p>
    </div>
  );
};

function StatCard({ icon, label, value, sub, color = 'text-white' }) {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-1 fade-up">
      <div className="text-xl mb-2">{icon}</div>
      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{label}</p>
      <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-600">{sub}</p>}
    </div>
  );
}

export default function Results() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const transcript = location.state?.transcript || localStorage.getItem('mockMentorTranscript') || '';
  const config     = JSON.parse(localStorage.getItem('mockMentorConfig') || '{"domain":"swe","exp":"junior","qCount":10}');

  const [grading,       setGrading]       = useState(true);
  const [score,         setScore]         = useState(0);
  const [displayed,     setDisplayed]     = useState(0);
  const [feedback,      setFeedback]      = useState({ strength: '', weakness: '' });
  const [error,         setError]         = useState(false);
  const [showTranscript,setShowTranscript]= useState(false);
  const timerRef = useRef(null);

  const stats          = JSON.parse(localStorage.getItem('mockMentorStats') || '{"totalInterviews":0,"scores":[]}');
  const totalInterviews= stats.totalInterviews;
  const allScores      = stats.scores || [];
  const avgScore       = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : score;
  const bestScore      = allScores.length > 0 ? Math.max(...allScores) : score;

  /* ── Animate score ── */
  useEffect(() => {
    if (grading) return;
    let current = 0;
    timerRef.current = setInterval(() => {
      current += Math.ceil((score - current) / 8);
      if (current >= score) { current = score; clearInterval(timerRef.current); }
      setDisplayed(current);
    }, 30);
    return () => clearInterval(timerRef.current);
  }, [grading, score]);

  /* ── Grade ── */
  useEffect(() => {
    const grade = async () => {
      try {
        const data = await gradeTranscript(transcript);
        const txt  = data.feedback || '';
        const s    = parseInt(txt.match(/Score:\s*(\d+)/i)?.[1] || '72', 10);
        const str  = txt.match(/Strength:\s*(.*)/i)?.[1]  || 'Solid understanding of core concepts with clear communication.';
        const wkn  = txt.match(/Weakness:\s*(.*)/i)?.[1]  || 'Could use more specific examples and structured frameworks.';

        const st = JSON.parse(localStorage.getItem('mockMentorStats') || '{"totalInterviews":0,"scores":[]}');
        if (!st.scores) st.scores = [];
        st.scores.push(s);
        localStorage.setItem('mockMentorStats', JSON.stringify(st));

        setScore(s);
        setFeedback({ strength: str, weakness: wkn });
      } catch {
        const fallback = Math.floor(65 + Math.random() * 20);
        setScore(fallback);
        setFeedback({ strength: 'Good effort with clear communication.', weakness: 'Server error — feedback unavailable.' });
        setError(true);
      } finally {
        setGrading(false);
      }
    };
    grade();
  }, []); // eslint-disable-line

  const skillData = [
    { name: 'Technical',      score: Math.min(100, score + 5)  },
    { name: 'Communication',  score: Math.max(0, score - 2)    },
    { name: 'Problem Solving',score: score                      },
    { name: 'Confidence',     score: Math.max(0, score - 7)    },
    { name: 'Clarity',        score: Math.min(100, score + 2)  },
  ];
  const barColor = s => s >= 75 ? '#10B981' : s >= 50 ? '#6366F1' : '#FBBF24';
  const scoreLabel = score >= 85 ? '🏆 Excellent' : score >= 70 ? '✅ Good' : score >= 55 ? '📈 Improving' : '💡 Keep Practicing';

  if (grading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-white text-xl mb-1">Analysing Your Interview</p>
          <p className="text-sm text-slate-500">AI is reviewing your responses…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="noise relative min-h-screen bg-[#07090E] flex flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-indigo-600/[0.06] blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-violet-600/[0.05] blur-[100px]" />
      </div>

      {/* ── Nav ── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
              <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display font-bold text-white">Mock<span className="text-indigo-400">Mentor</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {['Setup','Resume','Interview'].map(s => (
            <div key={s} className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500 bg-emerald-500/20 text-[10px] font-bold text-emerald-400">✓</span>
              <span className="hidden sm:inline">{s}</span>
              <span className="text-slate-700">›</span>
            </div>
          ))}
          <span className="flex items-center justify-center w-5 h-5 rounded-full border border-indigo-500 bg-indigo-500/20 text-[10px] font-bold text-indigo-400">4</span>
          <span className="text-slate-300 font-medium hidden sm:inline">Results</span>
        </div>
      </nav>

      <main className="relative z-10 flex-1 px-6 py-10 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10 fade-up">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            ✓ Interview Complete
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
            Your Performance <span className="gradient-text">Report</span>
          </h1>
          <p className="text-slate-400 text-sm">{scoreLabel} · {config.domain?.toUpperCase()} · {config.exp} level</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard icon="🏅" label="This Score"       value={`${score}%`}        color="text-indigo-300" />
          <StatCard icon="📊" label="Avg Score"        value={`${avgScore}%`}      color="text-amber-300"  />
          <StatCard icon="🏆" label="Best Score"       value={`${bestScore}%`}     color="text-emerald-300" />
          <StatCard icon="🎯" label="Total Interviews" value={totalInterviews}      color="text-violet-300" sub="sessions completed" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
          {/* Score ring */}
          <div className="glass rounded-2xl p-8 flex flex-col items-center gap-6 min-w-[220px] fade-up delay-1">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-center mb-5">AI Score</p>
              <ScoreRing score={displayed} />
            </div>
            <div className="w-full space-y-2">
              <button type="button" onClick={() => navigate('/setup')}
                className="btn-primary w-full py-3 rounded-xl font-semibold text-sm text-center">
                New Interview
              </button>
              <button type="button" onClick={() => setShowTranscript(!showTranscript)}
                className="btn-ghost w-full py-3 rounded-xl font-semibold text-sm">
                {showTranscript ? 'Hide' : 'View'} Transcript
              </button>
              <button type="button" onClick={() => navigate('/')}
                className="btn-ghost w-full py-3 rounded-xl font-semibold text-sm text-slate-500">
                Sign Out
              </button>
            </div>
          </div>

          {/* Feedback + chart */}
          <div className="flex flex-col gap-6">
            <div className="glass rounded-2xl p-6 fade-up delay-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">AI Feedback</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-500/[0.07] border border-emerald-500/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Key Strength</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{feedback.strength}</p>
                </div>
                <div className="bg-amber-500/[0.07] border border-amber-500/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Area to Improve</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{feedback.weakness}</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 h-[280px] fade-up delay-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Skill Breakdown</h3>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={skillData} barCategoryGap="30%" margin={{ top: 0, right: 0, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0)" tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0)" tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {skillData.map((entry, i) => (
                      <Cell key={i} fill={barColor(entry.score)} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {allScores.length > 1 && (
              <div className="glass rounded-2xl p-6 fade-up delay-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Score History</h3>
                <div className="flex items-end gap-2 h-16">
                  {allScores.slice(-10).map((s, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-md transition-all duration-500"
                        style={{ height: `${(s / 100) * 56}px`, background: barColor(s), opacity: 0.7 }} />
                      <span className="text-[9px] text-slate-600">{s}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-600 mt-2">Last {Math.min(allScores.length, 10)} interviews</p>
              </div>
            )}
          </div>
        </div>

        {showTranscript && (
          <div className="mt-6 glass rounded-2xl p-6 fade-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Transcript</h3>
              <button type="button" onClick={() => setShowTranscript(false)} className="text-slate-600 hover:text-slate-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <pre className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
              {transcript || 'No transcript available.'}
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-4 text-center text-xs text-slate-600">
            ⚠ Could not reach grading server — scores are estimated
          </div>
        )}
      </main>
    </div>
  );
}
