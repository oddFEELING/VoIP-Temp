"use client";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/address";
import { useState, useEffect } from "react";
import RecieverDetails from "@/components/page-sections/checkout/reciever-details";
import { Separator } from "@/components/ui/separator";
import useUser from "@/hooks/use-user";
import CheckoutAddressPicker from "@/components/page-sections/checkout/address-picker";
import CheckoutPaymentMethod from "@/components/page-sections/checkout/payment-method";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import usePayment from "@/hooks/use-payment";
import { useParams } from "next/navigation";
import useProducts from "@/hooks/use-products";

type ComponentProps = {};

const CheckoutPage: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [mounted, setMounted] = useState(false);
  const { profile, isAnonymous } = useUser();
  const router = useRouter();
  const { transaction_id } = useParams();
  const { userCart } = useProducts();
  const { setInitaited } = usePayment(transaction_id as string);

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
              type="multiple"
              className="w-full"
              defaultValue={["user", "delivery", "payment"]}
            >
              {(profile || isAnonymous) && (
                <RecieverDetails
                  initialData={{
                    firstName: profile?.firstName ?? "",
                    lastName: profile?.lastName ?? "",
                    phone: profile?.phone ?? "",
                    email: profile?.email ?? "",
                  }}
                />
              )}

              {/* ~ ======= Delivery address ======= ~ */}
              <CheckoutAddressPicker />

              {/* ~ ======= Payment Method --> */}
              <CheckoutPaymentMethod />
            </Accordion>
          </section>

          {/* ~ ======= Right Column - Order Summary ======= ~ */}
          <section className="w-full lg:w-1/3">
            <div className="relative lg:h-[calc(100vh-8rem)]">
              <div className="sticky top-8 rounded-lg border border-border bg-muted p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-muted-foreground">Items</span>
                    <span>{userCart?.length}</span>
                  </div>
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Nil</span>
                  </div>
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      £
                      {userCart
                        ?.reduce((acc, item) => acc + Number(item.price), 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-4">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">
                      £
                      {userCart
                        ?.reduce((acc, item) => acc + Number(item.price), 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex w-full flex-col">
                    {/* ~ ======= Cancel Button with Confirmation Dialog ======= ~ */}
                    <div className="flex justify-center pt-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-muted-foreground"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel Checkout
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Cancel Checkout?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this checkout?
                              Your checkout information will not be saved.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              Continue Checkout
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                setInitaited(false);
                                router.replace("/store?imageFilter=with-image");
                              }}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Yes, Cancel Checkout
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
