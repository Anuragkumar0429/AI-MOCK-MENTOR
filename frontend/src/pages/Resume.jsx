import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractPdfText } from '../api';

export default function Resume() {
  const [file,       setFile]       = useState(null);
  const [dragging,   setDragging]   = useState(false);
  const [text,       setText]       = useState('');
  const [mode,       setMode]       = useState('upload');  // 'upload' | 'paste'
  const [extracting, setExtracting] = useState(false);
  const [error,      setError]      = useState('');
  const fileRef  = useRef(null);
  const navigate = useNavigate();

  /* ── Drag & drop ── */
  const onDragOver  = useCallback(e => { e.preventDefault(); setDragging(true);  }, []);
  const onDragLeave = useCallback(e => { e.preventDefault(); setDragging(false); }, []);
  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') { setFile(dropped); setError(''); }
    else setError('Only PDF files are accepted.');
  }, []);

  const onFileChange = e => {
    const picked = e.target.files?.[0];
    if (picked?.type === 'application/pdf') { setFile(picked); setError(''); }
    else setError('Only PDF files are accepted.');
  };

  /* ── Proceed ── */
  const handleProceed = async () => {
    setError('');
    let finalText = text;

    if (file) {
      setExtracting(true);
      try {
        const data = await extractPdfText(file);
        finalText = data.text;
      } catch (err) {
        setError('Could not read PDF — check that the backend is running, or paste the text manually.');
        setExtracting(false);
        return;
      }
      setExtracting(false);
    }

    localStorage.setItem('mockMentorResume', finalText);
    navigate('/interview');
  };

  const isReady = file !== null || text.trim().length > 20;

  const formatSize = bytes => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="noise relative min-h-screen bg-[#07090E] flex flex-col">

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.4)]">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
              <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display font-bold text-white">Mock<span className="text-indigo-400">Mentor</span></span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          {['Setup','Resume','Interview','Results'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={`flex items-center justify-center w-5 h-5 rounded-full border text-[10px] font-bold ${
                i === 0 ? 'bg-emerald-600 border-emerald-500 text-white' :
                i === 1 ? 'bg-indigo-600 border-indigo-500 text-white'   :
                'border-white/10 text-slate-600'
              }`}>{i === 0 ? '✓' : i + 1}</span>
              <span className={i === 1 ? 'text-slate-300 font-medium' : ''}>{s}</span>
              {i < 3 && <span className="text-slate-700">›</span>}
            </div>
          ))}
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-2xl">

          {/* Heading */}
          <div className="text-center mb-10 fade-up">
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Step 2 of 4 — Resume Upload
            </span>
            <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-3">
              Add Your <span className="gradient-text">Resume</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              The AI uses your resume to craft personalised, targeted interview questions.
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 mb-6 fade-up delay-1">
            {[['upload','📄  Upload PDF'], ['paste','✏️  Paste Text']].map(([m, lbl]) => (
              <button key={m} type="button" onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  mode === m ? 'bg-indigo-600 text-white shadow-[0_2px_12px_rgba(99,102,241,0.35)]' : 'text-slate-400 hover:text-slate-200'
                }`}>
                {lbl}
              </button>
            ))}
          </div>

          {/* Upload zone */}
          {mode === 'upload' && (
            <div className="fade-up delay-2">
              <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={onFileChange} />
              {!file ? (
                <div
                  onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                  onClick={() => fileRef.current.click()}
                  className={`relative w-full border-2 border-dashed rounded-2xl p-14 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    dragging
                      ? 'border-indigo-400/70 bg-indigo-500/10 scale-[1.01]'
                      : 'border-white/10 bg-white/[0.02] hover:border-indigo-400/40 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${dragging ? 'bg-indigo-500/30' : 'bg-white/[0.05]'}`}>
                    <svg className={`w-7 h-7 transition-colors duration-300 ${dragging ? 'text-indigo-300' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                  </div>
                  <p className="font-semibold text-white text-sm mb-1">{dragging ? 'Drop it here!' : 'Drag & drop your PDF'}</p>
                  <p className="text-xs text-slate-500">or <span className="text-indigo-400">click to browse</span> · PDF only · Max 10 MB</p>
                </div>
              ) : (
                <div className="w-full border border-emerald-500/30 bg-emerald-500/[0.06] rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatSize(file.size)} · PDF Document</p>
                  </div>
                  <button type="button" onClick={() => setFile(null)}
                    className="shrink-0 text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Paste zone */}
          {mode === 'paste' && (
            <div className="fade-up delay-2 relative">
              <textarea
                value={text}
                onChange={e => { setText(e.target.value); setError(''); }}
                placeholder={"Paste your resume text here…\n\nInclude your skills, experience, education, and projects for the most personalised interview."}
                rows={12}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 text-sm text-slate-200 placeholder-slate-600
                           focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none transition-all duration-200 font-mono leading-relaxed"
              />
              {text.length > 0 && (
                <span className="absolute bottom-4 right-4 text-[10px] text-slate-600">{text.length} chars</span>
              )}
            </div>
          )}

          {/* Skip */}
          <div className="mt-4 text-center fade-up delay-3">
            <button type="button" onClick={() => { localStorage.setItem('mockMentorResume', ''); navigate('/interview'); }}
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors underline underline-offset-2">
              Skip — use a generic interview instead
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-xs px-4 py-3 rounded-xl fade-up">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-8 fade-up delay-4">
            <button type="button" onClick={() => navigate('/setup')} disabled={extracting}
              className="btn-ghost px-6 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Back
            </button>
            <button type="button" onClick={handleProceed} disabled={!isReady || extracting}
              className="btn-primary flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
              {extracting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Extracting Text…
                </>
              ) : (
                <>
                  Begin Interview
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
