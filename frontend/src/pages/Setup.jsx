import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Setup() {
  const [selectedDomain, setSelectedDomain] = useState(null);
  
  // NEW: Experience Level State
  const [experience, setExperience] = useState('fresher');
  const navigate = useNavigate();

  const domains = [
    { id: 'swe', title: 'Software Engineering', desc: 'React, Node, DSA, System Design', icon: '💻', color: 'from-cyan-500 to-blue-600', shadow: 'hover:shadow-cyan-500/20' },
    { id: 'data', title: 'Data Science & AI', desc: 'Python, Neural Nets, SQL', icon: '🧠', color: 'from-fuchsia-500 to-purple-600', shadow: 'hover:shadow-fuchsia-500/20' },
    { id: 'hr', title: 'Behavioral & HR', desc: 'Leadership, Culture, Scenarios', icon: '🤝', color: 'from-orange-400 to-pink-500', shadow: 'hover:shadow-orange-500/20' },
    { id: 'mba', title: 'Product Management', desc: 'Strategy, UI/UX, Case Studies', icon: '🚀', color: 'from-emerald-400 to-teal-500', shadow: 'hover:shadow-emerald-500/20' },
  ];

  const expLevels = [
    { id: 'fresher', label: 'Fresher (0-1 Yrs)' },
    { id: 'junior', label: 'Junior (1-3 Yrs)' },
    { id: 'senior', label: 'Senior (3+ Yrs)' }
  ];

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center pt-8 pb-24 overflow-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center">
        
        {/* Hero Headline */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-center mb-6 text-white">
          Configure your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            simulation.
          </span>
        </h1>
        
        {/* NEW: Experience Level Toggle */}
        <div className="mb-12 flex flex-col items-center">
          <p className="text-sm font-bold text-gray-500 tracking-[0.2em] uppercase mb-4">Target Experience Level</p>
          <div className="flex bg-[#0a0a0f] p-1.5 rounded-full border border-white/10 shadow-inner">
            {expLevels.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setExperience(lvl.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  experience === lvl.id 
                    ? 'bg-white/10 text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Holographic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-12">
          {domains.map((domain) => (
            <div
              key={domain.id}
              onClick={() => setSelectedDomain(domain.id)}
              className={`group relative p-1 rounded-2xl cursor-pointer transition-all duration-500 hover:-translate-y-2 ${domain.shadow} hover:shadow-2xl`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${domain.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-[2px]`}></div>
              
              <div className={`relative h-full bg-[#0a0a0f] p-6 rounded-xl border transition-all duration-500 z-10
                ${selectedDomain === domain.id ? 'border-transparent bg-white/5' : 'border-white/5 group-hover:border-transparent'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className={`text-2xl p-3 rounded-xl bg-gradient-to-br ${domain.color} bg-opacity-10 flex items-center justify-center`}>
                      <span>{domain.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{domain.title}</h3>
                      <p className="text-xs text-gray-400">{domain.desc}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${selectedDomain === domain.id ? 'border-cyan-400' : 'border-gray-600'}`}>
                    {selectedDomain === domain.id && <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The Warp Drive Button */}
        <button
          onClick={() => {
            if (selectedDomain) navigate('/resume');
          }}
          disabled={!selectedDomain}
          className={`relative px-12 py-4 rounded-full font-bold text-sm tracking-[0.15em] transition-all duration-500 overflow-hidden group
            ${selectedDomain 
              ? 'text-white cursor-pointer hover:scale-105 shadow-[0_0_30px_rgba(34,211,238,0.2)]' 
              : 'text-gray-500 bg-white/5 cursor-not-allowed border border-white/5'}`}
        >
          {selectedDomain && (
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-transform duration-500 group-hover:scale-110"></div>
          )}
          <span className="relative z-10 flex items-center gap-2">
            PROCEED TO RESUME 
            <svg className={`w-4 h-4 transition-transform duration-300 ${selectedDomain ? 'group-hover:translate-x-2' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </span>
        </button>

      </div>

      {/* NEW: Live Platform Metrics Footer */}
      <div className="absolute bottom-0 w-full border-t border-white/5 bg-[#050505]/80 backdrop-blur-md py-3 hidden md:block">
        <div className="max-w-6xl mx-auto px-8 flex justify-between items-center text-xs font-mono text-gray-500">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Gemini API: 12ms ping</span>
            <span>Active Sessions: 1,204</span>
          </div>
          <div>
            Last System Update: <span className="text-cyan-400">v2.4.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}