"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { useScrollLock } from "@/motion/useScrollLock";
import { trapDialogTab } from "@/lib/dialogKeyboard";

export function EditorialDialog({ title, children, onClose, className = "" }: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const [closing, setClosing] = useState(false);
  onCloseRef.current = onClose;
  useScrollLock(true);

  function requestClose() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) onCloseRef.current();
    else setClosing(true);
  }

  useEffect(() => {
    if (!closing) return;
    const timeout = window.setTimeout(() => onCloseRef.current(), 170);
    return () => window.clearTimeout(timeout);
  }, [closing]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    if (opener && dialog.current) {
      const source = opener.getBoundingClientRect();
      const panel = dialog.current.getBoundingClientRect();
      const origin = Math.max(10, Math.min(90, (source.left + source.width / 2 - panel.left) / panel.width * 100));
      dialog.current.style.transformOrigin = `${origin}% 85%`;
    }
    close.current?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) onCloseRef.current();
        else setClosing(true);
      }
    };
    // The shared shell remains mounted while the dialog owns keyboard focus.
    const background = document.querySelectorAll<HTMLElement>("[data-editorial-background]");
    const blocked = Array.from(background).filter((element) => !element.contains(dialog.current));
    const previous = blocked.map((element) => element.inert);
    blocked.forEach((element) => { element.inert = true; });
    window.addEventListener("keydown", escape);
    return () => {
      blocked.forEach((element, index) => { element.inert = previous[index]; });
      window.removeEventListener("keydown", escape);
      opener?.focus({ preventScroll: true });
    };
  }, []);

  return <div className="ed-dialog-back" data-closing={closing || undefined} onClick={requestClose}>
    <div ref={dialog} className={`ed-dialog ${className}`} role="dialog" aria-modal="true" aria-label={title}
      onClick={(event) => event.stopPropagation()} onKeyDown={trapDialogTab} data-lenis-prevent>
      <header className="ed-dialog-heading">
        <h2>{title}</h2>
        <button ref={close} onClick={requestClose} className="ed-icon-button" aria-label={`Close ${title}`}><X size={20} /></button>
      </header>
      {children}
    </div>
  </div>;
}
