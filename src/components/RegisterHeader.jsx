import React from "react";
import void_logo from "../assets/logo.webp";

// Minimal chrome for register.void-society.in: just the VOID logo, no
// navigation on any viewport, so visitors cannot leave the register page.
const RegisterHeader = () => (
  <header className="register-only-header" role="banner">
    <img src={void_logo} alt="VOID" className="register-only-logo" draggable={false} />
  </header>
);

export default RegisterHeader;
