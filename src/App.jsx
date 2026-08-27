import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import TerminalPage from './pages/terminal.jsx';
import VoidPage from './pages/home.jsx';
import Blogs from './pages/blogs.jsx';
import Achievements from './pages/achievement.jsx';
import AboutUs from './pages/about-Us.jsx';
import Resources from './pages/resources.jsx';
import ContactUs from './pages/contact-Us.jsx';
import IrcPage from './pages/irc.jsx';
import FAQPage from './pages/FAQ.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import './App.css';

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
      <Routes>
        <Route path="/terminal" element={<TerminalPage />} />
        <Route path="/" element={<VoidPage />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/blogs/:id" element={<BlogPostPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/resources" element={<Resources />} />
  <Route path="/contact-us" element={<ContactUs />} />
  <Route path="/irc" element={<IrcPage />} />
  <Route path="/FAQ" element={<FAQPage />} />
      </Routes>
      {showLoader && <LoadingScreen onDone={handleLoaderDone} />}
    </Router>
  );
}

export default App;