"use client";

import { CheckCircle2, Mail, Copy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useConfetti from "@/hooks/use-confetti";
import useUser from "@/hooks/use-user";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useQueryState } from "nuqs";
import usePayment, { useMutatePayments } from "@/hooks/use-payment";
import { useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const SuccessPaymentPage = () => {
  const [intentId] = useQueryState("payment_intent");
  const { isAnonymous, linkGoogleWithIdentity } = useUser();
  const { transaction_id } = useParams();
  const { transaction, isTransactionLoading } = usePayment(
    transaction_id as string,
  );
  const { updateTransaction } = useMutatePayments();
  useConfetti();

  // ~ ======= Memoized update payment function ======= ~
  const updatePayment = useCallback(async () => {
    if (!transaction_id) return;

    updateTransaction({
      transactionId: transaction_id as string,
      updateData: { status: "succeeded" },
    });
  }, [transaction_id, updateTransaction]);

  // ~ ======= Handle copy transaction ID ======= ~
  const handleCopyTransactionId = () => {
    if (transaction?.id) {
      navigator.clipboard.writeText(transaction.id);
      toast.success("Transaction ID copied to clipboard");
    }
  };

  // ~ ======= Handle continue with Google ======= ~
  const handleContinueWithGoogle = () => {
    linkGoogleWithIdentity();
  };

  // ~ ======= Effect to handle payment update ======= ~
  useEffect(() => {
    updatePayment();
  }, [updatePayment]);

  return (
    <main className="flex min-h-[calc(100vh-140px)] w-full flex-col items-center justify-center p-4 md:p-8">
      {/* ~ ======= Payment Success Container ======= ~ */}
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        {/* ~ ======= Success Icon ======= ~ */}
        <CheckCircle2 className="h-16 w-16 text-green-500" strokeWidth={1.5} />

        {/* ~ ======= Main Content ======= ~ */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Thank You!</h1>
          <p className="text-muted-foreground">
            Your payment was processed successfully. A confirmation email has
            been sent to your inbox.
          </p>
        </div>

        {/* ~ ======= Order Details ======= ~ */}
        <div className="w-full space-y-4 rounded-lg border p-4 text-sm">
          {/* ~ ======= Detail Row ======= ~ */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Order ID</span>
            {isTransactionLoading ? (
              <Skeleton className="h-5 w-24" />
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  # trs_{transaction?.id?.slice(0, 8)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleCopyTransactionId}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          {/* ~ ======= Detail Row ======= ~ */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Paid</span>
            {isTransactionLoading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <span className="font-medium">
                ${Number(transaction?.amount) / 100}
              </span>
            )}
          </div>
          {/* ~ ======= Detail Row ======= ~ */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            {isTransactionLoading ? (
              <Skeleton className="h-5 w-28" />
            ) : (
              <span className="font-medium">
                {new Date(
                  transaction?.createdAt as string,
                ).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* ~ ======= Anonymous User Email Prompt ======= ~ */}
        {isAnonymous && (
          <Card className="w-full p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">
                  See transaction details
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your email to receive order updates and tracking
                  information
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1"
                  />
                  <Button>
                    <Mail className="mr-2 h-4 w-4" />
                    Submit
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleContinueWithGoogle}
                >
                  Continue with Google
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ~ ======= Return to Store ======= ~ */}
        <Button asChild className="w-full" variant="default">
          <Link href="/store?imageFilter=with-image">Continue Shopping</Link>
        </Button>
      </div>
    </main>
  );
};

export default SuccessPaymentPage;
