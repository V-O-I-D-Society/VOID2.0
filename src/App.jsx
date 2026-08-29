import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import VoidPage from './pages/home.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import './App.css';

// Lazy-load non-landing routes so the initial bundle stays small.
const TerminalPage = lazy(() => import('./pages/terminal.jsx'));
const Blogs = lazy(() => import('./pages/blogs.jsx'));
const Achievements = lazy(() => import('./pages/achievement.jsx'));
const AboutUs = lazy(() => import('./pages/about-Us.jsx'));
const Resources = lazy(() => import('./pages/resources.jsx'));
const ContactUs = lazy(() => import('./pages/contact-Us.jsx'));
const Register = lazy(() => import('./pages/register.jsx'));
const IrcPage = lazy(() => import('./pages/irc.jsx'));
const FAQPage = lazy(() => import('./pages/FAQ.jsx'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage.jsx'));
const PanelSight = lazy(() => import('./pages/panelSight.jsx'));

const LOADER_KEY = 'void_loader_seen';
const LOADER_WINDOW_MS = 30 * 60 * 1000; // 30 min

function App() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const last = Number(localStorage.getItem(LOADER_KEY) || 0);
    // Show only on first visit, or when the previous visit was more than 30 min ago.
    if (!last || now - last > LOADER_WINDOW_MS) {
      setShowLoader(true);
    }
  }, []);

  const handleLoaderDone = () => {
    localStorage.setItem(LOADER_KEY, String(Date.now()));
    setShowLoader(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/terminal" element={<TerminalPage />} />
          <Route path="/" element={<VoidPage />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/blogs/:id" element={<BlogPostPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/irc" element={<IrcPage />} />
          <Route path="/FAQ" element={<FAQPage />} />
          <Route path="/panel-sight" element={<PanelSight />} />
        </Routes>
      </Suspense>
      {showLoader && <LoadingScreen onDone={handleLoaderDone} />}
    </Router>
  );
}

export default App;
