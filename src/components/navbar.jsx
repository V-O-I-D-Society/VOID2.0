import React, { useState } from "react";
import { Link } from "react-router-dom";
import void_logo from "./../assets/Void Society logo.svg";
import "./../index.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar_about">
      {/* Logo */}
      <img
        src={void_logo}
        alt="Logo"
        className="navbar_logo"
        onClick={closeMenu}
      />

      {/* Desktop nav */}
      <div className="navbar_about_left flex-grow justify-center navbar_desktop_only">
        <Link to="/" className="navbar_link">Home</Link>
        <Link to="/about-us" className="navbar_link">About</Link>
        <Link to="/contact-us" className="navbar_link">Contact</Link>
        <Link to="/blogs" className="navbar_link">Blogs</Link>
        <Link to="/FAQ" className="navbar_link">FAQ</Link>
      </div>

      <div className="navbar_about_right navbar_desktop_only">
        <Link to="/resources" className="navbar_link">Resources</Link>
        <Link to="/terminal" className="navbar_link">CLI</Link>
      </div>

      {/* Hamburger button (mobile only) */}
      <button
        aria-label="Toggle navigation menu"
        className={`navbar_toggle ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="navbar_overlay"
          onClick={closeMenu}
        ></div>
      )}

      {/* Mobile menu (slide-in) */}
      <div className={`navbar_mobile_menu ${isMenuOpen ? "open" : ""}`}>
        <div className="navbar_mobile_group">
          <Link to="/" className="navbar_link" onClick={closeMenu}>Home</Link>
          <Link to="/about-us" className="navbar_link" onClick={closeMenu}>About</Link>
          <Link to="/contact-us" className="navbar_link" onClick={closeMenu}>Contact</Link>
          <Link to="/blogs" className="navbar_link" onClick={closeMenu}>Blogs</Link>
          <Link to="/resources" className="navbar_link" onClick={closeMenu}>Resources</Link>
          <Link to="/terminal" className="navbar_link" onClick={closeMenu}>CLI</Link>
        </div>
      </div>
    </nav>
  );
}
