import React, { useState, useEffect, useRef } from "react";
import Navbar from "./../components/navbar";
import "./../index.css";

const Terminal = () => {
  const [lines, setLines] = useState([
    "Welcome to VOID Terminal.",
    "Type 'help' for a list of available commands.",
  ]);
  const [input, setInput] = useState("");
  const endOfTerminalRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newLines = [...lines, `> ${input}`];

    if (input.toLowerCase() === "help") {
      newLines.push("Available commands: help, clear");
    } else if (input.toLowerCase() === "clear") {
      setLines([]);
      setInput("");
      return;
    } else if (input.trim() !== "") {
      newLines.push(`Command not found: ${input}`);
    }

    setLines(newLines);
    setInput("");
  };

  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div className="kali-terminal">
      <div className="terminal-content">
        <div className="terminal-output">
          {lines.map((line, index) => (
            <div key={index} className="terminal-line">{line}</div>
          ))}
          <div ref={endOfTerminalRef} />
        </div>
        <form onSubmit={handleFormSubmit} className="terminal-input-form">
          <span className="prompt">&gt;</span>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className="terminal-input"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};

export default function TerminalPage() {
  return (
    <div>
      <Navbar />
      <Terminal />
    </div>
  );
}