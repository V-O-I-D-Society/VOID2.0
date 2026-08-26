import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import TerminalPage from './pages/terminal.jsx';
import VoidPage from './pages/home.jsx';
import Blogs from './pages/blogs.jsx';
import Achievements from './pages/achievement.jsx';
import AboutUs from './pages/about-Us.jsx';
import Resources from './pages/resources.jsx';
import ContactUs from './pages/contact-Us.jsx';
import FAQPage from './pages/FAQ.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
import './App.css';
function App() {
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
  <Route path="/FAQ" element={<FAQPage />} />
      </Routes>
    </Router>
  );
}

export default App;