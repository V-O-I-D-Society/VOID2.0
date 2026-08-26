import React from "react";
import { Link } from 'react-router-dom';
import logo from "./../assets/logo.png"; // Ensure you have a logo image in the specified path

const Footer = () => {
  return (
    <footer className="site-footer">
    
      <div className="footer-container">


        <div className="footer-about">
          <div className="footer-logo h-2">
            <img src={logo} alt="VOID Logo" className="footer-logo-img" />
          </div>
          <p className="footer-description">
            VOID is a premier cybersecurity club dedicated to fostering the next
            generation of security professionals through hands-on learning and
            community collaboration.
          </p>
        </div>

        <div className="footer-links">
          <h6>Quick Links</h6>
          <ul className="footer-links-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/achievement">Achievements</Link></li>
            <li><Link to="/contact-us">Contact</Link></li>
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/FAQ">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h6>Contact Us</h6>
          <ul className="footer-links-list">
            <li><a href="mailto:voidsociety@kiet.edu">voidsociety@kiet.edu</a></li>
            <li><p>KIET Group of Institutions, Ghaziabad</p></li>
          </ul>
        </div>

        <div className="footer-social">
          <h6>Follow Us</h6>
          <div className="social-icons">
            <a href="https://github.com/V-O-I-D-Society" target="_blank" rel="noopener noreferrer" className="social-icon Github">G</a>
            <a href="https://www.linkedin.com/company/void-society/" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">L</a>
            <a href="https://www.instagram.com/kiet_voidsociety?igsh=YXZzcGwzOWRvOXZl" target="_blank" rel="noopener noreferrer" className="social-icon instagram">I</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} VOID Security Club. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
