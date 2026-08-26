import React from "react";
import kali from "./../assets/web.svg";
import Navbar from "./../components/navbar";
import Footer from "./../components/footer";
import { useRef, useState, useEffect } from "react";
import breach from "./../assets/achievements/Breacheverse.jpg";
import nullkiet from "./../assets/achievements/Null-Ghaziabad.jpg";
import nullmeetup from "./../assets/achievements/Null-meetup.jpg";
import school from "./../assets/achievements/School.jpg"
import LinuxBootcamp from "./../assets/achievements/LinuxBootcamp.jpg"
import nullLogo from "./../assets/Null.png"; 
import cyndiaLogo from "./../assets/cyndia.svg"; 
import piratesLogo from "./../assets/Pirates.png"; 
import alumni from "./../assets/Alumni.jpg"
import rnb from "./../assets/achievements/RednBlue.png"
import Secure from "./../assets/achievements/CyberSecure.png"
// Dot Spotlight Component
function DotSpotlight() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 1200, height: 800 });
  const containerRef = useRef(null);

  // Update screen size on mount and resize
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Listen for mouse/touch events on the entire hero section
  useEffect(() => {
    const handleMouseMove = (e) => {
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const handleTouchMove = (e) => {
      const heroSection = document.querySelector('.hero-section');
      if (heroSection && e.touches[0]) {
        const rect = heroSection.getBoundingClientRect();
        setMousePos({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        });
      }
    };

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.addEventListener('mousemove', handleMouseMove);
      heroSection.addEventListener('touchmove', handleTouchMove);
      heroSection.addEventListener('touchstart', handleTouchMove);
      
      return () => {
        heroSection.removeEventListener('mousemove', handleMouseMove);
        heroSection.removeEventListener('touchmove', handleTouchMove);
        heroSection.removeEventListener('touchstart', handleTouchMove);
      };
    }
  }, []);

  // Generate dot grid based on actual screen size
  const generateDots = () => {
    const dots = [];
    const dotSize = 2;
    const spacing = 25;
    const cols = Math.ceil(screenSize.width / spacing) + 2; // +2 for buffer
    const rows = Math.ceil(screenSize.height / spacing) + 2; // +2 for buffer

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing;
        const y = j * spacing;
        const distance = Math.sqrt(Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2));
        const maxDistance = 120; // spotlight radius
        const opacity = Math.max(0, 1 - distance / maxDistance);
        
        dots.push(
          <div
            key={`${i}-${j}`}
            className="dot"
            style={{
              left: x,
              top: y,
              backgroundColor: opacity > 0.1 ? `rgba(59, 130, 246, ${opacity * 0.8})` : 'rgba(255, 255, 255, 0.15)',
              width: dotSize,
              height: dotSize,
              boxShadow: opacity > 0.3 ? `0 0 ${opacity * 10}px rgba(59, 130, 246, ${opacity * 0.5})` : 'none',
            }}
          />
        );
      }
    }
    return dots;
  };

  return (
    <div
      ref={containerRef}
      className="dot-spotlight-container"
    >
      {generateDots()}
    </div>
  );
}

function GlowingButton() {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // update CSS variables dynamically
    btnRef.current.style.setProperty("--x", `${x}px`);
    btnRef.current.style.setProperty("--y", `${y}px`);
  };

  const handleClick = () => {
    // detect if user is on mobile
    const isMobile = window.innerWidth <= 768;

    let targetSection;

    if (isMobile) {
      // scroll to mobile features first
      targetSection = document.querySelector(".irc-section");
    } else {
      // desktop fallback → IRC → Achievements → Kali SVG
      targetSection =
        document.querySelector(".irc-section") ||
        document.querySelector(".achievements-section") ||
        document.querySelector(".kali_svg_div");
    }

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <button
      ref={btnRef}
      className="about-button mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Desktop label */}
      <span className="hidden md:inline">Get Started</span>
      {/* Mobile label */}
      <span className="md:hidden">Get started</span>
    </button>
  );
}

