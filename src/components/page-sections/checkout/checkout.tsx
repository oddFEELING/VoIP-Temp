"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useUser from "@/hooks/use-user";
import { useParams } from "next/navigation";
import { convertSubCurrencyToCurrency } from "@/lib/utils";
import { useProductMutations } from "@/hooks/use-products";

type ComponentProps = {
  amount: number;
};

const CheckoutComponent: React.FC<ComponentProps> = ({ amount }) => {
  const { user } = useUser();
  const { transaction_id } = useParams();

  // ~ ======= States ======= ~
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { clearCart } = useProductMutations();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const queryClient = useQueryClient();

  const stripe = useStripe();
  const elements = useElements();

  // ~ ======= Memoized API call ======= ~
  const createClientSecret = useCallback(async () => {
    if (!user?.id || amount <= 0) return;

    try {
      setIsInitializing(true);
      const response = await axios.post("/api/create-payment-intent", {
        amount: amount,
        transactionId: transaction_id,
      });

      console.log(response);
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.log(error);
      toast.error("Failed to initialize payment. Please try again.");
    } finally {
      setIsInitializing(false);
    }
  }, [amount, user?.id, transaction_id, queryClient]);

  // ~ ======= Effects ======= ~
  useEffect(() => {
    createClientSecret();

    return () => {
      setClientSecret(null);
    };
  }, [createClientSecret]);

  // ~ ======= Handle form submission ======= ~
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await elements.submit();
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret as string,
        confirmParams: {
          return_url: `${window.location.origin}/transactions/${transaction_id}/payment-success`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "An error occurred");
        toast.error(error.message || "Payment failed. Please try again.");
      } else {
        await axios.post("/api/submit-order", {
          transaction_id,
        });

        clearCart();
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ~ ======= Loading State ======= ~
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {clientSecret && (
        <div className="space-y-4">
          <PaymentElement />
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
        </div>
      )}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!stripe || !elements || loading}
      >
        {loading ? (
          <div className="flex animate-pulse items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <span>Pay £{convertSubCurrencyToCurrency(amount)}</span>
        )}
      </Button>
    </form>
  );
};

export default CheckoutComponent;
