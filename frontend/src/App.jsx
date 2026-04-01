import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Setup from './pages/Setup';
import Resume from './pages/Resume';
import Interview from './pages/Interview';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <Routes>
        {/* The Front Door now points to the Login Screen! */}
        <Route path="/" element={<Auth />} />
        
        {/* The rest of your app */}
        <Route path="/setup" element={<Setup />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;