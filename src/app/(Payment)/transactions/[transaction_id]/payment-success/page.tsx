"use client";

import { CheckCircle2, Copy, KeyRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useConfetti from "@/hooks/use-confetti";
import useUser, { useMutateUser } from "@/hooks/use-user";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useQueryState } from "nuqs";
import usePayment, { useMutatePayments } from "@/hooks/use-payment";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { generateDiceBearUrl, convertSubCurrencyToCurrency } from "@/lib/utils";
import { getCurrentUser, linkEmailIdentity } from "@/actions/auth.actions";
import useProducts, { useProductMutations } from "@/hooks/use-products";

const formSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

const SuccessPaymentPage = () => {
  const [intentId] = useQueryState("payment_intent");
  const {
    isAnonymous,
    linkGoogleWithIdentity,
    updateUserPassword,
    updateUserEmail,
    linkEmailIdentity,
  } = useUser();
  const { createUserProfile } = useMutateUser();
  const { transaction_id } = useParams();
  const { transaction, isTransactionLoading } = usePayment(
    transaction_id as string,
  );
  const { updateTransaction } = useMutatePayments();
  const { clearCart } = useProductMutations();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  useConfetti();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // ~ ======= Form instance -->
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // ~ ======= Memoized update payment function ======= ~
  const updatePayment = useCallback(async () => {
    if (!transaction_id) return;

    updateTransaction({
      transactionId: transaction_id as string,
      updateData: { status: "succeeded" },
    });

    await axios.post("/api/emails/purchase-success", {
      transaction_id,
    });
  }, [transaction_id, updateTransaction]);

  // ~ ======= Handle copy transaction ID ======= ~
  const handleCopyTransactionId = () => {
    if (transaction_id) {
      navigator.clipboard.writeText(transaction_id as string);
      toast.success("Transaction ID copied to clipboard");
    }
  };

  // ~ ======= Handle password submission ======= ~
  const handlePasswordSubmit = async (formData: z.infer<typeof formSchema>) => {
    // Reset error state
    form.clearErrors();

    if (formData.password !== formData.confirmPassword) {
      form.setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    if (!transaction?.recieverEmail) {
      toast.error("No reciever email found in transaction");
      return;
    }

    try {
      await updateUserPassword(formData.password);
      await updateUserEmail(transaction?.recieverEmail ?? "");

      await linkEmailIdentity(
        transaction?.recieverEmail ?? "",
        formData.password,
      );
      const user = await getCurrentUser();
      createUserProfile({
        id: user?.id ?? "",
        email: transaction?.recieverEmail ?? "",
        firstName: transaction?.recieverFirstName ?? "",
        lastName: transaction?.recieverLastName ?? "",
        imageUrl: generateDiceBearUrl(transaction?.recieverEmail ?? ""),
      });
    } catch (error) {
      console.error(error);
    }

    toast.success("Password set successfully");
    setIsPasswordDialogOpen(false);
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
    <div className="container mx-auto max-w-lg px-4 py-10">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">
            Payment Successful
          </h1>
          <p className="text-muted-foreground">
            Thank you for your payment. Your transaction has been completed
            successfully.
          </p>
        </div>

        {isTransactionLoading ? (
          <Skeleton className="h-[100px] w-full" />
        ) : (
          <Card className="w-full p-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-medium">
                  £{convertSubCurrencyToCurrency(transaction?.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Transaction ID
                </span>
                <div className="flex items-center gap-2">
                  <span className="max-w-[120px] truncate text-xs">
                    {transaction_id}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleCopyTransactionId}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="font-medium">
                  {transaction?.createdAt
                    ? new Date(transaction.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </Card>
        )}

        {isAnonymous && (
          <div className="w-full space-y-4">
            <div className="space-y-2 text-left">
              <h2 className="text-lg font-semibold">Create an account</h2>
              <p className="text-sm text-muted-foreground">
                Create an account to track your payments, view your order
                history, receive updates on your orders, and manage your
                subscriptions.
              </p>
            </div>

            {/* ~ ======= Button to open password dialog ======= ~ */}
            <Button
              className="w-full"
              onClick={() => setIsPasswordDialogOpen(true)}
              variant="outline"
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Set Password to Create Account
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleContinueWithGoogle}
              variant="outline"
            >
              <svg
                className="mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        )}

        <Link
          href="/"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline dark:text-secondary"
        >
          Return to Home
        </Link>
      </div>

      {/* ~ ======= Password Dialog ======= ~ */}
      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription>
              Create an account to track your payments, view your order history
              and receive updates on your orders.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handlePasswordSubmit)}
              className="space-y-4"
            >
              <div className="grid gap-4 py-4">
                {/* ~ ======= Password Input --> */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          {...field}
                          placeholder="Enter your password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ~ ======= Confirm Password Input --> */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...field}
                          placeholder="Confirm your password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsPasswordDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Account</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuccessPaymentPage;
