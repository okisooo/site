import React from "react";
import Image from "next/image";

interface PromoBannerProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href: string;
  ctaLabel: string;
  accentColor?: string;
  accentGlow?: string;
  ctaTextColor?: string;
  releaseDate?: string;
  releaseDateLabel?: string;
  className?: string;
  compact?: boolean;
  align?: "center" | "left";
  image?: string;
  imageAlt?: string;
}

const formatDate = (isoDate?: string) => {
  if (!isoDate) return "";
  const parts = isoDate.split("-");
  if (parts.length < 3) return "";
  const [year, month, dayRaw] = parts;
  const monthIndex = Number.parseInt(month, 10) - 1;
  const day = Number.parseInt(dayRaw, 10);
  if (Number.isNaN(monthIndex) || Number.isNaN(day)) return "";
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthLabel = MONTHS[monthIndex];
  if (!monthLabel) return "";
  return `${monthLabel} ${day}, ${year}`;
};

export default function PromoBanner({
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
  accentColor = "#ff2aa6",
  accentGlow = "rgba(255, 42, 166, 0.45)",
  ctaTextColor = "#12030f",
  releaseDate,
  releaseDateLabel,
  className = "",
  compact = false,
  align = "left",
  image,
  imageAlt,
}: PromoBannerProps) {
  const formattedDate = releaseDateLabel ?? formatDate(releaseDate);
  const textAlignmentClass = align === "center" ? "text-center" : "text-left";
  const justifyClass = align === "center" ? "justify-center" : "justify-start";
  const gapClasses = compact ? "gap-2.5" : "gap-5";
  const dateMarginClasses = compact ? "mt-1" : "mt-2";
  const ctaMarginClasses = compact ? "mt-2.5" : "mt-4 md:mt-4";
  const imageWrapperClasses = compact
    ? "order-0 w-full max-w-[170px] mx-auto h-20 overflow-hidden rounded-xl border border-white/15 bg-white/10 shadow-[0_14px_36px_-26px_rgba(255,0,122,0.65)]"
    : "order-0 w-full md:w-[220px] lg:w-[260px] overflow-hidden rounded-xl border border-white/15 bg-white/10 shadow-[0_20px_60px_-34px_rgba(255,0,122,0.7)]";
  const imageInnerClasses = compact ? "relative h-full w-full" : "relative aspect-video";
  const imageSizes = compact
    ? "(min-width: 768px) 170px, 100vw"
    : "(min-width: 1024px) 260px, (min-width: 768px) 220px, 100vw";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_24px_60px_-35px_rgba(255,0,166,0.75)] transition-transform duration-200 hover:translate-y-[-2px] hover:shadow-[0_30px_80px_-32px_rgba(255,0,166,0.85)] ${compact ? "px-4 py-4" : "px-6 py-6 md:px-8 md:py-7"} ${className}`}
      style={{
        background:
          "linear-gradient(180deg, rgba(16, 8, 14, 0.82), rgba(16, 8, 14, 0.62))",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 10% 10%, rgba(255, 255, 255, 0.12), transparent 55%), radial-gradient(120% 120% at 85% 20%, rgba(255, 0, 166, 0.16), transparent 60%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: `inset 0 0 120px -40px ${accentGlow}`,
        }}
      />
      <div className={`relative z-10 flex flex-col ${gapClasses} md:flex-row md:items-center md:gap-6`}>
        {image && (
          <div className={imageWrapperClasses}>
            <div className={imageInnerClasses}>
              <Image
                src={image}
                alt={imageAlt ?? title}
                fill
                sizes={imageSizes}
                className="object-cover"
                priority={compact}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent"
              />
            </div>
          </div>
        )}
        <div className={`flex-1 w-full ${textAlignmentClass}`}>
          {eyebrow && (
            <p className="uppercase tracking-[0.28em] text-[10px] md:text-xs text-pink-200/80 mb-1">
              {eyebrow}
            </p>
          )}
          <h3 className={`h-display h-neon-strong font-semibold ${compact ? "text-base" : "text-xl md:text-2xl"}`}>
            {title}
          </h3>
          {description && (
            <p className={`text-gray-200/90 text-sm md:text-base text-shadow-sm ${compact ? "mt-1" : "mt-2"}`}>
              {description}
            </p>
          )}
          {formattedDate && (
            <p className={`text-[11px] md:text-sm text-gray-300/80 ${dateMarginClasses}`}>
              Released {formattedDate}
            </p>
          )}
          <div className={`flex ${justifyClass} ${ctaMarginClasses}`}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-1.5 rounded-full ${compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} font-semibold shadow-[0_12px_30px_-18px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-18px_rgba(0,0,0,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80`}
              style={{
                background: accentColor,
                color: ctaTextColor,
              }}
            >
              {ctaLabel}
              <span className={`${compact ? "text-base" : "text-lg"}`} aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
