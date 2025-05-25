"use client";

import React from "react";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { Button } from "@/components/ui/button";
import {
  PackagePlan,
  PackagePlans,
} from "@/app/(Website)/packages/package-plans.data";
import VoipPhonePicker from "@/components/dialogs/voip-phone-picker";

const PackagesPage: React.FC = () => {
  const [showPhoneDialog, setShowShowPhoneDialog] =
    React.useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = React.useState<PackagePlan>(
    PackagePlans[1],
  );

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
      {/* -- Hero section with title, subtitle and CTA buttons -- */}
      {/* ~ =================================== ~ */}
      <header className="container mx-auto flex h-max w-full max-w-7xl flex-col items-start justify-center gap-8 pb-20 pt-28">
        {/* ~ ======= Section Title ======= ~ */}
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-secondary dark:text-accent">
            Explore
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-secondary sm:text-5xl">
            VoIP Service Packages
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Discover our range of VoIP packages tailored to meet your
            communication needs.
          </p>
        </div>

        {/* ~ ======= CTA Buttons ======= ~ */}
        <div className="flex gap-4">
          <Button variant="default" size="lg">
            Learn More
          </Button>
          <Button variant="outline" size="lg">
            Sign Up
          </Button>
        </div>
      </header>

      <main className="container mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-8 py-16">
        {/* ~ =================================== ~ */}
        {/* -- Pricing section header -- */}
        {/* ~ =================================== ~ */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Pricing Plans</h2>
          <p className="text-muted-foreground">
            Choose the perfect VoIP package for your needs.
          </p>
        </div>

        {/* ~ =================================== ~ */}
        {/* -- Pricing tiers -- */}
        {/* ~ =================================== ~ */}
        <div className="mt-8 grid w-full grid-cols-1 gap-8 md:grid-cols-3">
          {PackagePlans.map((plan) =>
            plan.name !== "Gold" ? (
              <div
                key={plan.name}
                className="relative flex flex-col gap-6 rounded-lg border bg-background p-6 shadow-sm transition-shadow hover:shadow-md dark:border-accent/40"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">
                    {plan.name}{" "}
                    <span className="text-sm text-muted-foreground">+ VAT</span>
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">£{plan.price}</span>
                    <span className="text-sm text-muted-foreground">
                      Per Month
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setCurrentPlan(plan);
                    setShowShowPhoneDialog(true);
                  }}
                >
                  Get Started
                </Button>
              </div>
            ) : (
              <div
                key={plan.name}
                className="relative flex flex-col gap-6 rounded-lg border-2 border-primary bg-background p-6 shadow-lg transition-shadow hover:shadow-xl dark:border-secondary"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground dark:bg-secondary dark:text-secondary-foreground">
                  Most Popular
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">
                    {plan.name}{" "}
                    <span className="text-sm text-muted-foreground">+ VAT</span>
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">
                      Per Month
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/90"
                  onClick={() => {
                    setCurrentPlan(plan);
                    setShowShowPhoneDialog(true);
                  }}
                >
                  Get Started
                </Button>
              </div>
            ),
          )}
          <VoipPhonePicker
            open={showPhoneDialog}
            setOpen={setShowShowPhoneDialog}
            plan={currentPlan}
          />
        </div>

        {/* ~ =================================== ~ */}
        {/* -- Feature comparison table -- */}
        {/* ~ =================================== ~ */}
        <div className="mt-16 w-full">
          {/* ~ ======= Basic Communication Features ======= ~ */}
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-primary dark:text-secondary">
              Basic Communication Features
            </h3>
            <div className="divide-y rounded-lg border-2">
              {features.map((feature) => (
                <div key={feature.name} className="grid grid-cols-4 p-4">
                  <span className="font-medium">{feature.name}</span>
                  <span className="text-center">{feature.silver}</span>
                  <span className="text-center">{feature.gold}</span>
                  <span className="text-center">{feature.diamond}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ~ ======= Advanced Call Management ======= ~ */}
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-primary dark:text-secondary">
              Advanced Call Management
            </h3>
            <div className="divide-y rounded-lg border-2">
              {features2.map((feature) => (
                <div key={feature.name} className="grid grid-cols-4 p-4">
                  <span className="font-medium">{feature.name}</span>
                  <span className="text-center">{feature.silver}</span>
                  <span className="text-center">{feature.gold}</span>
                  <span className="text-center">{feature.diamond}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ~ ======= Enterprise Solutions ======= ~ */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-primary dark:text-secondary">
              Enterprise Solutions
            </h3>
            <div className="divide-y rounded-lg border-2">
              {supportFeatures.map((feature) => (
                <div key={feature.name} className="grid grid-cols-4 p-4">
                  <span className="font-medium">{feature.name}</span>
                  <span className="text-center">{feature.silver}</span>
                  <span className="text-center">{feature.gold}</span>
                  <span className="text-center">{feature.diamond}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PackagesPage;

type Feature = {
  name: string;
  silver: string;
  gold: string;
  diamond: string;
};

const features: Feature[] = [
  { name: "Package Name", silver: "Silver", gold: "Gold", diamond: "Diamond" },
  { name: "Calls", silver: "Inbound only", gold: "✓", diamond: "✓" },
  { name: "UK Number", silver: "✓", gold: "✓", diamond: "✓" },
  { name: "Mobile/Desktop App Access", silver: "✓", gold: "✓", diamond: "✓" },
  { name: "Call Logs", silver: "✓", gold: "✓", diamond: "✓" },
  {
    name: "Free Minutes",
    silver: "-",
    gold: "1000 mins",
    diamond: "2000 mins",
  },
  { name: "Call Monitoring", silver: "-", gold: "✓", diamond: "✓" },
];

const features2: Feature[] = [
  { name: "Package Name", silver: "Silver", gold: "Gold", diamond: "Diamond" },
  { name: "On-Demand Call Recording", silver: "-", gold: "✓", diamond: "✓" },
  { name: "Voicemail to email", silver: "-", gold: "✓", diamond: "✓" },
  { name: "Audio conferencing", silver: "-", gold: "✓", diamond: "✓" },
  {
    name: "VR, Ring groups",
    silver: "-",
    gold: "Additional cost",
    diamond: "Addition cost",
  },
  {
    name: "Call queuing",
    silver: "-",
    gold: "Additional cost",
    diamond: "Addition cost",
  },
];

const supportFeatures: Feature[] = [
  { name: "Package Name", silver: "Silver", gold: "Gold", diamond: "Diamond" },
  { name: "Multilevel Team managing", silver: "-", gold: "✓", diamond: "✓" },
  { name: "Quality-of-Service reports", silver: "-", gold: "✓", diamond: "✓" },
  { name: "Video conferencing", silver: "-", gold: "-", diamond: "✓" },
  { name: "Automatic call recording", silver: "-", gold: "-", diamond: "✓" },
  { name: "Multisite Admin management", silver: "-", gold: "-", diamond: "✓" },
  {
    name: "Powerful analytics and collabortation tools",
    silver: "-",
    gold: "-",
    diamond: "✓",
  },
  { name: "CRM integration", silver: "-", gold: "-", diamond: "100+" },
];
