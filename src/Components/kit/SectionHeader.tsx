"use client";

import React from "react";

/**
 * SectionHeader primitive for okiso.net
 * Standardized typography header layout using text-step-* fluid font steps.
 * 
 * Motion/A11y contract:
 * - Uses semantic heading hierarchy.
 * - Always fully visible by default; accessible to crawlers and screen readers.
 */
export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  kicker?: string;
  title: string | React.ReactNode;
  sub?: string | React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  kicker,
  title,
  sub,
  align = "left",
  className = "",
  ...props
}: SectionHeaderProps) {
  const alignmentClass =
    align === "center"
      ? "text-center items-center mx-auto"
      : "text-left items-start";

  return (
    <div
      className={`flex flex-col gap-2 md:gap-3 mb-8 md:mb-12 max-w-3xl ${alignmentClass} ${className}`}
      {...props}
    >
      {kicker && (
        <span className="font-mono text-step--1 uppercase tracking-[0.25em] text-accent font-semibold">
          {kicker}
        </span>
      )}
      {typeof title === "string" ? (
        <h2 className="text-step-3 md:text-step-4 font-bold tracking-tight text-ink-1 leading-tight">
          {title}
        </h2>
      ) : (
        title
      )}
      {sub && (
        <div className="text-step-0 md:text-step-1 text-ink-2 leading-relaxed">
          {sub}
        </div>
      )}
    </div>
  );
}

export default SectionHeader;
