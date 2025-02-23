"use client";
import React from "react";
import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
    description?: string;
    price?: string;
  }[];
}) => {
  // Sample products data for demonstration
  const demoProducts = [
    {
      title: "VoIP Business Suite",
      link: "/store?imageFilter=with-image",
      thumbnail: "/products/voip-1.jpg",
      description:
        "Enterprise-grade communication solution with advanced features",
      price: "$49.99/mo",
    },
    {
      title: "Cloud PBX Pro",
      link: "/store?imageFilter=with-image",
      thumbnail: "/products/voip-2.jpg",
      description: "Professional cloud telephony system for growing businesses",
      price: "$39.99/mo",
    },
    {
      title: "Mobile VoIP Connect",
      link: "/store?imageFilter=with-image",
      thumbnail: "/products/voip-3.jpg",
      description: "Seamless mobile integration for remote teams",
      price: "$29.99/mo",
    },
    {
      title: "Virtual Phone System",
      link: "/store?imageFilter=with-image",
      thumbnail: "/products/voip-4.jpg",
      description: "Complete virtual phone solution for modern workplaces",
      price: "$34.99/mo",
    },
    {
      title: "Enterprise Communications",
      link: "/store?imageFilter=with-image",
      thumbnail: "/products/voip-5.jpg",
      description: "Scalable enterprise communication platform",
      price: "$79.99/mo",
    },
  ];

  const isMobile = useIsMobile();

  // Use demo products if no products are provided
  const actualProducts = products.length > 0 ? products : demoProducts;
  const firstRow = actualProducts.slice(0, 5);
  const secondRow = actualProducts.slice(5, 10);
  const thirdRow = actualProducts.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 250, damping: 35, bounce: 0 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 800]),
    springConfig,
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -800]),
    springConfig,
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [10, 0]),
    springConfig,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.3, 1]),
    springConfig,
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig,
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-500, isMobile ? 100 : 150]),
    springConfig,
  );

  return (
    <div
      ref={ref}
      className="relative flex h-[140vh] max-h-[1700px] flex-col self-auto overflow-hidden pt-44 antialiased [perspective:1000px] [transform-style:preserve-3d] sm:h-[190vh] sm:py-20 2xl:h-[210vh]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="mt-20"
      >
        <motion.div className="mb-16 flex flex-row-reverse gap-8">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="mb-16 flex flex-row gap-8">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="hidden flex-row-reverse gap-8 sm:flex">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="relative left-0 top-0 mx-auto w-full max-w-7xl px-4 py-10 md:py-20">
      <h1 className="text-2xl font-bold dark:text-white md:text-7xl">
        The Ultimate <br />{" "}
        <span className="text-primary dark:text-secondary">VoIP</span> Products
      </h1>
      <p className="mt-8 max-w-2xl text-base dark:text-neutral-200 md:text-xl">
        We provide beautiful products with the latest technologies that help you
        grow your business. Unlock the potential of seamless communication with
        our VoIP services.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
    description?: string;
    price?: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -10,
      }}
      key={product.title}
      className="group/product relative h-64 w-[400px] flex-shrink-0 overflow-hidden rounded-lg ring-secondary hover:shadow-lg hover:ring-2"
    >
      <Link
        href={product.link}
        className="block overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover/product:shadow-xl"
      >
        <Image
          src={product.thumbnail}
          height="400"
          width="600"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300"
          alt={product.title}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/95 opacity-0 transition-all duration-300 group-hover/product:opacity-100 group-hover/product:backdrop-blur-[4px]" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex flex-col gap-2">
            <h2 className="w-max origin-left transform pr-4 text-xl font-semibold text-white/70 transition-all duration-300 group-hover/product:text-white">
              {product.title}
            </h2>
            {product.price && (
              <span className="mt-4 text-2xl font-bold text-white/90 opacity-0 transition-all duration-300 group-hover/product:opacity-100">
                {product.price.replace("$", "£")}
              </span>
            )}
            {product.description && (
              <p className="mt-1 line-clamp-2 text-sm text-white/90 opacity-0 transition-all duration-300 group-hover/product:opacity-100">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
