"use client";

import { Box, PackageCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { GridPattern } from "@/components/magicui/grid-pattern";

/* ~ =================================== ~ */
/* -- Features data with hardware brands -- */
/* ~ =================================== ~ */
const features = [
  {
    title: "Yealink: Innovation Meets Affordability",
    description:
      "Yealink offers cutting-edge VoIP solutions that are budget-friendly.",
    icon: Box,
  },
  {
    title: "Cisco: Trusted Performance for Businesses",
    description:
      "Cisco provides robust VoIP systems for enterprise-level communication.",
    icon: Box,
  },
  {
    title: "Fanvil: Versatile Solutions for Every Need",
    description:
      "Fanvil delivers flexible VoIP hardware suitable for various environments.",
    icon: Box,
  },
];

/* ~ =================================== ~ */
/* -- Animation variants -- */
/* ~ =================================== ~ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

/* ~ =================================== ~ */
/* -- Features section component -- */
/* ~ =================================== ~ */
export default function FeaturesSection() {
  return (
    <section className="relative">
      {/* ~ ======= Background Pattern ======= ~ */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <GridPattern
          width={80}
          height={80}
          x={-1}
          y={-1}
          strokeDasharray="4 4"
          className="absolute inset-0 h-full w-full fill-neutral-50 stroke-neutral-900/[0.1] [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent),linear-gradient(45deg,transparent_30%,white_70%)] dark:stroke-neutral-100/[0.1]"
        />
      </div>

      <div className="container mx-auto max-w-7xl py-24">
        {/* ~ ======= Section label and headers ======= ~ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-16 space-y-4"
        >
          <motion.p
            variants={itemVariants}
            className="text-xs font-medium uppercase tracking-wide text-secondary dark:text-accent"
          >
            Discover
          </motion.p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div variants={itemVariants}>
              <h2 className="border-b-0 text-4xl font-bold text-foreground">
                Discover Top&nbsp;
                <span className="text-primary dark:text-secondary">
                  VoIP Hardware Brands
                </span>
                &nbsp;
              </h2>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p className="text-muted-foreground">
                Our VoIP hardware selection features industry-leading brands
                known for their reliability and performance. Each product is
                designed to enhance your communication experience, ensuring
                seamless connectivity. Explore our range to find the perfect
                solution for your needs.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ~ ======= Features grid ======= ~ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-12 md:grid-cols-3"
        >
          {features.map((feature, index) => {
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col"
              >
                <div className="mb-8">
                  <PackageCheck
                    size={25}
                    strokeWidth={1.2}
                    className="text-muted-foregorund/60"
                  />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-primary dark:text-accent">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ~ ======= Call to action buttons ======= ~ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-12 flex items-center gap-4"
        >
          <motion.div variants={itemVariants}>
            <Button
              variant="outline"
              className="border-muted-foreground/30 px-8 shadow-sm"
            >
              Shop
            </Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              variant="link"
              className="group h-10 px-0 font-normal text-foreground/80 hover:text-foreground hover:no-underline"
            >
              Learn More
              <ArrowRight className="ml-0.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
