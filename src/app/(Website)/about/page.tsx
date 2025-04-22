"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/magicui/grid-pattern";
import {
  ArrowRight,
  Box,
  Shield,
  Zap,
  Users,
  ThumbsUp,
  SmilePlus,
  BookOpen,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AboutImg1 from "@/assets/images/about-img-1.jpg";
import AboutImg2 from "@/assets/images/about-img-2.jpg";

// ~ ======= Animation variants ======= ~
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

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.6,
      stiffness: 100,
      damping: 15,
    },
  },
};

// ~ =============================================>
// ~ ======= About Page Component ======= ~
// ~ =============================================>
const AboutPage = () => {
  const router = useRouter();

  // ~ ======= Core values data ======= ~
  const coreValues = [
    {
      icon: Shield,
      title: "Reliability First",
      description:
        "We prioritize delivering dependable VoIP services that you can count on 24/7, ensuring uninterrupted communication for your business.",
    },
    {
      icon: Zap,
      title: "Innovation Driven",
      description:
        "Constantly evolving and implementing cutting-edge VoIP technologies to provide you with the most advanced communication solutions.",
    },
    {
      icon: Users,
      title: "Customer Focused",
      description:
        "Your success is our priority. We provide personalized support and tailored solutions to meet your unique communication needs.",
    },
  ];

  // ~ ======= FAQ data ======= ~
  const faqs = [
    {
      question: "What is VoIP?",
      answer:
        "Voice over Internet Protocol is a convenient, affordable means for businesses and individuals to use the internet to conduct telephone calls, and represents a more cost-effective alternative to traditional PSTN.",
    },
    {
      question: "What is PBXware?",
      answer:
        "Incorporating a range of traditional telephony and modern VoIP technologies, PBXware is a scalable solution that enables enhanced management of business telecommunications. From routing and voicemail, to auto attendants and conferencing, PBXware can offer advanced features in a single package, saving you money on multiple systems.",
    },
    {
      question: "How do I set up VoIP?",
      answer:
        "You need Broadband internet connection. The more call volume you have the higher the bandwidth you will need. We have low call volume and are using a 7Mbps/700Kbps connection, this has been plenty of bandwidth for us. Wired Ethernet router. You have a ton of options here but your budget will likely decide this one.",
    },
    {
      question: "How secure is VoIP?",
      answer:
        "Security for VoIP uses industry standard encryption technology such as SSL and VPN.",
    },
    {
      question: "Can I use VoIP with a regular(analogue) telephone?",
      answer:
        "To connect VoIP phones to traditional telephony networks, you need to install an Analog Telephone Adapter (ATA) which converts the analog signal into digital data.",
    },
    {
      question: "Does VoIP work on dial-up?",
      answer:
        "A dial-up connection can support VoIP, but it is recommended to use broadband since certain codecs require higher bandwidths for quality purposes.",
    },
    {
      question:
        "What are the benefits of using LinkOrg Networks' VoIP solutions over traditional phone lines?",
      answer:
        "Our VoIP solutions offer greater flexibility, lower costs, and advanced features like call forwarding, video conferencing, and multi-device integration. It's an efficient alternative to traditional phone systems.",
    },
    {
      question:
        "Can your VoIP services be integrated with our existing IT infrastructure?",
      answer:
        "Yes, our VoIP solutions are designed to seamlessly integrate with your existing IT and network infrastructure, minimizing disruptions during deployment.",
    },
    {
      question: "How scalable are your VoIP systems for growing businesses?",
      answer:
        "Our VoIP systems are highly scalable, allowing you to easily add new users, extensions, and features as your business expands.",
    },
    {
      question: "Do you offer call encryption for secure voice communication?",
      answer:
        "Yes, all VoIP communications are encrypted end-to-end to ensure your voice communications remain private and secure from unauthorized access.",
    },
    {
      question:
        "Are your VoIP solutions suitable for remote workers or teams across multiple locations?",
      answer:
        "Yes, our VoIP solutions are perfect for remote teams and businesses with multiple locations. We provide seamless communication across all locations, no matter where your team is.",
    },
    {
      question: "What is DID?",
      answer:
        "A Direct Inward Dialing (DID) is a telephone number that is used to make and receive calls directly through a VoIP system. It allows businesses to have a single number that can be used to receive calls from anywhere, regardless of the location of the caller.",
    },
    {
      question: "What are SIP phones?",
      answer:
        "SIP phones are devices that allow you to make and receive VoIP calls using a traditional phone system. They are designed to work with VoIP systems and can be used to make and receive calls from anywhere with an internet connection.",
    },
    {
      question: "What is Business SIP Trunking?",
      answer:
        "Business SIP trunking is a service that enables your company to operate a selection of telecommunications systems over your IP network, and offers a number of benefits. From cheaper international call costs to improved business flexibility, a Disaster Recovery strategy to give access to an increased quantity of numbers, business SIP trunking from LinkOrg can enhance the way your business stays connected.",
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-background px-4 md:px-8">
      {/* ~ ======= Background Pattern ======= ~ */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <GridPattern
          width={80}
          height={80}
          x={-1}
          y={-1}
          strokeDasharray="4 4"
          className="absolute inset-0 h-full w-full fill-neutral-50 stroke-neutral-900/[0.1] [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)] dark:stroke-neutral-100/[0.1]"
        />
      </div>

      {/* ~ =================================== ~ */}
      {/* -- Hero Section -- */}
      {/* ~ =================================== ~ */}
      <motion.header
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="container mx-auto flex h-max w-full max-w-7xl flex-col items-center justify-center gap-16 py-32"
      >
        {/* ~ ======= Header Content ======= ~ */}
        <motion.div variants={contentVariants} className="text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-secondary dark:text-accent">
            About Us
          </span>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Empowering{" "}
            <span className="text-primary dark:text-secondary">VoIP</span>{" "}
            Solutions
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            LinkOrg specializes in cutting-edge VoIP technology, delivering
            reliable communication solutions for businesses and individuals.
          </p>
        </motion.div>

        {/* ~ ======= CTA Buttons ======= ~ */}
        <motion.div variants={contentVariants} className="flex gap-4">
          <Button
            size="lg"
            className="min-w-[120px] shadow-sm transition-all duration-200 hover:shadow-md"
            onClick={() => router.push("/contact")}
          >
            Contact Us
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/store")}
            className="group min-w-[120px] transition-all duration-200 hover:shadow-sm"
          >
            Our Products
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </motion.header>

      {/* ~ =================================== ~ */}
      {/* -- Commitment Section -- */}
      {/* ~ =================================== ~ */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto w-full max-w-7xl py-24"
      >
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* ~ ======= Left Column - Content ======= ~ */}
          <motion.div
            variants={contentVariants}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-2">
              {/* ~ ======= Label --> */}
              <p className="text-xs font-medium uppercase tracking-wide text-secondary dark:text-accent">
                Our most important
              </p>
              {/* ~ ======= Title --> */}
              <h2 className="text-3xl font-bold">
                Commitment to{" "}
                <span className="text-primary dark:text-secondary">
                  Your Excellence
                </span>
              </h2>
            </div>
            <p className="text-lg text-muted-foreground">
              At LinkOrgVoIP, we are dedicated to providing innovative VoIP
              communication solutions for small businesses, corporate clients
              and offshore industries. Based in the UK, our expert team combines
              years of experience with advanced technology to deliver reliable
              and cost-effective voice communication services. Utilising
              cutting-edge LEO and GEO satellite technologies, as well as robust
              IP-PBX systems, we ensure that our clients—ranging from solo
              entrepreneurs to offshore vessels—enjoy seamless connectivity,
              even in remote locations.
            </p>

            <p className="text-base/7 text-muted-foreground">
              With almost a decade of providing VoIP services, our commitment to
              excellence is reflected in our comprehensive support and bespoke
              solutions, ensuring your business remains connected and
              productive. Discover the difference with LinkOrgVoIP—where
              reliable communication meets unparalleled expertise.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
              <Button variant="ghost" size="lg" className="group">
                Contact
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>

          {/* ~ ======= Right Column - Image Card ======= ~ */}
          <motion.div variants={contentVariants}>
            <div className="relative flex h-[500px] flex-col gap-4 md:flex-row">
              {/* ~ ======= First Image - VoIP Phone ======= ~ */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 100,
                  duration: 0.6,
                  delay: 0.1,
                }}
                className="hidden w-full md:block md:w-1/2 md:self-start"
              >
                <Card className="relative aspect-[4/5] w-full overflow-hidden border-none bg-muted/30 shadow-lg ring-2 ring-accent">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                  <Image src={AboutImg1} alt="" fill className="object-cover" />
                </Card>
              </motion.div>

              {/* ~ ======= Second Image - Support Team ======= ~ */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 100,
                  duration: 0.6,
                  delay: 0.3,
                }}
                className="w-full md:mt-12 md:w-1/2 md:self-end"
              >
                <Card className="relative aspect-[4/5] w-full overflow-hidden border-none bg-muted/30 shadow-lg ring-2 ring-secondary">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                  <Image src={AboutImg2} alt="" fill className="object-cover" />
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ~ =================================== ~ */}
      {/* -- Core Values Section -- */}
      {/* ~ =================================== ~ */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto w-full max-w-7xl py-24"
      >
        {/* ~ ======= Section Header ======= ~ */}
        <motion.div variants={contentVariants} className="mb-16 text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-secondary dark:text-accent">
            Tagline
          </span>
          <h2 className="border-b-0 text-3xl font-bold sm:text-4xl">
            Our{" "}
            <span className="text-primary dark:text-secondary">
              Core Values
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            At LinkOrg, our values shape everything we do. They guide our
            decisions and define our commitment to excellence in VoIP solutions.
          </p>
        </motion.div>

        {/* ~ ======= Values Grid ======= ~ */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* ~ ======= Featured Card ======= ~ */}
          <motion.div variants={contentVariants}>
            <Card className="flex h-full flex-col gap-6 p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary dark:bg-secondary/10 dark:text-secondary">
                  <ThumbsUp className="h-6 w-6" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-2xl font-bold">Customer Satisfaction</h3>
              <p className="text-muted-foreground">
                At LinkorgVoIP, your trust is our priority. We uphold the
                highest standards of integrity, transparency and reliability,
                ensuring every interaction is built on honesty and respect. Our
                commitment to excellence fosters strong, long-term relationships
                with our clients, partners and employees – delivering not just
                exceptional VoIP solutions, but a service experience you can
                rely on.
              </p>
              <div className="mt-auto flex gap-4">
                <Button variant="outline">Shop</Button>
                <Button variant="ghost" className="group">
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* ~ ======= Secondary Cards ======= ~ */}
          {[
            {
              icon: SmilePlus,
              title: "Integrity & Honesty",
              content:
                "We uphold the highest standards of integrity in every interaction, ensuring that our clients and partners can depend on us for honest communication, fair solutions and long-term success.",
            },
            {
              icon: Sparkles,
              title: "Continuous Learning and Development",
              content:
                "We continuously invest in learning and skill development, ensuring our team stays ahead of industry advancements. By staying at the forefront of technology, we deliver cutting edge VoIP solutions that keep your business connected, efficient and positioned for growth.",
            },
          ].map((item, index) => (
            <motion.div key={index} variants={contentVariants}>
              <Card className="flex h-full flex-col gap-6 p-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary dark:bg-secondary/10 dark:text-secondary">
                    <item.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground">{item.content}</p>
                <Button
                  variant="ghost"
                  className="group mt-auto justify-start hover:bg-transparent"
                >
                  {index === 0 ? "Learn More" : "Button"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ~ =================================== ~ */}
      {/* -- FAQ Section -- */}
      {/* ~ =================================== ~ */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto w-full max-w-7xl py-24"
      >
        {/* ~ ======= FAQ Header ======= ~ */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">FAQs</h2>
          <p className="mt-2 text-muted-foreground">
            Find answers to common questions about our VoIP services and how we
            can help you.
          </p>
        </div>

        {/* ~ ======= FAQ List ======= ~ */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={`border-t ${index === faqs.length - 1 ? "border-b" : ""}`}
            >
              <AccordionTrigger className="py-6 text-base font-normal hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* ~ ======= Still have questions? ======= ~ */}
        <div className="mt-12">
          <h3 className="mb-2 text-lg font-semibold">Still have questions?</h3>
          <p className="mb-4 text-muted-foreground">We're here to help you!</p>
          <Button variant="outline" onClick={() => router.push("/contact")}>
            Contact
          </Button>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
