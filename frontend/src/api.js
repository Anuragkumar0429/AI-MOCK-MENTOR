// frontend/src/api.js

// 1. THE FIXED AI QUESTION MATCHER
export const fetchQuestion = async ({ topic, resume, history, exp }) => {
  try {
    const response = await fetch("http://localhost:4000/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, resume, history, exp }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching question:", error);
    return { question: "Could you elaborate on your technical experience?" };
  }
};

// 2. THE RESTORED PDF PARSER
export const extractPdfText = async (file) => {
  try {
    const formData = new FormData();
    formData.append("resumeFile", file);

    const response = await fetch("http://localhost:4000/parse-pdf", {
      method: "POST",
      body: formData, 
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    return ""; 
  }
};

// 3. THE RESTORED GRADING FUNCTION (Fixes your white screen!)
export const gradeTranscript = async (transcript) => {
  try {
    const response = await fetch("http://localhost:4000/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error grading transcript:", error);
    return { score: 0, feedback: "Error generating your final score." };
  }
};