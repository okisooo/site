"use client";

import { useEffect, useState } from "react";

const TITLE_TEXT = "OKISO ✦";
const TYPING_SPEED = 300;
const BLINK_SPEED = 500;
const PAUSE_DURATION = 3000;

export function TitleAnimator() {
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  // Typing effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (index < TITLE_TEXT.length) {
        timeout = setTimeout(() => {
          setIndex(index + 1);
        }, TYPING_SPEED);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, PAUSE_DURATION);
      }
    } else {
      if (index > 0) {
        timeout = setTimeout(() => {
          setIndex(index - 1);
        }, TYPING_SPEED / 2); // Delete faster
      } else {
        timeout = setTimeout(() => {
          setIsTyping(true);
        }, PAUSE_DURATION / 2);
      }
    }

    return () => clearTimeout(timeout);
  }, [index, isTyping]);

  // Blinking cursor effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, BLINK_SPEED);

    return () => clearInterval(blinkInterval);
  }, []);

  // Update document title
  useEffect(() => {
    const currentText = TITLE_TEXT.slice(0, index);
    document.title = `${currentText}${showCursor ? "_" : " "}`;
  }, [index, showCursor]);

  return null;
}
