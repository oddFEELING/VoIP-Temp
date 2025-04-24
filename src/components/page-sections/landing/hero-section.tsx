// Hero section component with parallax scroll effect
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useRouter } from "next/navigation";
import HeroImg1 from "@/images/hero-img-1.jpg";
import HeroImg2 from "@/images/hero-img-2.jpg";
import HeroImg3 from "@/images/hero-img-3.jpg";
import HeroImg4 from "@/images/hero-img-4.jpg";

import Image from "next/image";
// Array of placeholder colors for the grid
const placeholderColors = [
  "bg-zinc-200",
  "bg-zinc-300",
  "bg-zinc-400",
  "bg-zinc-200",
  "bg-zinc-300",
  "bg-zinc-400",
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const topLeftVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 70,
      damping: 20,
      mass: 1,
      duration: 0.8,
    },
  },
};

const bottomLeftVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.4,
      type: "spring",
      stiffness: 70,
      damping: 20,
      mass: 1,
      duration: 0.8,
    },
  },
};

const topRightVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.6,
      type: "spring",
      stiffness: 70,
      damping: 20,
      mass: 1,
      duration: 0.8,
    },
  },
};

const bottomRightVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.8,
      type: "spring",
      stiffness: 70,
      damping: 20,
      mass: 1,
      duration: 0.8,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, x: -5 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      duration: 0.4,
      stiffness: 150,
      damping: 20,
    },
  },
};

export const HeroSection = () => {
  const { theme } = useTheme();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const router = useRouter();
  return (
    <section className="relative w-full px-4 py-14 pt-24 md:py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 md:grid-cols-2">
        {/* ~ =================================== ~ */}
        {/* -- Content section */}
        {/* ~ =================================== ~ */}
        <motion.div
          className="-mt-6 flex w-full flex-col gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* ~ ======= Title and subtitle ======= ~ */}
          <div className="space-y-4">
            <motion.span
              variants={contentVariants}
              className="-mt-5 inline-block text-sm font-semibold uppercase tracking-wider text-secondary dark:text-accent"
            >
              LinkOrg VoIP
            </motion.span>
            <h1 className="leading-wide text-3xl font-bold tracking-normal text-primary dark:text-secondary sm:text-5xl">
              Empower your business with reliable and innovative VoIP solutions
            </h1>
            <p className="max-w-lg text-muted-foreground">
              LinkorgVoip provides advanced &apos;Voice over Internet
              Protocol&apos;(VoIP) services to help you make and receive calls
              even in the most remote locations. <br />
              Stay connected, boost collaboration, and save costs - all with
              unmatched reliability and support.
            </p>
          </div>

          {/* ~ ======= Search and action section ======= ~ */}
          <motion.div variants={contentVariants} className="space-y-6">
            {/* ~ ======= Search bar ======= ~ */}
            <div className="relative flex w-full max-w-lg items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for VoIP products..."
                className="h-12 pl-9 ring-1 transition-shadow duration-200 focus:shadow-md focus-visible:ring-accent"
                value={localSearchQuery}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push(`/store?search=${localSearchQuery}`);
                  }
                }}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
              />
              <Button
                disabled={!localSearchQuery}
                size="xs-icon"
                className="absolute right-2"
                onClick={() => {
                  router.push(`/store?search=${localSearchQuery}`);
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* ~ ======= Separator ======= ~ */}
            <div className="flex w-full max-w-lg items-center gap-4">
              <Separator className="shrink" />
              <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
                OR
              </span>
              <Separator className="shrink" />
            </div>

            {/* ~ ======= Action buttons ======= ~ */}
            <div className="flex w-full max-w-lg gap-4">
              <Button
                size="lg"
                className="min-w-[120px] shadow-sm transition-all duration-200 hover:shadow-md"
                onClick={() => {
                  router.push("/store?imageFilter=with-image");
                }}
              >
                Explore products
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/about")}
                className="min-w-[120px] transition-all duration-200 hover:shadow-sm"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* ~ =================================== ~ */}
        {/* -- Images section */}
        {/* ~ =================================== ~ */}
        <div className="relative mt-3 hidden w-full md:block">
          <motion.div
            className="flex gap-5 px-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* ~ ======= Left column ======= ~ */}
            <div className="flex w-1/2 flex-col space-y-5">
              <motion.div
                variants={topLeftVariants}
                className={cn(
                  "group relative h-[250px] w-full overflow-hidden rounded-lg border border-border shadow-xl ring-2 ring-secondary ring-offset-2 dark:ring-accent dark:ring-offset-0",
                  placeholderColors[0],
                )}
              >
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/10 to-secondary/10" />
                <Image
                  src={HeroImg1}
                  fill
                  priority
                  alt="Hero Image 1"
                  className="object-cover object-top"
                />
              </motion.div>
              <motion.div
                variants={bottomLeftVariants}
                className={cn(
                  "group relative h-[300px] w-full overflow-hidden rounded-lg border border-border shadow-lg ring-4 ring-primary ring-offset-2 dark:ring-primary dark:ring-offset-1",
                  placeholderColors[1],
                )}
              >
                <div className="absolute inset-0 z-10 bg-gradient-to-tr from-primary/10 to-secondary/10" />
                <Image
                  src={HeroImg2}
                  fill
                  priority
                  alt="Hero Image 2"
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* ~ ======= right column ======= ~ */}
            <div className="mt-16 flex w-1/2 flex-col space-y-5">
              <motion.div
                variants={topRightVariants}
                className={cn(
                  "group relative h-[350px] w-full overflow-hidden rounded-lg border border-border shadow-lg ring-4 ring-primary ring-offset-2 dark:ring-primary dark:ring-offset-1",
                  placeholderColors[3],
                )}
              >
                <div className="absolute inset-0 z-10 bg-gradient-to-bl from-primary/10 to-secondary/10" />
                <Image
                  src={HeroImg4}
                  fill
                  priority
                  alt="Hero Image 4"
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                variants={bottomRightVariants}
                className={cn(
                  "group relative h-[250px] w-full overflow-hidden rounded-lg border border-border shadow-2xl ring-4 ring-secondary ring-offset-2 dark:ring-accent dark:ring-offset-0",
                  placeholderColors[4],
                )}
              >
                <div className="absolute inset-0 z-10 bg-gradient-to-tl from-primary/10 to-secondary/10" />
                <Image
                  src={HeroImg3}
                  fill
                  priority
                  alt="Hero Image 1"
                  className="object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
