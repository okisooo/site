"use client";

import React from "react";
import { IndexLabel } from "./Hud";

/**
 * Section primitive for okiso.net
 * Semantic <section> container enforcing consistent max-width, responsive padding,
 * and vertical rhythm from the space scale. Includes optional index/label header row.
 * 
 * Motion/A11y contract:
 * - Semantic section landmark for screen reader navigation.
 * - Static layout component; does not obscure content.
 */
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  index?: string;
  label?: string;
  width?: "narrow" | "default" | "wide" | "full";
  rhythm?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
}

const widthClasses: Record<NonNullable<SectionProps["width"]>, string> = {
  narrow: "max-w-4xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
  full: "max-w-none w-full",
};

const rhythmClasses: Record<NonNullable<SectionProps["rhythm"]>, string> = {
  sm: "py-8 md:py-12",
  md: "py-12 md:py-20",
  lg: "py-16 md:py-32",
};

export function Section({
  id,
  index,
  label,
  width = "default",
  rhythm = "md",
  children,
  className = "",
  ...props
}: SectionProps) {
  const widthClass = widthClasses[width] || widthClasses.default;
  const rhythmClass = rhythmClasses[rhythm] || rhythmClasses.md;

  return (
    <section
      id={id}
      className={`relative w-full ${rhythmClass} ${className}`}
      {...props}
    >
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${widthClass}`}>
        {(index || label) && (
          <div className="mb-6 md:mb-8">
            <IndexLabel index={index || ""} label={label || ""} />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export default Section;
