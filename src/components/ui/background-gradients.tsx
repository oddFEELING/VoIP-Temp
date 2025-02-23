// Component for rendering background gradient effects
// Uses absolute positioning to create a full-page gradient background

"use client";

import { cn } from "@/lib/utils";

export const BackgroundGradients = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      {/* Bottom right gradient - neutral gray */}
      <div
        className="absolute bottom-[-20%] right-[-20%] h-[1000px] w-[1000px] rounded-[50%] bg-zinc-700/[0.02] blur-[160px] dark:bg-zinc-300/[0.02]"
        aria-hidden="true"
      />

      {/* Top left gradient - slightly darker neutral */}
      <div
        className="absolute left-[-20%] top-[-20%] h-[1000px] w-[1000px] rounded-[50%] bg-zinc-800/[0.02] blur-[160px] dark:bg-zinc-200/[0.02]"
        aria-hidden="true"
      />

      {/* Center gradient - lightest neutral */}
      <div
        className="absolute left-[50%] top-[50%] h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-zinc-600/[0.015] blur-[180px] dark:bg-zinc-400/[0.015]"
        aria-hidden="true"
      />
    </div>
  );
};
