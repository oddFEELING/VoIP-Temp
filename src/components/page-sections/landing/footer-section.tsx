"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Facebook, Github, Instagram, Twitter, Youtube } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Image from "next/image";
import LogoColorReg from "@/svgs/logo-color-reg.svg";
import LogoWhiteReg from "@/svgs/logo-white-reg-1.svg";

/* ~ =================================== ~ */
/* -- Navigation data -- */
/* ~ =================================== ~ */
const navigation = {
  solutions: [
    { name: "Business VoIP", href: "#" },
    { name: "Cloud PBX", href: "#" },
    { name: "SIP Trunking", href: "#" },
    { name: "Video Conferencing", href: "#" },
    { name: "Call Analytics", href: "#" },
  ],
  support: [
    { name: "Technical Support", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "System Status", href: "#" },
  ],
  company: [
    { name: "Blog", href: "#" },
    { name: "Packages", href: "/packages" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Acceptable Use", href: "#" },
  ],
  social: [
    {
      name: "Facebook",
      href: "#",
      icon: Facebook,
    },
    {
      name: "Instagram",
      href: "#",
      icon: Instagram,
    },
    {
      name: "Twitter",
      href: "#",
      icon: Twitter,
    },
    {
      name: "GitHub",
      href: "#",
      icon: Github,
    },
    {
      name: "YouTube",
      href: "#",
      icon: Youtube,
    },
  ],
};

/* ~ =================================== ~ */
/* -- Footer section component -- */
/* ~ =================================== ~ */
export default function FooterSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ~ ======= Set mounted state when component mounts ======= ~
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="relative border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-20 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* ~ ======= Logo and Navigation columns ======= ~ */}
          <div className="space-y-8">
            {mounted ? (
              <Image
                src={theme === "light" ? LogoColorReg : LogoWhiteReg}
                alt="Logo"
                width={120}
                height={150}
                className="mb-8"
              />
            ) : (
              // ~ ======= Placeholder while theme loads ======= ~
              <div className="h-[40px] w-[120px] animate-pulse rounded-md bg-muted" />
            )}
            <p className="max-w-sm text-sm text-muted-foreground">
              Empowering businesses with cutting-edge VoIP solutions. Experience
              seamless communication with our enterprise-grade services.
            </p>
          </div>

          {/* ~ ======= Navigation columns ======= ~ */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Solutions
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary dark:hover:text-secondary"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground">
                  Support
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary dark:hover:text-secondary"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Company
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary dark:hover:text-secondary"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary dark:hover:text-secondary"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ~ ======= Footer bottom section ======= ~ */}
        <div className="mt-16 border-t border-border/40 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col-reverse gap-y-6 md:flex-row md:items-center md:justify-between">
            <p className="mt-8 text-sm text-muted-foreground md:order-1 md:mt-0">
              &copy; {new Date().getFullYear()} LinkOrg Networks. All rights
              reserved.
            </p>
            <div className="flex gap-x-6 md:order-2">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-primary dark:hover:text-secondary"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
