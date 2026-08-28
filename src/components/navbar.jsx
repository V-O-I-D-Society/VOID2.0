import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Menu, Terminal, Info } from "lucide-react";
import GlassSurface from "./../components/ui/GlassSurface/GlassSurface";
import StaggeredMenu from "./../components/StaggeredMenu/StaggeredMenu";
import Dock from "./../components/Dock/Dock";
import "./../index.css";

const MOBILE_ITEMS = [
  { label: "Home", link: "/", ariaLabel: "Go to Home" },
  { label: "About", link: "/about-us", ariaLabel: "Go to About" },
  { label: "Register", link: "/register", ariaLabel: "Go to Register" },
  { label: "Contact", link: "/contact-us", ariaLabel: "Go to Contact" },
  { label: "Blogs", link: "/blogs", ariaLabel: "Go to Blogs" },
  { label: "FAQ", link: "/FAQ", ariaLabel: "Go to FAQ" },
  { label: "Resources", link: "/resources", ariaLabel: "Go to Resources" },
  { label: "CLI", link: "/terminal", ariaLabel: "Go to CLI" }
];

const DOCK_ITEMS = (navigate, openMenu) => [
  { icon: <Home size={20} />, label: "Home", onClick: () => navigate("/") },
  { icon: <Menu size={20} />, label: "Menu", onClick: openMenu },
  { icon: <Terminal size={20} />, label: "CLI", onClick: () => navigate("/terminal") },
  { icon: <Info size={20} />, label: "About", onClick: () => navigate("/about-us") }
];

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar_about">
        <GlassSurface
          width="100%"
          height={60}
          borderRadius={999}
          borderWidth={0.05}
          brightness={55}
          opacity={0.9}
          blur={12}
          backgroundOpacity={0.12}
          saturation={1.2}
          className="navbar_glass"
          style={{ maxWidth: "1100px", margin: "0 auto" }}
        >
          <div className="flex w-full items-center justify-between gap-2 px-4">
            {/* Logo */}
            <img src="/logo-for-nav.png" alt="Logo" className="navbar_logo" />

            {/* Desktop nav */}
            <div className="navbar_about_left navbar_desktop_only">
              <Link to="/" className="navbar_link">Home</Link>
              <Link to="/about-us" className="navbar_link">About</Link>
              <Link to="/register" className="navbar_link">Register</Link>
              <Link to="/contact-us" className="navbar_link">Contact</Link>
              <Link to="/blogs" className="navbar_link">Blogs</Link>
              <Link to="/FAQ" className="navbar_link">FAQ</Link>
            </div>

            <div className="navbar_about_right navbar_desktop_only">
              <Link to="/resources" className="navbar_link">Resources</Link>
              <Link to="/terminal" className="navbar_link">CLI</Link>
            </div>
          </div>
        </GlassSurface>

        {/* Mobile menu — StaggeredMenu (reactbits.dev), toggle sits in the glass pill */}
        <StaggeredMenu
          className="navbar-staggered"
          logoUrl="/logo-for-nav.png"
          position="right"
          items={MOBILE_ITEMS}
          displaySocials={false}
          displayItemNumbering={false}
          accentColor="#3b82f6"
          menuButtonColor="#e5e7eb"
          openMenuButtonColor="#ffffff"
          colors={["#15151c", "#1b1b24", "#23232e", "#0e0e13"]}
          isFixed
          closeOnClickAway
          open={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
        />
      </nav>

      {/* Mobile bottom dock (reactbits.dev Dock) — hidden on desktop */}
      <div className="mobile-dock">
        <Dock
          items={DOCK_ITEMS(navigate, () => setMobileMenuOpen(true))}
          panelHeight={64}
          baseItemSize={50}
          magnification={70}
        />
      </div>
    </>
  );
}
