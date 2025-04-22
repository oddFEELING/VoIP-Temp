"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const TrustSection = () => {
  return (
    <div className="overflow-hidden bg-background py-32">
      <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
          {/* ####################################### */}
          {/* -- Section content -- */}
          {/* ####################################### */}
          <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
            {/* ~ ======= Label ======= ~ */}
            <motion.p
              className="text-xs font-medium uppercase tracking-wide text-secondary dark:text-accent"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Trust & Security
            </motion.p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight">
              Systems that you <br />
              <span className="text-primary dark:text-secondary">
                Can Trust
              </span>
            </h2>
            <motion.p
              className="mt-3 text-base text-foreground/90"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Your business deserves a VoIP system built on trust, security and
              performance. With bank grade encryption, SOC 2 type II
              certification and a 99.99% uptime guarantee we ensure your calls,
              data and communications remain protected and uninterrupted.
            </motion.p>
            {/* ~ ======= Two Column Features ======= ~ */}
            <motion.div
              className="grid gap-8 pt-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="space-y-2">
                <p className="text-base/7 text-muted-foreground">
                  Stay connected with confidence and peace of mind. Build your
                  communication on a foundation of proven security, reliability
                  and excellence.
                </p>
              </div>
            </motion.div>
            <div className="mt-10 flex gap-6">
              <Button variant="default" size="sm" className="px-6">
                Shop Now
              </Button>

              <Button
                variant="link"
                className="group h-10 px-0 font-normal text-foreground/80 hover:text-foreground hover:no-underline"
              >
                Contact sales{" "}
                <ArrowRight className="ml-0.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* ####################################### */}
          {/* -- Section images -- */}
          {/* ####################################### */}
          <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
            <div className="relative w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1670272502246-768d249768ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1152&q=80"
                className="aspect-7/5 w-[37rem] max-w-none rounded-2xl bg-gray-50 object-cover ring-4 ring-primary ring-offset-2 dark:ring-primary/40 dark:ring-offset-1"
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/10 to-secondary/10" />
            </div>
            <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
              <div className="relative order-first flex w-64 flex-none justify-end self-end lg:w-auto">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1605656816944-971cd5c1407f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&h=604&q=80"
                  className="aspect-4/3 w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover ring-2 ring-secondary ring-offset-2 dark:ring-accent dark:ring-offset-0"
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-tr from-primary/10 to-secondary/10" />
              </div>
              <div className="relative flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1152&h=842&q=80"
                  className="aspect-7/5 w-[37rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover ring-4 ring-primary ring-offset-2 dark:ring-primary/40 dark:ring-offset-1"
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-bl from-primary/10 to-secondary/10" />
              </div>
              <div className="relative hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&h=604&q=80"
                  className="aspect-4/3 w-[24rem] max-w-none rounded-2xl bg-gray-50 object-cover ring-2 ring-secondary ring-offset-2 dark:ring-accent dark:ring-offset-0"
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-tl from-primary/10 to-secondary/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSection;
