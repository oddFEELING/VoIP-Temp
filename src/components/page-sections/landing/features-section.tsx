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
    title: "Yealink: Where Innovation meets Affordability ",
    description:
      "Get Yealink’s cutting-edge VoIP technology designed to enhance communications and scale your business without stretching your budget. ",
    icon: Box,
  },
  {
    title: "Cisco: Trusted performance for businesses.",
    description:
      "Experience the confidence of a trusted global leader in business communication. Cisco’s industry leading VoIP solutions are built for reliability, security and seamless communication. ",
    icon: Box,
  },
  {
    title: "Fanvil: Versatile Solutions for Every Need",
    description:
      "No matter your industry or business size, Fanvil delivers feature rich, reliable and cost-effective VoIP solutions tailored to your needs.",
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
    <section className="relative px-6 lg:px-8">
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

      <div className="container mx-auto max-w-7xl py-24 lg:pb-32">
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
              <h2 className="border-b-0 text-4xl font-bold text-primary dark:text-secondary sm:text-5xl">
                Discover Top&nbsp; Hardware Providers
                <br />
                &nbsp;
              </h2>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p className="text-muted-foreground">
                Our carefully selected hardware from industry leading providers
                ensures seamless connectivity, crystal clear communication and
                long-term reliability. Whether you&apos;re scaling your
                operations or optimizing your current setup, we provide the
                tools to keep your team connected and your business running
                smoothly.
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
