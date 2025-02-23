"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

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

// ~ ======= Content Variants ======= ~
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

// ~ ======= Slide Variants ======= ~
const slideVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.7,
      stiffness: 100,
      damping: 15,
    },
  },
};

{
  /* ~ ======= Brand data for carousel slides ======= ~ */
}
const brandSlides = [
  {
    id: 1,
    name: "Cisco",
    description: "Enterprise-grade VoIP solutions and networking equipment",
    logoPlaceholder: "C",
    featuredProduct: {
      name: "Cisco IP Phone 8800 Series",
      image: "/placeholder-product.png", // You'll need to add actual product images
    },
  },
  {
    id: 2,
    name: "Yealink",
    description: "Professional IP phones and video conferencing systems",
    logoPlaceholder: "Y",
    featuredProduct: {
      name: "Yealink T5 Series",
      image: "/placeholder-product.png",
    },
  },
  {
    id: 3,
    name: "Fanvil",
    description: "Innovative IP communication and collaboration devices",
    logoPlaceholder: "F",
    featuredProduct: {
      name: "Fanvil X7 Series",
      image: "/placeholder-product.png",
    },
  },
  {
    id: 4,
    name: "Grandstream",
    description: "Unified communication and IP business solutions",
    logoPlaceholder: "G",
    featuredProduct: {
      name: "Grandstream GXP Series",
      image: "/placeholder-product.png",
    },
  },
];

{
  /* ~ ======= Logo placeholder component ======= ~ */
}
const LogoPlaceholder = ({ letter }: { letter: string }) => (
  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-secondary/10">
    <span className="text-2xl font-bold text-primary dark:text-secondary">
      {letter}
    </span>
  </div>
);

// ~ =============================================>
// ~ ======= Main Store Page Hero Component ======= ~
// ~ =============================================>
const StorePageHero = () => {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <motion.header
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative mb-20 mt-10 w-full bg-background/80 px-4 py-12 backdrop-blur-sm md:px-12 lg:px-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div variants={contentVariants} className="mb-8 space-y-2">
          <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Our Brands
          </span>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Featured{" "}
            <span className="text-primary dark:text-secondary">VoIP</span>{" "}
            Manufacturers
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            Discover our curated selection of industry-leading VoIP
            manufacturers, each chosen for their excellence in innovation and
            reliability.
          </p>
        </motion.div>

        {/* ~ ======= Carousel Container ======= ~ */}
        <motion.div variants={contentVariants} className="relative w-full">
          <Carousel className="w-full" setApi={setApi}>
            <div className="relative">
              <CarouselContent>
                {brandSlides.map((brand) => (
                  <CarouselItem key={brand.id}>
                    <motion.div variants={slideVariants} className="w-full p-2">
                      <Link href={`/store?brand=${brand.name.toLowerCase()}`}>
                        <Card className="grid h-[25vh] w-full grid-cols-1 overflow-hidden border-none bg-background/50 shadow-sm ring-1 ring-primary/20 transition-all hover:shadow-md dark:ring-secondary/10 md:grid-cols-2">
                          {/* ~ ======= Left Content Section ======= ~ */}
                          <div className="flex flex-col items-start justify-center gap-4 p-8">
                            <div className="flex items-center gap-3">
                              <LogoPlaceholder letter={brand.logoPlaceholder} />
                              <h2 className="text-2xl font-bold text-primary dark:text-secondary">
                                {brand.name}
                              </h2>
                            </div>
                            <p className="text-base text-muted-foreground">
                              {brand.description}
                            </p>
                            <Button
                              size="default"
                              variant="outline"
                              className="mt-2"
                            >
                              Explore Products
                            </Button>
                          </div>

                          {/* ~ ======= Right Image Section ======= ~ */}
                          <div className="relative hidden h-full w-full bg-primary/5 dark:bg-secondary/5 md:block">
                            <div className="absolute inset-0 flex items-center justify-center p-6">
                              <div className="relative h-full w-full">
                                <Image
                                  src={brand.featuredProduct.image}
                                  alt={brand.featuredProduct.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* ~ ======= Persistent Pagination ======= ~ */}
              <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-6">
                <div className="pointer-events-auto">
                  <Pagination>
                    <PaginationContent className="gap-1">
                      {brandSlides.map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            className={`h-1.5 min-w-6 cursor-pointer rounded-full p-0 transition-colors dark:hover:bg-secondary/70 ${
                              current === index
                                ? "bg-primary hover:bg-primary/90 dark:bg-secondary dark:hover:bg-secondary/90"
                                : "bg-primary/30 hover:bg-primary/40 dark:bg-secondary/30 dark:hover:bg-secondary/40"
                            }`}
                            onClick={() => api?.scrollTo(index)}
                          />
                        </PaginationItem>
                      ))}
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </div>

            {/* ~ ======= Navigation Controls ======= ~ */}
            <div className="absolute -bottom-8 right-12 flex justify-end gap-2">
              <CarouselPrevious className="h-8 w-8 translate-y-0 border-primary/20 bg-background hover:bg-primary/5 dark:border-secondary/20 dark:hover:bg-secondary/5" />
              <CarouselNext className="h-8 w-8 translate-y-0 border-primary/20 bg-background hover:bg-primary/5 dark:border-secondary/20 dark:hover:bg-secondary/5" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default StorePageHero;
