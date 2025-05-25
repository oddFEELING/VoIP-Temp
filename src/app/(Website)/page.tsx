"use client";

import useUser from "@/hooks/use-user";
import { HeroSection } from "@/components/page-sections/landing/hero-section";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { BackgroundGradients } from "@/components/ui/background-gradients";
import WelcomeSection from "@/components/page-sections/landing/welcome-section";
import FeaturesSection from "@/components/page-sections/landing/features-section";
import PlatformFeaturesSection from "@/components/page-sections/landing/platform-features-section";
import TrustSection from "@/components/page-sections/landing/trust-section";
import PackagesCTA from "@/components/page-sections/landing/packages-cta";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <BackgroundGradients />
      <HeroSection />
      <PackagesCTA />
      {/*<HeroParallax products={products} />*/}
      <WelcomeSection />
      <FeaturesSection />
      <TrustSection />
      <PlatformFeaturesSection />
    </div>
  );
}

const products = [
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/moonbeam.png",
    description: "AI-powered writing assistant for developers",
    price: "$19.99/mo",
  },
  {
    title: "Cursor",
    link: "https://cursor.so",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cursor.png",
    description: "Next-generation code editor with AI capabilities",
    price: "$29.99/mo",
  },
  {
    title: "Rogue",
    link: "https://userogue.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/rogue.png",
    description: "Advanced user authentication platform",
    price: "$39.99/mo",
  },
  {
    title: "Editorially",
    link: "https://editorially.org",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/editorially.png",
    description: "Collaborative writing and editing platform",
    price: "$24.99/mo",
  },
  {
    title: "Editrix AI",
    link: "https://editrix.ai",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/editrix.png",
    description: "AI-powered content editing and enhancement",
    price: "$34.99/mo",
  },
  {
    title: "Pixel Perfect",
    link: "https://app.pixelperfect.quest",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/pixelperfect.png",
    description: "Advanced image optimization toolkit",
    price: "$15.99/mo",
  },
  {
    title: "Algochurn",
    link: "https://algochurn.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/algochurn.png",
    description: "Algorithm practice and interview prep platform",
    price: "$19.99/mo",
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/aceternityui.png",
    description: "Modern UI component library for web applications",
    price: "$49.99/mo",
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/tailwindmasterkit.png",
    description: "Complete Tailwind CSS development toolkit",
    price: "$39.99/mo",
  },
  {
    title: "SmartBridge",
    link: "https://smartbridgetech.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/smartbridge.png",
    description: "Intelligent API integration platform",
    price: "$59.99/mo",
  },
  {
    title: "Renderwork Studio",
    link: "https://renderwork.studio",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/renderwork.png",
    description: "Professional 3D rendering and visualization",
    price: "$79.99/mo",
  },
  {
    title: "Creme Digital",
    link: "https://cremedigital.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cremedigital.png",
    description: "Digital marketing and branding solutions",
    price: "$44.99/mo",
  },
  {
    title: "Golden Bells Academy",
    link: "https://goldenbellsacademy.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/goldenbellsacademy.png",
    description: "Online learning platform for music education",
    price: "$29.99/mo",
  },
  {
    title: "Invoker Labs",
    link: "https://invoker.lol",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/invoker.png",
    description: "Game development and optimization tools",
    price: "$69.99/mo",
  },
  {
    title: "E Free Invoice",
    link: "https://efreeinvoice.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/efreeinvoice.png",
    description: "Free invoice generation and management system",
    price: "$0/mo",
  },
];