// (RegisterButton removed — registrations not shown on home page)
const AchievementCard = ({ title, description, imageUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const toggleShowMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="achievement-card">
      <img src={imageUrl} alt={title} className="achievement-image" />
      <div className="achievement-content">
        <h3 className="achievement-title">{title}</h3>
        <p className={`achievement-description ${isMobile ? (isExpanded ? 'expanded' : 'truncated') : ''}`}>
          {description}
        </p>
        {/* Only show more/less button on mobile phones */}
        {isMobile && (
          <button 
            className="show-more-btn"
            onClick={toggleShowMore}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
};

const PartnerCard = ({ name, description, imageUrl, link, customClassName = '' }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="partner-card-link">
      <div className={`partner-card ${customClassName}`}>
        <div className="partner-image-container">
          <img src={imageUrl} alt={`${name} logo`} className="partner-image" />
        </div>
        <div className="partner-content">
          <h3 className="partner-name">{name}</h3>
          <p className="partner-description">{description}</p>
        </div>
      </div>
    </a>
  );
};
export default function VoidPage() {
  return (
    
    <div className="">
      <Navbar />
      
      {/* Hero Section with SVG Background for Mobile */}
      <div className="hero-section">
        {/* Dot Spotlight Background */}
        <DotSpotlight />
        
        {/* Invisible overlay for mouse tracking */}
        <div className="hero-interaction-layer"></div>
        
        {/* About Description */}
        <div className="about_desc z-30">
          <div className="about-club ">
            <h1 className="about-club-h1 ">
              Enter into the Cyber Arena with VOID
            </h1>
            <p className="text-sm text-white  max-w-[60ch] ">
              Only Cybersecurity and ethical hacking club of KIET Group of Institutions.
            </p>
                {/* glowing buttons */}
               <GlowingButton />
          </div>
        </div>

        {/* Kali SVG - Background on Mobile, Normal on Desktop */}
        <div className="kali_svg_div">
        <img src={kali} alt="kali" className="kali_svg" />
        </div>
      </div>



{/* testing tailwind */}
{/* <div className="bg-blue-500 text-green-500 p-4 m-4 rounded-lg shadow-lg">
  This div should have a blue background, white text, padding, margin, rounded corners, and a shadow if Tailwind is working correctly.
</div> */}

      {/* Mobile Features Section - Hidden on Desktop */}
      <div className="mobile-features-section">
        <div className="mobile-features-container">
          <h2 className="mobile-features-title">Explore Cybersecurity</h2>
          <div className="mobile-features-grid">
            <div className="mobile-feature-card">
              <div className="mobile-feature-icon">🛡️</div>
              <h3>Ethical Hacking</h3>
              <p>Learn penetration testing and vulnerability assessment</p>
            </div>
            <div className="mobile-feature-card">
              <div className="mobile-feature-icon">🔐</div>
              <h3>Security Tools</h3>
              <p>Master industry-standard cybersecurity tools</p>
            </div>
            <div className="mobile-feature-card">
              <div className="mobile-feature-icon">🌐</div>
              <h3>Network Security</h3>
              <p>Understand network protocols and security measures</p>
            </div>
            <div className="mobile-feature-card">
              <div className="mobile-feature-icon">💻</div>
              <h3>Digital Forensics</h3>
              <p>Investigate and analyze digital evidence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA Section */}
      <div className="mobile-cta-section">
        <div className="mobile-cta-container">
          <h2 className="mobile-cta-title">Ready to Start Your Journey?</h2>
          <p className="mobile-cta-description">
            Join our community of cybersecurity enthusiasts and professionals. 
            Learn, practice, and excel in the world of digital security.
          </p>
          <div className="mobile-cta-buttons">
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="mobile-cta-btn primary" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>Register Now</button>
              <span style={{ color: '#d1d5db', fontWeight: 600 }}>Registrations closed</span>
            </div>
          </div>
        </div>
      </div>

{/* IRC Section */}
<div className="irc-section">
  <div className="irc-panel-container" style={{ width: "100%", height: "500px" }}>
    <iframe
      src="https://web.libera.chat/#void-society"
      title="IRC Chat"
      className="irc-panel"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        borderRadius: "8px",
      }}
    ></iframe>
  </div>
  <div className="irc-text-container">
    <h2 className="irc-heading">Join our IRC Channel</h2>
    <p className="irc-description">
      And be part of our vibrant community. Connect, collaborate, and share your
      passion for cybersecurity with like-minded individuals.
    </p>
  </div>
</div>
{/* let it deploy */}

      {/* Achievements Section */}
      <section className="achievements-section">
        <h2 className="section-title">Our Events</h2>
        <p className="section-subtitle">Recognized for excellence and innovation in cybersecurity solutions.</p>
        <div className="achievements-grid">
          <AchievementCard
            title="RED N BLUE — Grand Finale of CyberSecureX1.0"
            description="The VOID Society, under the guidance of the CSE Department at KIET Group of Institutions, hosted RED N BLUE, a 24-hour offline CTF where the top 10 teams from online qualifiers battled in a real-world cyber range with live servers and firewalls. Inspired by a Resident Evil–themed storyline, Red Teams hacked into Umbrella Corp’s systems to stop a nuclear threat while Blue Teams defended critical networks against intrusions. With nonstop action, teamwork, and incident response, this became one of India’s first large-scale offline CTFs — an immersive cyber experience that tested skill, strategy, and resilience."
            imageUrl={rnb}
          />
          <AchievementCard
            title="Null – Ghaziabad Chapter at KIET"
            description=" Null is India’s largest open security community, and we are proud to operate its Ghaziabad Chapter in collaboration with our Centre of Excellence (COE). The chapter serves as a vibrant platform that connects students, faculty, and industry professionals through regular meetups and interactive sessions. These gatherings focus on the latest cybersecurity trends, real-world case studies, and occasionally even discussions on recently discovered CVEs, ensuring participants stay updated with industry practices.
The initiative has created a valuable bridge between academia and industry, opening doors for internships and job opportunities for our students while fostering collaboration across the cybersecurity community. With its strong emphasis on knowledge-sharing and networking, the chapter has quickly become a hub for aspiring and experienced professionals alike.
The very first event of the Null Ghaziabad Chapter was a resounding success, attracting more than 100 participants from outside the college. This overwhelming response highlights the growing relevance of cybersecurity and the chapter’s role in shaping a community-driven ecosystem for learning and professional growth."
            imageUrl={nullkiet}
          />
          <AchievementCard
            title="Null Meetup 2024–25"
            description=" As part of the 2024–25 session, we successfully hosted the next Null Meetup under the Ghaziabad Chapter. The event featured insightful sessions by Dr. D3 and Youghal Pathak, two highly respected figures in the Indian cybersecurity space and contributors to the Government of India’s cybersecurity initiatives. Their expertise and real-world perspectives provided participants with valuable knowledge on evolving threats and defensive strategies.
Adding to the significance of the meetup, the founders of Hackitise Labs were also present, creating an excellent opportunity for students and professionals to interact directly with leading innovators in the field. Beyond technical learning, the event served as a powerful networking platform, enabling participants to connect with experts and peers, exchange ideas, and explore future opportunities in the cybersecurity domain.
"
            imageUrl={nullmeetup}
          />
          <AchievementCard
            title="Breachverse Bootcamp"
            description="The Breachverse Bootcamp was a successfully organized paid program focused on introducing first-year students to the world of Ethical Hacking. With over 50 enthusiastic participants, the bootcamp provided a strong foundation in real-world hacking techniques, delivered through practical and hands-on demonstrations. The sessions were conducted by the Coordinator of our Centre of Excellence, ensuring that students received expert guidance and exposure to industry-relevant practices. This initiative not only built technical awareness but also created a platform for young learners to explore cybersecurity in a structured and engaging manner. The overwhelming response and participation highlighted the growing interest in cybersecurity and made the bootcamp a remarkable achievement for our team.
"
            imageUrl={breach}
          />
          <AchievementCard
            title="Linux Bootcamp – September 2024"
            description="In September 2024, we organized a Linux Bootcamp designed to take participants from the basics to advanced concepts in system usage and administration. The bootcamp was conducted by the Coordinators of our Centre of Excellence, ensuring expert guidance and a structured learning experience. With 50 registered participants, the program offered hands-on exposure to essential Linux commands, shell scripting, system management, and advanced features that are vital for both developers and cybersecurity enthusiasts. This paid initiative received an excellent response, reflecting the strong demand for practical Linux skills and the effectiveness of our applied learning approach.
"
            imageUrl={LinuxBootcamp}
          />
          <AchievementCard
            title="Ethical Hacking Bootcamp – June 2025"
            description="As part of the CyberSecureX event organized by the CSE Department, our Centre of Excellence successfully conducted an Ethical Hacking Bootcamp in June 2025. What made this initiative unique was that it was entirely managed by students, showcasing their organizational and technical capabilities. The bootcamp received an overwhelming response with 100+ paid registrations, making it one of our most impactful training events. Participants gained practical exposure to real-world hacking techniques, security tools, and hands-on demonstrations, strengthening their understanding of modern cybersecurity practices. This achievement reflects both the enthusiasm of our students and the growing demand for structured cybersecurity learning opportunities."
            imageUrl={Secure}
          />
          <AchievementCard
            title="Awareness Campaign – 5 Schools"
            description="Our Centre of Excellence conducted a Cyber Awareness Campaign across five schools in the region, reaching out to over 200+ students.. The sessions were designed to be interactive and age-appropriate, covering essential topics such as safe internet practices, protection against cyberbullying, responsible use of social media, and recognizing online scams. To make the learning engaging, we included live demonstrations, visual handouts, and relatable real-life examples. The initiative not only educated young students on digital safety but also sparked curiosity about cybersecurity as a career path, leaving a lasting impact on both students and faculty."
            imageUrl= {school}
          />
        </div>
      </section>

      {/* Alumni Network Section */}
      <section className="alumni-section">
        <h2 className="section-title">Our Alumni Network</h2>
        <p className="section-subtitle">
          From VOID to leading roles in the cybersecurity industry, our alumni are making an impact.
        </p>
        <div className="alumni-content">
          <div className="alumni-photo-container">
            <img src={alumni} alt="VOID Alumni Network" className="alumni-group-photo" />
          </div>
          <div className="alumni-text-container">
            <h3 className="alumni-subheading">Pioneering the Future of Cyber Defense</h3>
            <p className="alumni-description">
              Our alumni are a testament to the practical skills and deep knowledge gained at VOID. They have secured positions at top tech companies, cybersecurity firms, and government agencies, where they lead, innovate, and protect. They remain an active part of our community, mentoring current students and creating pathways for the next generation of cyber defenders.
            </p>
          </div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section className="partners-section">
        <h2 className="section-title">Our Community partners</h2>
        <p className="section-subtitle">Collaborating with the best to foster a thriving cybersecurity ecosystem.</p>
        <div className="partners-grid">
          <PartnerCard
            name="Null Community"
            description="India's largest open security community."
            imageUrl={nullLogo}
            link="https://null.community/"
          />
          <PartnerCard
            name="Cyndia"
            description="Your partner in cyber defense and intelligence."
            imageUrl={cyndiaLogo}
            customClassName="cyndia-card"
            link="https://cyndia.in/"
          />
          <PartnerCard
            name="0x0 Pirates"
            description="A community for hackers, by hackers, focusing on practical cybersecurity skills."
            imageUrl={piratesLogo}
            link="https://www.0x0pirates.com/chapters/kiet"
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
