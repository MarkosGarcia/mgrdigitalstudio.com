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

// The full icon + "MGR Digital Studio" lockup as one image, cropped from the
// same supplied artwork just above where its own tagline line starts (that
// tagline is its own line at header scale, not a second thing to render next
// to it — see the capabilities list on the Services page instead). Replaces
// the earlier icon-image + live-CSS-wordmark pairing.
export const Logo: React.FC<{ className?: string }> = ({
  className = "h-9 w-auto",
}) => (
  <span className={`inline-block ${className}`}>
    <Image
      src="/logo-lockup.png"
      alt="MGR Digital Studio"
      width={700}
      height={307}
      priority
      className="w-full h-full object-contain"
    />
  </span>
);
