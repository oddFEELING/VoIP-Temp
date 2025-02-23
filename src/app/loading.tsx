"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Global loading component for the application
 * Displays a centered loading spinner with a pulsing animation
 */
export default function Loading() {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center space-y-6"
      >
        {/* Loading spinner with rotation animation */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={40} className="text-primary dark:text-secondary" />
          </motion.div>
        </div>

        {/* Loading text with pulsing dots */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <h3 className="text-lg font-medium text-foreground">Loading</h3>
          <div className="flex items-center space-x-1">
            {[0, 0.3, 0.5].map((delay, i) => (
              <span key={i} className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75 duration-1000"
                  style={{ animationDelay: `${delay}s` }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary/30" />
              </span>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            LinkOrg is loading your content
          </p>
        </div>
      </motion.div>
    </div>
  );
}
