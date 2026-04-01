import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Resume() {
  const [resumeText, setResumeText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle File Selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const removeFile = () => setUploadedFile(null);

  // 🚀 The Magic Function: Sends PDF to Backend, Saves Text, Jumps to Interview
  const handleProceed = async () => {
    let finalDataToSave = resumeText;

    if (uploadedFile) {
      setIsExtracting(true);
      const formData = new FormData();
      formData.append("resumeFile", uploadedFile);

      try {
        const response = await fetch("http://127.0.0.1:8080/extract-text", {
          method: "POST",
          body: formData,
        });
        
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        
        // This is the raw text ripped from your PDF!
        finalDataToSave = data.text; 
      } catch (error) {
        console.error("PDF Read Error:", error);
        alert("Failed to read the PDF. Ensure your backend is running!");
        setIsExtracting(false);
        return;
      }
    }

    // Save the resume text securely in the browser's local storage
    localStorage.setItem("mockMentorResume", finalDataToSave);
    
    // Teleport to the Live Interview Room!
    navigate('/interview');
  };

  const isReady = resumeText.length > 10 || uploadedFile !== null;

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center pt-12 pb-24 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">

        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-center mb-4 text-white">
          Provide <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Context.</span>
        </h1>
        <p className="text-gray-400 text-center max-w-2xl mb-12 font-light text-lg">
          Upload your resume (PDF) below. The AI will analyze your projects and experience to generate a hyper-personalized mock interview.
        </p>

        <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl mb-8 relative">
          
          {/* UPLOAD ZONE */}
          <div 
            onClick={() => !uploadedFile && fileInputRef.current.click()}
            className={`w-full mb-8 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center py-10
              ${uploadedFile ? 'border-green-500/50 bg-green-500/5' : 'border-white/20 bg-black/30 hover:border-cyan-400/50 hover:bg-white/5 cursor-pointer'}`}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
            
            {uploadedFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-full text-green-400">✓</div>
                <p className="text-white font-bold tracking-wide">{uploadedFile.name}</p>
                <button onClick={(e) => { e.stopPropagation(); removeFile(); }} className="mt-2 text-xs text-red-400 hover:text-red-300 underline">Remove File</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <p className="font-bold text-white">Click to upload your Resume</p>
                <p className="text-sm">PDF formats only</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-grow bg-white/10"></div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">OR PASTE TEXT</span>
            <div className="h-[1px] flex-grow bg-white/10"></div>
          </div>

          <textarea
            value={resumeText} onChange={(e) => setResumeText(e.target.value)} disabled={uploadedFile !== null || isExtracting}
            placeholder={uploadedFile ? "File uploaded. Text input disabled." : "Paste your resume details here..."}
            className={`w-full h-48 bg-black/50 border border-white/5 rounded-xl p-5 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none font-mono text-sm leading-relaxed
              ${uploadedFile || isExtracting ? 'opacity-50 cursor-not-allowed' : ''}`}
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button onClick={() => navigate('/')} disabled={isExtracting} className="px-8 py-4 rounded-full font-bold text-sm tracking-widest bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white transition-all">
            &larr; BACK
          </button>
          
          <button 
            onClick={handleProceed} 
            disabled={!isReady || isExtracting}
            className={`relative px-12 py-4 rounded-full font-bold text-sm tracking-[0.15em] transition-all duration-500 
              ${isReady && !isExtracting ? 'bg-cyan-500 text-black hover:bg-cyan-400 hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.3)]' : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'}`}
          >
             {isExtracting ? 'EXTRACTING DATA...' : 'INITIALIZE AI MENTOR'}
          </button>
        </div>
      </div>
    </div>
  );
}