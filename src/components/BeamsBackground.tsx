import React from "react";

/**
 * Hero atmosphere: a slightly stronger prism cluster than the rest of the
 * page gets, plus an overhead key light so the top of the page reads as lit
 * rather than uniformly flat.
 *
 * The dark theme ended this with a fade down to the page ground, because the
 * section clipped its own overflow and the colour fields stopped on a hard
 * line. Nothing to hide now — the washes are faint enough over paper that
 * their edges were never the visible thing.
 */
export const BeamsBackground: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <div className="wash -top-52 left-[6%] w-[44rem] h-[34rem] bg-[#38BDF8] opacity-[0.11]" />
    <div className="wash -top-28 right-[2%] w-[38rem] h-[32rem] bg-[#A78BFA] opacity-[0.1]" />
    <div className="wash -bottom-56 left-[28%] w-[36rem] h-[30rem] bg-[#D4A937] opacity-[0.09]" />
    <div className="key-light" />
  </div>
);
