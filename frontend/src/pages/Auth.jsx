import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 🔐 THE MOCK AUTHENTICATION ENGINE (Bypass for testing)
  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a 1.5-second database connection so you can see the loading state
    setTimeout(() => {
      setIsLoading(false);
      navigate('/setup'); // Teleport to the domain selection page
    }, 1500);
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden font-sans">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md p-10 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4">
            <span className="text-[10px] font-bold text-cyan-400 tracking-[0.3em] uppercase">Phase 4: Identity</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">
            MOCK <span className="text-cyan-500">MENTOR</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin ? "Welcome back, Professional." : "Begin your career journey today."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Anurag Kumar Upadhyay"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-gray-700"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anurag@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-gray-700"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl tracking-[0.2em] transition-all transform active:scale-95 shadow-[0_0_30px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "AUTHENTICATING..." : isLogin ? "LOG IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-bold text-gray-500 hover:text-cyan-400 transition-colors tracking-widest uppercase"
          >
            {isLogin ? "Need an account? Sign Up" : "Already registered? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}