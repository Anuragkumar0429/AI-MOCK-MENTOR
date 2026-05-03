import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestion } from '../api';

/* ─── Waveform ── */
function Waveform({ active }) {
  return (
    <div className={`flex items-end gap-[3px] h-8 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-30'}`}>
      {[16, 26, 20, 30, 14, 24, 18].map((h, i) => (
        <div key={i}
          className={`w-[3px] rounded-full bg-indigo-400 wave-bar ${active ? '' : 'opacity-0'}`}
          style={{ height: `${h}px`, animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
  );
}

/* ─── Timer ── */
function Timer({ running }) {
  const [secs, setSecs] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (running) { ref.current = setInterval(() => setSecs(s => s + 1), 1000); }
    else { clearInterval(ref.current); }
    return () => clearInterval(ref.current);
  }, [running]);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return <span className="font-mono text-sm text-slate-400 tabular-nums">{mm}:{ss}</span>;
}

/* ─── Main ── */
export default function Interview() {
  const navigate = useNavigate();
  const config = JSON.parse(localStorage.getItem('mockMentorConfig') || '{"domain":"swe","exp":"junior","qCount":10}');
  const resume = localStorage.getItem('mockMentorResume') || '';
  const TOTAL  = config.qCount;

  const [question,        setQuestion]       = useState('');
  const [questionNum,     setQuestionNum]    = useState(1);
  const [loadingQ,        setLoadingQ]       = useState(true);
  const [answerMode,      setAnswerMode]     = useState('voice');
  const [isRecording,     setIsRecording]    = useState(false);
  const [finalTranscript, setFinalTranscript]= useState('');
  const [interimText,     setInterimText]    = useState('');
  const [textAnswer,      setTextAnswer]     = useState('');
  const [submitting,      setSubmitting]     = useState(false);
  const [history,         setHistory]        = useState('');
  const [camError,        setCamError]       = useState(false);
  const [speechSupport,   setSpeechSupport]  = useState(true);
  const [sessionTimer,    setSessionTimer]   = useState(false);
  const [showEndConfirm,  setShowEndConfirm] = useState(false);

  const videoRef       = useRef(null);
  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false);
  const streamRef      = useRef(null);

  /* ── Webcam ── */
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setCamError(true));
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  /* ── Speech Recognition ── */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSpeechSupport(false); setAnswerMode('text'); return; }
    const r = new SR();
    r.continuous     = true;
    r.interimResults = true;
    r.lang           = 'en-US';
    r.onresult = event => {
      let fin = '', inter = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) fin   += event.results[i][0].transcript + ' ';
        else                          inter += event.results[i][0].transcript;
      }
      if (fin)   setFinalTranscript(p => p + fin);
      if (inter) setInterimText(inter);
    };
    r.onerror = () => { setIsRecording(false); isRecordingRef.current = false; };
    r.onend   = () => { if (isRecordingRef.current) { try { r.start(); } catch (_) {} } };
    recognitionRef.current = r;
  }, []);

  /* ── Fetch question ── */
  const getQuestion = useCallback(async (currentHistory) => {
    setLoadingQ(true);
    setFinalTranscript('');
    setInterimText('');
    setTextAnswer('');
    try {
      const data = await fetchQuestion({ 
        topic: config.domain, 
        resume, 
        history: currentHistory, 
        exp: config.exp 
      });
      setQuestion(data.question || 'Could you describe a challenging project you worked on?');
    } catch {
      setQuestion('Could you walk me through a project you are proud of and explain the technical decisions you made?');
    }
    setLoadingQ(false);
    setSessionTimer(true);
  }, [config.domain, config.exp, resume]);

  useEffect(() => { getQuestion(''); }, []); // eslint-disable-line

  /* ── Voice ── */
  const startRecording = () => {
    setIsRecording(true); isRecordingRef.current = true;
    try { recognitionRef.current?.start(); } catch (_) {}
  };
  const stopRecording = () => {
    setIsRecording(false); isRecordingRef.current = false;
    recognitionRef.current?.stop(); setInterimText('');
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (isRecording) stopRecording();
    const answer = answerMode === 'voice' ? (finalTranscript + interimText).trim() : textAnswer.trim();
    if (!answer) return;

    setSubmitting(true);
    
    // 🛑 CRITICAL FIX: Build history MANUALLY here
    const currentTurn = `\nInterviewer: ${question}\nCandidate: ${answer}`;
    const updatedHistoryForAPI = history + currentTurn;
    
    // Set state for next time
    setHistory(updatedHistoryForAPI); 

    if (questionNum >= TOTAL) {
      const stats = JSON.parse(localStorage.getItem('mockMentorStats') || '{"totalInterviews":0,"scores":[]}');
      stats.totalInterviews += 1;
      localStorage.setItem('mockMentorStats', JSON.stringify(stats));
      localStorage.setItem('mockMentorTranscript', updatedHistoryForAPI);
      navigate('/results', { state: { transcript: updatedHistoryForAPI } });
    } else {
      setQuestionNum(n => n + 1);
      // 🛑 CRITICAL FIX: Pass the newly built string directly to the fetch function
      await getQuestion(updatedHistoryForAPI);
    }
    setSubmitting(false);
  };

  const currentAnswer = answerMode === 'voice'
    ? (finalTranscript + (interimText ? `\n${interimText}` : ''))
    : textAnswer;
  const canSubmit = currentAnswer.trim().length > 2 && !loadingQ && !submitting;

  const endSession = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    navigate('/results', { state: { transcript: history } });
  };

  return (
    <div className="noise relative min-h-screen bg-[#07090E] flex flex-col overflow-hidden">

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-600/[0.06] blur-[80px]" />
      </div>

      {/* ── Top bar ── */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/[0.05] backdrop-blur-xl bg-[#07090E]/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-white">
              <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display font-bold text-sm text-white">Mock<span className="text-indigo-400">Mentor</span></span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300 tracking-wide">LIVE SESSION</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.07] rounded-full px-3 py-1">
            <span className="text-xs text-slate-400">Q {questionNum}/{TOTAL}</span>
            <Timer running={sessionTimer && !loadingQ} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span className="text-slate-400 font-semibold">{Math.round(((questionNum - 1) / TOTAL) * 100)}%</span>
            </div>
            <div className="progress-track w-28 h-1.5">
              <div className="progress-fill" style={{ width: `${((questionNum - 1) / TOTAL) * 100}%` }} />
            </div>
          </div>
          <button type="button" onClick={() => setShowEndConfirm(true)}
            className="btn-ghost px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            End Session
          </button>
        </div>
      </header>

      {/* ── Main grid ── */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 p-5 max-w-7xl mx-auto w-full">

        {/* ── LEFT: Webcam ── */}
        <div className="flex flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden bg-[#0C1120] border border-white/[0.07] aspect-[4/3] lg:aspect-auto lg:flex-1">
            {camError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <p className="text-xs text-center px-4">Camera not available<br/><span className="text-slate-700">Enable camera permission in browser</span></p>
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            )}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-white font-semibold tracking-widest">REC</span>
            </div>
            {isRecording && (
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full p-2">
                <Waveform active={true} />
              </div>
            )}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[10px] text-white/40 font-semibold">
              <span>YOUR FEED</span><span>HD</span>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 space-y-3">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Session Info</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { lbl: 'Domain',    val: config.domain.toUpperCase() },
                { lbl: 'Level',     val: config.exp.charAt(0).toUpperCase() + config.exp.slice(1) },
                { lbl: 'Questions', val: `${questionNum - 1} / ${TOTAL}` },
                { lbl: 'Mode',      val: answerMode === 'voice' ? '🎙 Voice' : '✏️ Text' },
              ].map(({ lbl, val }) => (
                <div key={lbl} className="bg-white/[0.03] rounded-xl p-2.5">
                  <p className="text-slate-600 text-[10px] mb-0.5">{lbl}</p>
                  <p className="text-slate-200 font-semibold">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Question + Answer ── */}
        <div className="flex flex-col gap-4">

          {/* Question card */}
          <div className="glass rounded-2xl p-6 lg:p-8 flex-1 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/[0.07] rounded-full blur-[60px] pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">
                  AI is asking · Question {questionNum} of {TOTAL}
                </span>
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: TOTAL }).map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i < questionNum - 1 ? 'bg-emerald-500' :
                      i === questionNum - 1 ? 'bg-indigo-400 scale-125' :
                      'bg-white/10'
                    }`} />
                  ))}
                </div>
              </div>
              {loadingQ ? (
                <div className="flex items-center gap-3 text-slate-500">
                  <svg className="w-5 h-5 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span className="text-base italic">AI is generating your question…</span>
                </div>
              ) : (
                <p className="text-xl lg:text-2xl font-display font-medium text-white leading-relaxed">{question}</p>
              )}
            </div>
          </div>

          {/* Answer section */}
          <div className="glass rounded-2xl p-5">
            {speechSupport && (
              <div className="flex bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 mb-4">
                {[['voice','🎙  Voice'], ['text','✏️  Type']].map(([m, lbl]) => (
                  <button key={m} type="button"
                    onClick={() => { if (isRecording) stopRecording(); setAnswerMode(m); }}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      answerMode === m ? 'bg-indigo-600 text-white shadow-[0_2px_10px_rgba(99,102,241,0.35)]' : 'text-slate-400 hover:text-slate-200'
                    }`}>
                    {lbl}
                  </button>
                ))}
              </div>
            )}

            {/* Voice mode */}
            {answerMode === 'voice' && (
              <div className="space-y-4">
                <div className="min-h-[90px] bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-sm leading-relaxed">
                  {(finalTranscript || interimText) ? (
                    <>
                      <span className="text-slate-200">{finalTranscript}</span>
                      {interimText && <span className="text-slate-500 italic">{interimText}</span>}
                    </>
                  ) : (
                    <span className="text-slate-600 italic">
                      {isRecording ? 'Listening… speak your answer.' : 'Press the button below and start speaking.'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <button type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={loadingQ}
                    className={`relative flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex-1 justify-center ${
                      isRecording
                        ? 'bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/20'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <span className="w-3 h-3 rounded-sm bg-red-400" />
                        Stop Recording
                        <Waveform active={true} />
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2H3v2a9 9 0 008 8.94V22H9v2h6v-2h-2v-1.06A9 9 0 0021 12v-2h-2z"/>
                        </svg>
                        Start Recording
                      </>
                    )}
                  </button>
                  {finalTranscript && (
                    <button type="button" onClick={() => { setFinalTranscript(''); setInterimText(''); }}
                      className="btn-ghost p-3 rounded-xl text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Text mode */}
            {answerMode === 'text' && (
              <div>
                <textarea
                  value={textAnswer}
                  onChange={e => setTextAnswer(e.target.value)}
                  placeholder="Type your answer here… be as detailed as you can."
                  rows={5}
                  disabled={loadingQ}
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600
                             focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none transition-all duration-200 leading-relaxed"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-slate-600">{textAnswer.length} chars</span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button type="button" onClick={handleSubmit} disabled={!canSubmit}
              className={`mt-4 w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                canSubmit ? 'btn-primary' : 'bg-white/[0.04] border border-white/[0.06] text-slate-600 cursor-not-allowed'
              }`}>
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Submitting…
                </>
              ) : questionNum >= TOTAL ? 'Submit & See Results →' : 'Submit Answer & Next Question →'}
            </button>
          </div>
        </div>
      </main>

      {/* ── End confirm modal ── */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="glass rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-white/10">
            <h3 className="font-display text-xl font-bold text-white mb-2">End Session?</h3>
            <p className="text-sm text-slate-400 mb-7">Your current progress will be submitted for review. This cannot be undone.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowEndConfirm(false)}
                className="btn-ghost flex-1 py-3 rounded-xl font-semibold text-sm">Cancel</button>
              <button type="button" onClick={endSession}
                className="flex-1 py-3 rounded-xl font-semibold text-sm bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all">
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}