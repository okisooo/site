"use client";

import { useEffect, useState } from "react";

// Full canonical title — must match the <title> in app/layout metadata so
// crawlers and users see a consistent, SEO-friendly title.
const FULL_TITLE = "OKISO ✦ Official Site | VOCALOID Producer & VTuber";
const TITLE_TEXT = "OKISO ✦";
const TYPING_SPEED = 300;
const BLINK_SPEED = 500;
const PAUSE_DURATION = 3000;

export function TitleAnimator() {
  // Only animate the tab title while the page is hidden (user tabbed away).
  // Googlebot renders with the page visible, so it always captures FULL_TITLE
  // instead of a half-typed fragment — which previously made Google rewrite
  // the search title to a generic "OKISO.NET // WEBSITE".
  const [hidden, setHidden] = useState(false);
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const onChange = () => {
      const isHidden = document.visibilityState === "hidden";
      setHidden(isHidden);
      if (!isHidden) {
        // Back in view: restore the canonical title, reset animation state.
        document.title = FULL_TITLE;
        setIndex(0);
        setIsTyping(true);
      }
    };
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  // Typing effect (only while hidden)
  useEffect(() => {
    if (!hidden) return;
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (index < TITLE_TEXT.length) {
        timeout = setTimeout(() => setIndex(index + 1), TYPING_SPEED);
      } else {
        timeout = setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (index > 0) {
        timeout = setTimeout(() => setIndex(index - 1), TYPING_SPEED / 2);
      } else {
        timeout = setTimeout(() => setIsTyping(true), PAUSE_DURATION / 2);
      }
    }

    return () => clearTimeout(timeout);
  }, [index, isTyping, hidden]);

  // Blinking cursor effect (only while hidden)
  useEffect(() => {
    if (!hidden) return;
    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, BLINK_SPEED);

    return () => clearInterval(blinkInterval);
  }, [hidden]);

  // Update document title while hidden
  useEffect(() => {
    if (!hidden) return;
    const currentText = TITLE_TEXT.slice(0, index);
    document.title = `${currentText}${showCursor ? "_" : " "}`;
  }, [index, showCursor, hidden]);

  return null;
}
