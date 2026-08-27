import React, { useEffect, useRef, useState } from "react";

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};':\",./<>?";

/**
 * Reactbits-style decryption text animation.
 * Characters scramble through a charset before settling into the final text.
 */
export default function DecryptedText({
  text = "",
  speed = 45,
  className = "",
  charset = DEFAULT_CHARSET,
  sequential = true,
  animateOn = "view",
  startDelay = 0,
}) {
  const [display, setDisplay] = useState(text);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  // Trigger the animation on view (default) or immediately.
  useEffect(() => {
    if (animateOn !== "view") {
      setStarted(true);
      return undefined;
    }
    if (!ref.current) return undefined;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => setStarted(true), startDelay);
          io.disconnect();
        }
      });
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [animateOn, startDelay]);

  // Run the decrypt animation while started.
  useEffect(() => {
    if (!started) return undefined;

    const randomChar = () => charset[Math.floor(Math.random() * charset.length)];
    const total = text.length;
    const settled = Array(total).fill(false);
    let iterations = 0;

    const tick = () => {
      iterations++;
      let allSettled = true;

      const next = text.split("").map((ch, i) => {
        if (ch === " ") {
          settled[i] = true;
          return " ";
        }
        if (settled[i]) return ch;

        const shouldSettle = sequential
          ? i < iterations
          : Math.random() < 0.35 || iterations > 40;

        if (shouldSettle) {
          settled[i] = true;
          return ch;
        }
        allSettled = false;
        return randomChar();
      });

      setDisplay(next.join(""));

      if (allSettled) {
        clearInterval(interval);
        setDisplay(text);
      }
    };

    const interval = setInterval(tick, speed);
    return () => clearInterval(interval);
  }, [started, text, speed, charset, sequential]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
