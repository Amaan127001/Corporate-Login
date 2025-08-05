import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router-dom';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './pages/Dashboard';
import ProfileCompletion from './pages/ProfileCompletion';
import NotFound from './pages/NotFound';
import Mail from './pages/Mail';
import Lists from './pages/Lists';
import Profile from './pages/Profile';
import Campaigns from './pages/Campaigns';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SelectList from './pages/SelectList';

function AppRoutes() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [checked, setChecked] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) { root.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else { root.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [darkMode]);

  useEffect(() => {
    const checkUser = async () => {
      if (!token) {
        if (pathname !== '/') navigate('/');
        setChecked(true);
        return;
      }
      try {
        const resp = await fetch('https://ingeniumai.onrender.com/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) throw new Error('Not authenticated');
        const { profileType, profileCompleted } = await resp.json();

        if (!profileType && pathname !== '/welcome') {
          navigate('/welcome');
        } else if (profileType && !profileCompleted && pathname !== '/profilecompletion') {
          navigate('/profilecompletion');
        } else if (profileType && profileCompleted && ['/', '/welcome', '/profilecompletion'].includes(pathname)) {
          navigate('/dashboard');
        }
      } catch {
        localStorage.removeItem('token');
        if (pathname !== '/') navigate('/');
      } finally {
        setChecked(true);
      }
    };
    checkUser();
  }, [navigate, token]);

  if (!checked) return null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home toggleTheme={() => setDarkMode(p => !p)} />} />
        <Route path="/welcome" element={<Welcome toggleTheme={() => setDarkMode(p => !p)} />} />
        <Route path="/profilecompletion" element={<ProfileCompletion toggleTheme={() => setDarkMode(p => !p)} />} />
        <Route path="/dashboard" element={<Dashboard toggleTheme={() => setDarkMode(p => !p)} isDarkMode={darkMode} />} />
        <Route path="/mail" element={<Mail toggleTheme={() => setDarkMode(p => !p)} isDarkMode={darkMode} />} />
        <Route path="/lists" element={<Lists toggleTheme={() => setDarkMode(p => !p)} isDarkMode={darkMode} />} />
        <Route path="/campaigns" element={<Campaigns toggleTheme={() => setDarkMode(p => !p)} isDarkMode={darkMode} />} />
        <Route path="/profile" element={<Profile toggleTheme={() => setDarkMode(p => !p)} isDarkMode={darkMode} />} />
        <Route path="/selectlist" element={<SelectList toggleTheme={() => setDarkMode(prev => !prev)} isDarkMode={darkMode} />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <Router>
        <AppRoutes />
      </Router>
    </GoogleOAuthProvider>
  );
}
