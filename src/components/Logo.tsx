import React from "react";
import Image from "next/image";

// The approved MGR Digital Studio monogram, cropped from the supplied
// artwork (which already ships with real alpha) to isolate just the icon
// from the fuller icon+wordmark+tagline lockup, so it drops onto the glass
// theme's paper background and translucent panels alike without a
// background box.
export const LogoMark: React.FC<{ className?: string; animated?: boolean }> = ({
  className = "h-10 w-auto",
  animated = false,
}) => (
  <div className={`relative inline-block ${className}`} aria-hidden="true">
    <Image
      src="/logo-mark.png"
      alt=""
      width={700}
      height={254}
      priority
      className="w-full h-full object-contain drop-shadow-[0_4px_14px_rgba(15,23,42,0.12)]"
    />
    {animated && <span className="logo-sheen" />}
  </div>
);

export const Wordmark: React.FC<{
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}> = ({ showTagline = true, size = "md" }) => {
  const textSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <div className="flex flex-col">
      <span
        className={`${textSize} font-bold tracking-tight text-ink font-sans leading-tight`}
      >
        MGR <span className="text-gold">Digital Studio</span>
      </span>
      {showTagline && (
        <span className="text-[10px] text-ink-3 font-medium tracking-wide hidden sm:block">
          Websites · Landing Pages · SEO · Marketing
        </span>
      )}
    </div>
  );
};

export const Logo: React.FC<{
  showTagline?: boolean;
  markClassName?: string;
  size?: "sm" | "md" | "lg";
}> = ({ showTagline = true, markClassName, size = "md" }) => (
  <span className="flex items-center gap-3 group">
    <LogoMark className={markClassName} />
    <Wordmark showTagline={showTagline} size={size} />
  </span>
);
