"use client";
import Link from "next/link";
import React, { useRef, useState } from "react";
import {
  Bookmark,
  ChevronDown,
  ComputerIcon,
  LogOut,
  MessageSquareText,
  Moon,
  MoonIcon,
  PackagePlus,
  Phone,
  ShoppingCart,
  Sun,
  SunIcon,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTheme } from "next-themes";
import useUser from "@/hooks/use-user";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import useWindowScroll from "beautiful-react-hooks/useWindowScroll";
import { cn } from "@/lib/utils";
import UserCartSheet from "../sheets/user-cart-sheet";
import UserWishlistSheet from "../sheets/user-wishlist-sheet";
import useProducts from "@/hooks/use-products";
import LogoColorReg from "@/svgs/logo-color-reg.svg";
import LogoWhiteReg from "@/svgs/logo-white-reg-1.svg";
import Image from "next/image";
import SignInDialog from "../dialogs/signin-dialog";

const WebsiteNavBar: React.FC = () => {
  const router = useRouter();
  const { signOut, isAnonymous, profile, isProfileLoading } = useUser();
  const { userCart } = useProducts();
  const { setTheme, theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [showCartSheet, setShowCartSheet] = useState(false);
  const [showWishlistSheet, setShowWishlistSheet] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const onWindowScroll = useWindowScroll();
  const [showSigninDialog, setShowSigninDialog] = useState(false);
  const effectThreshold = 20; // Adjust this value to control when the effect is applied

  // ~ ======= Set mounted state when component mounts ======= ~
  React.useEffect(() => {
    setMounted(true);
  }, []);

  onWindowScroll((event) => {
    setScrollY(window.scrollY);
  });

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // ~ ======= Animation variants for nav items -->
  const navItemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren",
      },
    },
  };

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 flex w-full items-center justify-between px-8 py-5 transition-all duration-300 ease-out",
        scrollY > effectThreshold
          ? "border-b border-muted bg-background/80 shadow-lg backdrop-blur-md lg:px-32"
          : "bg-transparent lg:px-20",
      )}
    >
      <div className="flex items-center justify-between space-x-6">
        <Link href="/">
          <motion.div
            className="text-xl font-bold text-primary dark:text-secondary"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {mounted ? (
              <Image
                src={theme === "light" ? LogoColorReg : LogoWhiteReg}
                alt="Logo"
                width={120}
                height={150}
              />
            ) : (
              // ~ ======= Placeholder while theme loads ======= ~
              <div className="h-[40px] w-[120px] animate-pulse rounded-md bg-muted" />
            )}
          </motion.div>
        </Link>
        <motion.div
          className="hidden space-x-6 border-l border-primary/20 px-3 md:flex"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* ~ ======= About us page --> */}
          <motion.div variants={navItemVariants}>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary dark:hover:text-accent-foreground"
            >
              About us
            </Link>
          </motion.div>

          {/* ~ ======= Voip Products popover --> */}
          <Popover open={isOpen}>
            <PopoverTrigger
              asChild
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                variants={navItemVariants}
                className="flex w-max cursor-pointer items-center space-x-2 outline-none data-[state=open]:ring-0"
              >
                <span className="text-muted-foreground hover:text-primary dark:hover:text-accent-foreground">
                  Voip Products
                </span>
                <ChevronDown size={16} strokeWidth={1.5} />
              </motion.div>
            </PopoverTrigger>
            <PopoverContent
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              side="bottom"
              align="center"
              sideOffset={10}
              className="w-56 rounded-md bg-background p-4 shadow-md outline-none data-[state=open]:ring-1 data-[state=open]:ring-muted"
            >
              <div className="flex flex-col gap-2">
                <Link href="#" className="transition-colors hover:text-primary">
                  Voip Phones
                </Link>
                <Link href="#" className="transition-colors hover:text-primary">
                  Voip Softphones
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          {/* ~ ======= Contact us page --> */}
          <motion.div variants={navItemVariants}>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-primary dark:hover:text-accent-foreground"
            >
              Contact us
            </Link>
          </motion.div>
          <motion.div variants={navItemVariants}>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary dark:hover:text-accent-foreground"
            >
              Pricing
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ####################################### */}
      {/* -- User and Cart section --> */}
      {/* ####################################### */}
      <SignInDialog
        open={showSigninDialog}
        onOpenChange={setShowSigninDialog}
      />
      <div
        className={cn(
          "flex items-center",
          scrollY > effectThreshold ? "space-x-4" : "space-x-5",
        )}
      >
        <Button
          variant="default"
          onClick={() => router.push("/store?imageFilter=with-image")}
        >
          Visit Store
        </Button>

        {/* ~ ======= Cart Icon with Badge --> */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCartSheet(true)}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          {userCart && userCart.length > 0 && (
            <Badge
              variant="secondary"
              className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full p-0 text-xs font-medium"
            >
              {userCart.length}
            </Badge>
          )}
          <UserCartSheet open={showCartSheet} onOpenChange={setShowCartSheet} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "bg-transparent shadow-none",
                scrollY > effectThreshold
                  ? "border-muted-foreground/50 dark:border-muted-foreground/30"
                  : "border-border",
              )}
            >
              <User />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className="relative z-50 w-56 rounded-lg border border-muted/30 bg-background/90 p-2 shadow-lg ring-1 ring-black/5 dark:ring-1 dark:ring-accent/30"
          >
            {/* ~ ======= Account section ======= ~ */}
            <DropdownMenuGroup>
              {!isAnonymous ? (
                <>
                  {/* ~ ======= Profile Info Section ======= ~ */}
                  <div className="mb-2 px-2 py-2">
                    <div className="flex items-center gap-3">
                      {profile?.imageUrl ? (
                        <img
                          src={profile.imageUrl}
                          alt="Profile"
                          className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                          <User size={20} strokeWidth={1.5} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        {isProfileLoading ? (
                          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                        ) : (
                          <p className="truncate text-sm font-medium">
                            {profile?.firstName} {profile?.lastName}
                          </p>
                        )}
                        <p className="truncate text-xs text-muted-foreground">
                          {profile?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="my-1" />
                </>
              ) : (
                <DropdownMenuItem
                  className="gap-3 px-2 py-1.5"
                  onClick={() => setShowSigninDialog(true)}
                >
                  <User size={16} strokeWidth={1.5} />
                  <span>Sign in</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                className="gap-3 px-2 py-1.5"
                onClick={() => setShowWishlistSheet(true)}
              >
                <Bookmark size={16} strokeWidth={1.5} />
                <span>Wishlist</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="gap-3 px-2 py-1.5"
                onClick={() => router.push("/orders")}
              >
                <PackagePlus size={16} strokeWidth={1.5} />
                <span>My orders</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-2" />

            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-3 px-2 py-1.5">
                <Phone size={16} strokeWidth={1.5} />
                <span>Call us</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 px-2 py-1.5">
                <MessageSquareText size={16} strokeWidth={1.5} />
                <span>Leave us a mail</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-3 px-2 py-1.5">
                {theme === "light" && (
                  <>
                    <Sun size={16} strokeWidth={1.5} />
                    <span>Light</span>
                  </>
                )}
                {theme === "dark" && (
                  <>
                    <Moon size={16} strokeWidth={1.5} />
                    <span>Dark</span>
                  </>
                )}
                {theme === "system" && (
                  <>
                    <ComputerIcon size={16} strokeWidth={1.5} />
                    <span>System</span>
                  </>
                )}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                sideOffset={10}
                className="z-[60] rounded-lg border border-muted/30 bg-background/85 p-2 shadow-lg ring-1 ring-black/5 dark:ring-accent/50"
              >
                <DropdownMenuItem
                  className="gap-3 px-2 py-1.5"
                  onClick={() => setTheme("light")}
                >
                  <SunIcon size={16} strokeWidth={1.5} />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-3 px-2 py-1.5"
                  onClick={() => setTheme("dark")}
                >
                  <MoonIcon size={16} strokeWidth={1.5} />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-3 px-2 py-1.5"
                  onClick={() => setTheme("system")}
                >
                  <ComputerIcon size={16} strokeWidth={1.5} />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {!isAnonymous && (
              <DropdownMenuItem className="gap-3 px-2 py-1.5" onClick={signOut}>
                <LogOut size={16} strokeWidth={1.5} />
                <span>Signout</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <UserWishlistSheet
          open={showWishlistSheet}
          onOpenChange={setShowWishlistSheet}
        />
      </div>
    </nav>
  );
};

export default WebsiteNavBar;
