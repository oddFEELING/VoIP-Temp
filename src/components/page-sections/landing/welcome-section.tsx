"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import WelcomeImage from "@/assets/images/welcome-img.jpg";
import Image from "next/image";

const WelcomeSection = () => {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-24 md:py-40">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        {/* ~ ======= Left Column - Image placeholder ======= ~ */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted ring-2 ring-secondary ring-offset-2 dark:ring-offset-0">
            <Image
              src={WelcomeImage}
              alt="Welcome"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* ~ ======= Right Column - Content ======= ~ */}
        <div className="flex flex-col space-y-4">
          {/* ~ ======= Label ======= ~ */}
          <motion.p
            className="text-xs font-medium uppercase tracking-wide text-secondary dark:text-accent"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore
          </motion.p>

          {/* ~ ======= Main Heading ======= ~ */}
          <motion.h2
            className="leading-wider text-4xl font-bold tracking-normal text-primary dark:text-secondary"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Discover Our Comprehensive VoIP Solutions Today
          </motion.h2>

          {/* ~ ======= Description ======= ~ */}
          <motion.p
            className="text-base text-foreground/90"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Clear, reliable communication is the backbone of any successful
            business, whether you’re a solo entrepreneur handling client calls,
            a growing team needing efficient internal collaboration or a large
            enterprise managing high volume customer support, seamless
            connectivity is crucial.
          </motion.p>

          {/* ~ ======= Two Column Features ======= ~ */}
          <motion.div
            className="grid gap-8 pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Reliable & Secure</h3>
              <p className="text-sm text-muted-foreground">
                At LinkOrgVoIP, we understand the challenges businesses face and
                that&apos;s why we are committed to eliminate these frustrations
                with our enterprise-grade VOIP solutions designed to provide a
                cost-effective, high quality and scalable communication system.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Seamless Integration</h3>
              <p className="text-sm text-muted-foreground/70">
                Effortlessly integrate our VoIP solutions with your existing
                systems and workflows. Our flexible platform adapts to your
                needs, making the transition smooth and hassle-free.
              </p>
            </div>
          </motion.div>

          {/* ~ ======= CTA Buttons ======= ~ */}
          <motion.div
            className="flex items-center gap-8 pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              variant="outline"
              className="border-muted-foreground/30 shadow-sm"
            >
              Learn More
            </Button>
            <Button
              variant="link"
              className="group h-10 px-0 font-normal text-foreground/80 hover:text-foreground hover:no-underline"
            >
              Contact{" "}
              <ArrowRight className="ml-0.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
