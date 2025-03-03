"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Home, Users2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useUser from "@/hooks/use-user";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

// ~ ======= Google Logo Component ======= ~
const GoogleLogo = () => (
  <svg
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      fill="#4285F4"
      d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
    />
    <path
      fill="#34A853"
      d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
    />
    <path
      fill="#FBBC05"
      d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
    />
    <path
      fill="#EA4335"
      d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
    />
  </svg>
);

// ~ ======= Animation variants for smooth transitions ======= ~
const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

type LayoutProps = {
  children: React.ReactNode;
};

const OrdersLayout = ({ children }: LayoutProps) => {
  const { user, isAnonymous, isReady, googleSignIn } = useUser();

  // ~ ======= Loading State ======= ~
  if (!isReady) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl bg-background/70 p-6 sm:p-8">
          <div className="mx-auto text-center">
            {/* ~ ======= Skeleton Loading UI ======= ~ */}
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center">
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="mx-auto h-8 w-3/4" />
              <Skeleton className="mx-auto h-4 w-full max-w-md" />
            </div>
            <div className="mt-6">
              <Skeleton className="mx-auto h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAnonymous) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center overflow-hidden bg-background px-4">
        {/* ~ ======= Background Effects ======= ~ */}
        <div className="absolute inset-x-0 top-0 -z-10 h-screen bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute inset-x-0 top-0 -z-10 h-screen bg-[linear-gradient(to_right,transparent_0%,primary/5_50%,transparent_100%)] blur-3xl" />

        {/* ~ ======= Content Container ======= ~ */}
        <div className="w-full max-w-md rounded-2xl bg-background/70 p-4 backdrop-blur-sm sm:p-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="mx-auto text-center"
          >
            {/* ~ ======= Icon Section ======= ~ */}
            <motion.div
              variants={fadeIn}
              className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-primary/5 dark:bg-secondary/10 dark:text-secondary dark:ring-secondary/5 sm:mb-8 sm:h-14 sm:w-14"
            >
              <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" />
            </motion.div>

            {/* ~ ======= Content Section ======= ~ */}
            <motion.div variants={fadeIn} className="space-y-2 sm:space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                View Your Orders
              </h1>
              <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
                Sign in to track your orders and manage your purchases
              </p>
            </motion.div>

            {/* ~ ======= Action Button ======= ~ */}
            <motion.div variants={fadeIn} className="mt-6 sm:mt-8">
              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  placeholder="Email sign in"
                  className="w-full"
                />
                <Button className="w-full">Continue with email</Button>
                <div className="my-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Separator className="flex-1" />
                  <span>Or</span>
                  <Separator className="flex-1" />
                </div>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={async () => googleSignIn()}
                  className="group relative w-full gap-2 overflow-hidden rounded-xl transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base">
                    <GoogleLogo />
                    Sign in with Google
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </div>
            </motion.div>

            {/* ~ ======= Navigation Links ======= ~ */}
            <motion.div variants={fadeIn} className="mt-6 sm:mt-8">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase sm:text-xs">
                  <span className="bg-background px-2 text-muted-foreground">
                    Quick Links
                  </span>
                </div>
              </div>

              <div className="mt-4 grid w-full grid-cols-3 gap-2 sm:gap-2.5">
                <Link href="/" className="col-span-1">
                  <Button
                    variant="ghost"
                    size="default"
                    className="sm:size-lg w-full gap-2 rounded-xl text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground"
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </Link>

                <Link href="/explore" className="col-span-1">
                  <Button
                    variant="ghost"
                    size="default"
                    className="sm:size-lg w-full gap-2 rounded-xl text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground"
                  >
                    <Users2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Explore</span>
                  </Button>
                </Link>

                <Link href="/contact" className="col-span-1">
                  <Button
                    variant="ghost"
                    size="default"
                    className="sm:size-lg w-full gap-2 rounded-xl text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="hidden sm:inline">Contact</span>
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default OrdersLayout;
