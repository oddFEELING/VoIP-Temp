"use client";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutComponent from "@/components/checkout";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";
import { useTheme } from "next-themes";
import LogoColorReg from "@/svgs/logo-color-reg.svg";
import LogoWhiteReg from "@/svgs/logo-white-reg-1.svg";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
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
import PaymentGraphics from "@/images/payment-graphics.jpg";
import { Skeleton } from "@/components/ui/skeleton";
import usePayment, { useMutatePayments } from "@/hooks/use-payment";
import useUser from "@/hooks/use-user";
import { Address } from "@/types/address";
import AddressPickerDialog from "@/components/dialogs/address-picker-dialog";

type ComponentProps = {
  params: {
    transaction_id: string;
  };
};

const PaymentPage: React.FC<ComponentProps> = ({ params }) => {
  const { theme, setTheme } = useTheme();
  const { transaction_id } = params;
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();
  const { transaction, isTransactionLoading, setInitaited } =
    usePayment(transaction_id);
  const { user, isAnonymous } = useUser();
  const { updateTransaction } = useMutatePayments();

  // ~ ======= Payment step state management ======= ~
  const [currentStep, setCurrentStep] = useState<"address" | "payment">(
    "address",
  );
  const [addresses, setAddresses] = useState<Address[]>([]);

  // ~ ======= Set the mounted state ======= ~
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
  }

  // ~ ======= Load the Stripe promise ======= ~
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  // ~ ======= Existing loading check ======= ~
  if (isTransactionLoading || !transaction) {
    return (
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-5">
        {/* ~ ======= Loading Form Section ======= ~ */}
        <div className="col-span-1 flex h-full w-full flex-col px-4 lg:col-span-2 lg:px-10">
          <div className="flex items-center justify-between py-4 lg:py-6">
            <Skeleton className="h-[40px] w-[100px] rounded-md" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          <div className="relative flex flex-1 items-center justify-center py-6 lg:py-0">
            <Card className="h-[80vh] w-full space-y-6 p-8">
              <div className="space-y-3">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-4 w-[250px]" />
              </div>

              {/* ~ ======= Payment Form Loading ======= ~ */}
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 flex-1" />
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="ml-auto h-12 w-[200px]" />
              </div>

              {/* ~ ======= Cancel Button Loading ======= ~ */}
              <div className="flex justify-center pt-4">
                <Skeleton className="h-10 w-[180px]" />
              </div>
            </Card>
          </div>
        </div>

        {/* ~ ======= Loading Graphics Section ======= ~ */}
        <div className="hidden h-screen w-full p-3 lg:col-span-3 lg:block">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-5">
      {/* ~ ======= Main Payment Form Section ======= ~ */}
      <main className="col-span-1 flex h-full w-full flex-col px-4 lg:col-span-3 lg:px-10">
        {/* ~ ======= Header Section ======= ~ */}
        <div className="flex items-center justify-between py-4 lg:py-6">
          <div className="flex items-center space-x-2">
            {mounted ? (
              <Image
                src={theme === "light" ? LogoColorReg : LogoWhiteReg}
                alt="Logo"
                width={100}
                height={40}
                className="object-contain"
              />
            ) : (
              <div className="h-[40px] w-[100px] animate-pulse rounded-md bg-muted" />
            )}
          </div>
          <ModeToggle />
        </div>

        {/* ~ ======= Content Section ======= ~ */}
        <div className="relative flex flex-1 items-center justify-center py-6 lg:py-0">
          <Card className="max-h-[80vh] w-full space-y-4 overflow-y-auto p-4 lg:max-w-3xl lg:space-y-6 lg:p-8">
            <div className="space-y-2">
              <h1 className="text-xl font-bold lg:text-2xl">
                {currentStep === "address"
                  ? "Select Delivery Address"
                  : "Complete Your Payment"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentStep === "address"
                  ? "Choose a delivery address or add a new one"
                  : "Secure payment processing powered by Stripe"}
              </p>
            </div>

            {currentStep === "address" ? (
              <AddressPickerDialog
                open={true}
                setOpen={() => {}}
                addresses={addresses}
                transactionId={transaction_id}
                isDialog={false}
                onContinue={() => setCurrentStep("payment")}
              />
            ) : (
              <>
                <Elements
                  stripe={stripePromise}
                  options={{
                    mode: "payment",
                    amount: transaction.amount,
                    currency: "gbp",
                  }}
                >
                  <CheckoutComponent amount={transaction.amount} />
                </Elements>

                {/* ~ ======= Back to Address Selection ======= ~ */}
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("address")}
                  className="w-full"
                >
                  Change Delivery Address
                </Button>

                {/* ~ ======= Cancel Button with Confirmation Dialog ======= ~ */}
                <div className="flex justify-center pt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel Payment
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Payment?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this payment? Your
                          payment information will not be saved.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Continue Payment</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            setInitaited(false);
                            router.replace("/store?imageFilter=with-image");
                          }}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Yes, Cancel Payment
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            )}
          </Card>
        </div>
      </main>

      {/* ~ ======= Graphics Section ======= ~ */}
      <section className="hidden h-screen w-full p-3 lg:col-span-2 lg:block">
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-muted/30 ring-1 ring-primary/40 dark:ring-secondary">
          <Image
            src={PaymentGraphics}
            alt="Payment Graphics"
            fill
            className="absolute right-0 top-0 h-full w-full object-cover"
          />
          <div className="relative z-10 flex h-full w-full flex-col items-end justify-end bg-black/50 p-5">
            <h1 className="leading-wider text-3xl font-bold tracking-widest text-gray-50/80">
              Get Connected <br />
              Stay Connected
            </h1>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentPage;
