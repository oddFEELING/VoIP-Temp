"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/address";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import RecieverDetails from "@/components/page-sections/checkout/reciever-details";
import { MapPin, CreditCard, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type ComponentProps = {};

const initialReceiverData = {
  firstName: "John",
  lastName: "Doe",
  phone: "+44 7700 900077",
  email: "john.doe@example.com",
};

const CheckoutPage: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* ~ ======= Secure checkout ======= ~ */}
      <section className="flex w-full items-center justify-center bg-muted py-3">
        <p>Secure checkout with Stripe</p>
      </section>

      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ~ ======= Left Column - Checkout Forms ======= ~ */}
          <section className="flex w-full lg:w-2/3">
            <Accordion
              type="single"
              className="w-full"
              defaultValue="user"
              collapsible
            >
              <RecieverDetails initialData={initialReceiverData} />

              {/* ~ ======= Delivery address ======= ~ */}
              <AccordionItem
                value="delivery"
                className="my-2 rounded-lg border border-border bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex w-full flex-col space-y-1.5">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <span className="text-lg font-semibold">
                          Delivering to
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Flat 1, 320 Linthorpe Road, Middlesbrough</p>
                      <p>United Kingdom, TS13QY</p>
                    </div>
                  </div>

                  <AccordionTrigger className="h-max">
                    <Button variant="ghost" size="sm" className="h-8 px-3">
                      Change
                    </Button>
                  </AccordionTrigger>
                </div>

                <AccordionContent className="mt-4">
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">
                        Select delivery address
                      </h3>
                      <Button variant="outline" size="sm">
                        Add new address
                      </Button>
                    </div>
                    {DummyAddresses.map((address) => (
                      <Card
                        key={address.postCode}
                        className="border-border bg-muted/50 transition-colors hover:bg-muted"
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="flex items-center gap-2 text-base">
                                {address.HouseNumber}
                                {address.postCode === "TS13QY" && (
                                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
                                    Current
                                  </span>
                                )}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {address.address}, {address.city}
                                <br />
                                {address.state}, {address.postCode}
                              </CardDescription>
                            </div>
                            <Button
                              variant={
                                address.postCode === "TS13QY"
                                  ? "secondary"
                                  : "outline"
                              }
                              size="sm"
                              className="h-8"
                            >
                              {address.postCode === "TS13QY"
                                ? "Selected"
                                : "Select"}
                            </Button>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="payment"
                className="my-2 rounded-lg border border-border bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex w-full flex-col space-y-1.5">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <span className="text-lg font-semibold">
                          Payment Method
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Select your preferred payment method
                    </div>
                  </div>

                  <AccordionTrigger className="h-max">
                    <Button variant="ghost" size="sm" className="h-8 px-3">
                      Select
                    </Button>
                  </AccordionTrigger>
                </div>
                <AccordionContent className="mt-4">
                  <div className="space-y-3 border-t pt-4">
                    <div className="rounded-lg border p-4">
                      Stripe Card Integration Here
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* ~ ======= Right Column - Order Summary ======= ~ */}
          <section className="w-full lg:w-1/3">
            <div className="relative lg:h-[calc(100vh-8rem)]">
              <div className="sticky top-8 rounded-lg border border-border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>£99.99</span>
                  </div>
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>£4.99</span>
                  </div>
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-muted-foreground">Tax</span>
                    <span>£20.00</span>
                  </div>
                  <div className="flex justify-between pt-4">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">£124.98</span>
                  </div>
                  <div className="flex w-full flex-col">
                    <Button className="mt-6 w-full">Checkout as Guest</Button>
                    <div className="flex w-full items-center justify-center gap-2 overflow-hidden">
                      <Separator className="my-4 w-full" />
                      <span className="text-muted-foreground text-xs">Or</span>
                      <Separator className="my-4 w-full" />
                    </div>
                    <Button variant='outline' className="w-full">Continue with Google</Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;

// ~ =============================================>
// ~ ======= Sample Data
// ~ =============================================>
const DummyAddresses: Address[] = [
  {
    HouseNumber: "Flat 1",
    address: "320 Linthorpe Road",
    city: "Middlesbrough",
    state: "Cleveland",
    postCode: "TS13QD",
  },
  {
    HouseNumber: "Flat 1",
    address: "320 Linthorpe Road",
    city: "Middlesbrough",
    state: "Cleveland",
    postCode: "TS13QL",
  },
  {
    HouseNumber: "Flat 1",
    address: "320 Linthorpe Road",
    city: "Middlesbrough",
    state: "Cleveland",
    postCode: "TS13QY",
  },
];
