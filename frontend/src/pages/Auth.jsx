import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Tiny sub-components ─────────────────────────── */
const InputField = ({ label, type, value, onChange, placeholder, autoFocus }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoFocus={autoFocus}
      required
      className="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-600
                 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none"
    />
  </div>
);

/* ─── Main component ──────────────────────────────── */
export default function Auth() {
  const [mode, setMode]         = useState('signin'); // 'signin' | 'signup'
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  /* Reset fields when switching mode */
  useEffect(() => { setError(''); setName(''); setEmail(''); setPassword(''); setConfirm(''); }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name.trim()) return setError('Please enter your full name.');
      if (password.length < 6) return setError('Password must be at least 6 characters.');
      if (password !== confirm) return setError('Passwords do not match.');
    }
    if (!email.includes('@')) return setError('Please enter a valid email.');

    setLoading(true);
    /* Simulated auth — replace with Supabase call */
    setTimeout(() => {
      setLoading(false);
      /* Persist a basic user session */
      localStorage.setItem('mockMentorUser', JSON.stringify({ name: name || email.split('@')[0], email }));
      navigate('/setup');
    }, 1300);
  };

  return (
    <div className="noise relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#07090E]">

      {/* ── Background blobs ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.07] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-700/[0.07] blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04)_0%,transparent_70%)]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage:'linear-gradient(#818CF8 1px,transparent 1px),linear-gradient(to right,#818CF8 1px,transparent 1px)', backgroundSize:'40px 40px' }} />
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-md mx-4 fade-up">
        <div className="glass rounded-[1.75rem] overflow-hidden shadow-2xl">

          {/* Gradient top bar */}
          <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />

          <div className="px-8 pt-8 pb-10">

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(99,102,241,0.4)]">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white">
                  <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Mock<span className="text-indigo-400">Mentor</span></h1>
              <p className="text-xs text-slate-500 mt-1">AI-Powered Interview Practice</p>
            </div>

            {/* Mode switcher */}
            <div className="flex bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 mb-7">
              {['signin','signup'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    mode === m
                      ? 'bg-indigo-600 text-white shadow-[0_2px_12px_rgba(99,102,241,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-5 flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-xs px-4 py-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === 'signup' && (
                <InputField label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Anurag Kumar" autoFocus />
              )}
              <InputField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoFocus={mode === 'signin'} />
              <InputField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              {mode === 'signup' && (
                <InputField label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" />
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-2 w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
                  </>
                ) : (
                  mode === 'signin' ? 'Sign In →' : 'Create Account →'
                )}
              </button>
            </form>

            {/* Bottom link */}
            <p className="mt-6 text-center text-xs text-slate-500">
              {mode === 'signin' ? "Don't have an account?" : 'Already registered?'}{' '}
              <button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                {mode === 'signin' ? 'Create one' : 'Sign in'}
              </button>
            </p>

          </div>
        </div>

        {/* Fine print */}
        <p className="text-center text-[11px] text-slate-600 mt-5">
          By continuing, you agree to our{' '}
          <span className="text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">Terms</span> &amp;{' '}
          <span className="text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
