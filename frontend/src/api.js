/**
 * api.js — All backend calls in one place.
 * Uses Vite proxy in dev (no CORS) and VITE_API_URL in production.
 */

const BASE = import.meta.env.VITE_API_URL || '';

// Log the API base URL for debugging
if (BASE) {
  console.log('[API] Using backend URL:', BASE);
} else {
  console.log('[API] Using Vite proxy (localhost development)');
}

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  console.log(`[API] ${options.method || 'GET'} ${url}`);
  
  try {
    const res = await fetch(url, options);
    
    if (!res.ok) {
      console.error(`[API] Error: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      console.error(`[API] Response error:`, data);
      throw new Error(data.error || `HTTP ${res.status}`);
    }
    
    return data;
  } catch (err) {
    console.error(`[API] Request failed for ${url}:`, err.message);
    throw err;
  }
}

/** Extract text from a PDF File object */
export async function extractPdfText(file) {
  const form = new FormData();
  form.append('resumeFile', file);
  return request('/extract-text', { method: 'POST', body: form });
}

/** Generate the next interview question */
export async function fetchQuestion({ topic, resume, history, exp }) {
  return request('/question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, resume, history, exp }),
  });
}

/** Grade the full interview transcript */
export async function gradeTranscript(transcript) {
  return request('/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer: transcript }),
  });
}

/** Health check */
export async function healthCheck() {
  return request('/health');
}
