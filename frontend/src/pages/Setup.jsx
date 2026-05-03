import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Data ────────────────────────────────────────── */
const DOMAINS = [
  { id: 'swe',      label: 'Software Engineering',   sub: 'DSA · System Design · React · Node',    icon: '⌨️', grad: 'from-indigo-500 to-blue-600',   glow: 'rgba(99,102,241,0.3)'  },
  { id: 'data',     label: 'Data Science & AI',       sub: 'Python · ML · Neural Nets · SQL',        icon: '🧠', grad: 'from-violet-500 to-purple-700',  glow: 'rgba(139,92,246,0.3)'  },
  { id: 'hr',       label: 'Behavioral & HR',         sub: 'Leadership · Culture · Scenarios',       icon: '🤝', grad: 'from-amber-400 to-orange-500',   glow: 'rgba(251,191,36,0.3)'  },
  { id: 'product',  label: 'Product Management',      sub: 'Strategy · UX · Case Studies · OKRs',   icon: '🚀', grad: 'from-emerald-400 to-teal-600',   glow: 'rgba(16,185,129,0.3)'  },
];

const EXP_LEVELS = [
  { id: 'fresher', label: 'Fresher',  sub: '0 – 1 yr' },
  { id: 'junior',  label: 'Junior',   sub: '1 – 3 yrs' },
  { id: 'senior',  label: 'Senior',   sub: '3 + yrs' },
];

const QUESTION_COUNTS = [5, 10, 15];

/* ─── Domain Card ────────────────────────────────── */
function DomainCard({ domain, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(domain.id)}
      className={`relative group text-left w-full rounded-2xl p-5 transition-all duration-300 border outline-none ${
        selected
          ? 'border-indigo-500/60 bg-indigo-500/10 shadow-[0_0_24px_rgba(99,102,241,0.2)]'
          : 'border-white/[0.07] bg-white/[0.025] hover:border-white/[0.14] hover:bg-white/[0.05]'
      }`}
    >
      {/* Selection indicator */}
      <span className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
        selected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'
      }`}>
        {selected && (
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
            <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
        )}
      </span>

      {/* Icon */}
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${domain.grad} flex items-center justify-center text-xl mb-4 shadow-md`}>
        {domain.icon}
      </div>

      <h3 className="font-display font-semibold text-sm text-white mb-1">{domain.label}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{domain.sub}</p>
    </button>
  );
}

/* ─── Main ────────────────────────────────────────── */
export default function Setup() {
  const [domain,    setDomain]    = useState(null);
  const [exp,       setExp]       = useState('junior');
  const [qCount,    setQCount]    = useState(10);
  const navigate = useNavigate();

  const handleProceed = () => {
    if (!domain) return;
    localStorage.setItem('mockMentorConfig', JSON.stringify({ domain, exp, qCount }));
    navigate('/resume');
  };

  return (
    <div className="noise relative min-h-screen bg-[#07090E] flex flex-col">

      {/* ── Nav bar ── */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.4)]">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
              <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display font-bold text-white">Mock<span className="text-indigo-400">Mentor</span></span>
        </div>

        {/* Step indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          {['Setup','Resume','Interview','Results'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={`flex items-center justify-center w-5 h-5 rounded-full border text-[10px] font-bold ${
                i === 0 ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/10 text-slate-600'
              }`}>{i + 1}</span>
              <span className={i === 0 ? 'text-slate-300 font-medium' : ''}>{s}</span>
              {i < 3 && <span className="text-slate-700">›</span>}
            </div>
          ))}
        </div>
      </nav>

      {/* ── Page content ── */}
      <main className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-3xl">

          {/* Heading */}
          <div className="text-center mb-12 fade-up">
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Step 1 of 4 — Session Setup
            </span>
            <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-3">
              Configure Your <span className="gradient-text">Interview</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              Choose your target role, experience level, and how many questions you want to practice.
            </p>
          </div>

          {/* ── Section 1: Domain ── */}
          <section className="mb-10 fade-up delay-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Interview Domain
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DOMAINS.map(d => (
                <DomainCard key={d.id} domain={d} selected={domain === d.id} onSelect={setDomain} />
              ))}
            </div>
          </section>

          {/* ── Section 2: Experience ── */}
          <section className="mb-10 fade-up delay-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Experience Level
            </h2>
            <div className="flex gap-3 flex-wrap">
              {EXP_LEVELS.map(lvl => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setExp(lvl.id)}
                  className={`flex-1 min-w-[100px] rounded-xl py-3.5 px-4 text-center border transition-all duration-200 ${
                    exp === lvl.id
                      ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300'
                      : 'bg-white/[0.025] border-white/[0.07] text-slate-400 hover:border-white/[0.14] hover:text-slate-200'
                  }`}
                >
                  <span className="block font-semibold text-sm">{lvl.label}</span>
                  <span className="block text-xs opacity-60 mt-0.5">{lvl.sub}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ── Section 3: Question Count ── */}
          <section className="mb-12 fade-up delay-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Number of Questions
            </h2>
            <div className="flex gap-3">
              {QUESTION_COUNTS.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQCount(n)}
                  className={`w-24 rounded-xl py-3 text-center border font-bold text-sm transition-all duration-200 ${
                    qCount === n
                      ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300'
                      : 'bg-white/[0.025] border-white/[0.07] text-slate-400 hover:border-white/[0.14] hover:text-slate-200'
                  }`}
                >
                  {n}
                  <span className="block text-[10px] font-normal opacity-50 mt-0.5">questions</span>
                </button>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <div className="fade-up delay-4">
            {!domain && (
              <p className="text-xs text-slate-600 text-center mb-4">← Select a domain to continue</p>
            )}
            <button
              type="button"
              onClick={handleProceed}
              disabled={!domain}
              className="btn-primary w-full py-4 rounded-xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2"
            >
              Continue to Resume Upload
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
