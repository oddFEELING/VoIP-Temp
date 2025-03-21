"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CreditCard } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import usePayment from "@/hooks/use-payment";
import { useParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutComponent from "@/components/page-sections/checkout/checkout";

type CheckoutPaymentMethodProps = {};
const CheckoutPaymentMethod = () => {
  const { transaction_id } = useParams();
  const router = useRouter();
  const { transaction, isTransactionLoading, setInitaited } = usePayment(
    transaction_id as string,
  );

  if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
  }

  // ~ ======= Load the Stripe promise ======= ~
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  // ~ ======= Check if required information is missing ======= ~
  const isAddressMissing = !transaction?.deliveryAddress?.address;
  const isEmailMissing = !transaction?.recieverEmail;

  if (isAddressMissing || isEmailMissing) {
    return (
      <AccordionItem
        value="payment"
        className="my-2 rounded-lg border border-border bg-white/20 p-4 shadow-sm ring-1 ring-rose-500 dark:ring-rose-400"
      >
        <div className="flex items-start gap-4">
          <div className="flex w-full flex-col space-y-1.5">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground/70" />
                <span className="text-lg font-semibold text-muted-foreground/70">
                  Payment Method
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  Locked
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground/70">
              {/* ~ ======= Show specific missing requirements ======= ~ */}
              <p>Please complete the following before proceeding to payment:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {isAddressMissing && <li>Add a delivery address</li>}
                {isEmailMissing && <li>Provide receiver&apos;s email</li>}
              </ul>
            </div>
          </div>
        </div>
      </AccordionItem>
    );
  }

  return (
    <AccordionItem
      value="payment"
      className="my-2 rounded-lg border border-border bg-muted p-4 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex w-full flex-col space-y-1.5">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-semibold">Payment Method</span>
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
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CheckoutPaymentMethod;
