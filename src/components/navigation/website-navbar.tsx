"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  Bookmark,
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
import useWindowScroll from "beautiful-react-hooks/useWindowScroll";
import { cn } from "@/lib/utils";
import UserCartSheet from "../sheets/user-cart-sheet";
import UserWishlistSheet from "../sheets/user-wishlist-sheet";
import useProducts from "@/hooks/use-products";
import LogoColorReg from "@/svgs/logo-color-reg.svg";
import LogoWhiteReg from "@/svgs/logo-white-reg-1.svg";
import Image from "next/image";
import SignInDialog from "../dialogs/signin-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const WebsiteNavBar: React.FC = () => {
  const router = useRouter();
  const { signOut, isAnonymous, profile, isProfileLoading } = useUser();
  const { userCart } = useProducts();
  const { setTheme, theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [showCartSheet, setShowCartSheet] = useState(false);
  const [showWishlistSheet, setShowWishlistSheet] = useState(false);
  const [mounted, setMounted] = useState(false);
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
            className="cursor-pointer text-xl font-bold text-primary dark:text-secondary"
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
          <motion.div variants={navItemVariants}>
            <Link
              href="/store?imageFilter=with-image"
              className="text-muted-foreground hover:text-primary dark:hover:text-accent-foreground"
            >
              Shop
            </Link>
          </motion.div>

          <motion.div variants={navItemVariants}>
            <Link
              href="/packages"
              className="text-muted-foreground hover:text-primary dark:hover:text-accent-foreground"
            >
              Packages
            </Link>
          </motion.div>

          {/* ~ ======= Contact us page --> */}
          <motion.div variants={navItemVariants}>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-primary dark:hover:text-accent-foreground"
            >
              Contact us
            </Link>
          </motion.div>

          {/* ~ ======= About us page --> */}
          <motion.div variants={navItemVariants}>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-primary dark:hover:text-accent-foreground"
            >
              About us
            </Link>
          </motion.div>

          <motion.div variants={navItemVariants}>
            <p
              onClick={() => signOut()}
              className="cursor-pointer text-muted-foreground hover:text-primary dark:hover:text-accent-foreground"
            >
              sign out
            </p>
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

        {/* ~ ======= User dropdown menu --> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {isAnonymous ? (
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
            ) : (
              <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/50 ring-offset-1 dark:ring-secondary/60 dark:ring-offset-0">
                <AvatarImage src={profile?.imageUrl as string} alt="Profile" />
                <AvatarFallback>
                  {profile?.firstName?.charAt(0)}
                  {profile?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
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
