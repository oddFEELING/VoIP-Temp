"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ~ =================================== ~ */
/* -- Component for the packages CTA section -- */
/* ~ =================================== ~ */
const PackagesCTA = () => {
  return (
    <div className="bg-background">
      <div className="px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* ~ ======= Label ======= ~ */}
          <motion.p
            className="text-xs font-semibold uppercase tracking-wide text-secondary dark:text-accent"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We offer
          </motion.p>
          {/* ~ ======= Title ======= ~ */}
          <motion.h2
            className="leading-wider mt-2 border-none text-4xl font-bold tracking-tight text-primary dark:text-secondary sm:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            The Perfect Package <br /> for Your Business.
          </motion.h2>

          {/* ~ ======= Description ======= ~ */}
          <motion.p
            className="mx-auto mt-4 max-w-xl text-base text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            From small businesses to enterprise solutions, we offer flexible
            VoIP packages tailored to your communication needs. Start exploring
            our packages today.
          </motion.p>

          {/* ~ ======= CTA Buttons ======= ~ */}
          <motion.div
            className="mt-8 flex items-center justify-center gap-x-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button>View Packages</Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PackagesCTA;
