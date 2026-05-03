import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth      from './pages/Auth';
import Setup     from './pages/Setup';
import Resume    from './pages/Resume';
import Interview from './pages/Interview';
import Results   from './pages/Results';

/* ─── Simple auth guard ─────────────────────────────── */
function RequireAuth({ children }) {
  const user = localStorage.getItem('mockMentorUser');
  return user ? children : <Navigate to="/" replace />;
}

function RequireConfig({ children }) {
  const config = localStorage.getItem('mockMentorConfig');
  return config ? children : <Navigate to="/setup" replace />;
}

/* ─── App ───────────────────────────────────────────── */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Auth />} />

        {/* Protected: require login */}
        <Route path="/setup" element={
          <RequireAuth><Setup /></RequireAuth>
        } />
        <Route path="/resume" element={
          <RequireAuth><Resume /></RequireAuth>
        } />

        {/* Protected: require login + config */}
        <Route path="/interview" element={
          <RequireAuth>
            <RequireConfig><Interview /></RequireConfig>
          </RequireAuth>
        } />
        <Route path="/results" element={
          <RequireAuth>
            <RequireConfig><Results /></RequireConfig>
          </RequireAuth>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
