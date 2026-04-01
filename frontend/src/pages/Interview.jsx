import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Interview() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("AI is preparing your first question...");
  const [isRecording, setIsRecording] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [interviewHistory, setInterviewHistory] = useState("");
  
  const videoRef = useRef(null);

  // 1. 🔴 TURN ON WEBCAM
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Webcam Access Denied:", err);
      }
    };
    startWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // 2. 🧠 FETCH REAL QUESTIONS FROM BACKEND
  const fetchQuestion = async (currentHistory) => {
    setQuestion("AI is thinking...");
    try {
      const response = await fetch("http://localhost:8080/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: "Data Science & AI",
          resume: "Aspiring Data Analyst skilled in Python, Pandas, NumPy, Machine Learning, and PostgreSQL.",
          history: currentHistory
        })
      });
      const data = await response.json();
      setQuestion(data.question);
      
      // Save the AI's question to the transcript memory
      setInterviewHistory(prev => prev + "\nAI: " + data.question);
    } catch (err) {
      setQuestion("Network error. Please make sure your backend is running.");
    }
  };

  // Fetch the first question as soon as the page loads
  useEffect(() => {
    fetchQuestion("");
  }, []);

  // 3. 🎙️ HANDLE ANSWER SUBMISSION
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    // If we just STOPPED recording, process the answer
    if (isRecording) {
      // Simulate capturing the user's voice answer
      const simulatedUserAnswer = "\nUser: I used Python and Pandas for data manipulation, and trained the model using standard ML algorithms.";
      const updatedHistory = interviewHistory + simulatedUserAnswer;
      setInterviewHistory(updatedHistory);

      if (questionCount < 10) {
        setQuestionCount(prev => prev + 1);
        fetchQuestion(updatedHistory); // Fetch the next dynamic question based on history
      } else {
        // Send the FULL transcript to the Results page for grading
        navigate('/results', { state: { transcript: updatedHistory } });
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#050505] overflow-hidden font-sans p-6">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl flex justify-between items-center mb-8 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-gray-300 font-bold tracking-widest text-xs uppercase">Live Session</span>
        </div>
        <div className="text-cyan-400 font-black tracking-widest text-sm">
          QUESTION {questionCount} / 10
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* WEBCAM */}
        <div className="col-span-1 bg-black/40 border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl h-[300px] md:h-auto">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] text-white/50 font-bold tracking-widest">
            <span>REC // YOUR FEED</span>
            <span>1080P</span>
          </div>
        </div>

        {/* AI INTERVIEWER */}
        <div className="col-span-2 flex flex-col gap-6">
          <div className="flex-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl flex flex-col justify-center min-h-[300px]">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">AI Mentor is asking:</h2>
            <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
              {question}
            </p>
          </div>

          <button 
            onClick={toggleRecording}
            className={`w-full py-6 rounded-3xl font-black tracking-[0.2em] transition-all transform active:scale-95 shadow-2xl flex items-center justify-center gap-4 ${
              isRecording 
                ? "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30" 
                : "bg-cyan-500 text-black hover:bg-cyan-400 border border-cyan-400"
            }`}
          >
            {isRecording ? "STOP RECORDING & SUBMIT" : "START ANSWERING"}
          </button>
        </div>

      </div>
    </div>
  );
}