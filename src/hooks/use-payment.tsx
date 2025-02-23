"use client";

import { create } from "zustand";
import { Elements } from "@stripe/react-stripe-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  transactionItems,
  transactions,
} from "@/services/db/schema/transaction.schema";
import {
  createNewTransaction,
  deleteTransaction as deleteTransactionAction,
  getAllUserTransactions,
  getTransactionById,
  getTransactionsAndItems,
  updateTransaction as updateTransactionAction,
} from "@/actions/payment.actions";
import useUser from "./use-user";
import { cache_12_hours } from "./cache-info";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type PaymentType = {
  initaited: boolean;
  clientSecret: string | null;
  elements: typeof Elements | null;
  setInitaited: (initaited: boolean) => void;
  setClientSecret: (clientSecret: string) => void;
  setElements: (elements: typeof Elements) => void;
};

// ~ =============================================>
// ~ ======= Use payment store   -->
// ~ =============================================>
const paymentStore = create<PaymentType>((set) => ({
  initaited: false,
  clientSecret: null,
  elements: null,
  setInitaited: (initaited: boolean) => set({ initaited }),
  setClientSecret: (clientSecret: string) => set({ clientSecret }),
  setElements: (elements: typeof Elements) => set({ elements }),
}));

// ~ =============================================>
// ~ ======= Use payment hook   -->
// ~ =============================================>
const usePayment = (transactionId?: string) => {
  const { user } = useUser();
  const {
    initaited,
    clientSecret,
    elements,
    setInitaited,
    setClientSecret,
    setElements,
  } = paymentStore();

  // ~ ======= Get All User Transactions  -->
  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getAllUserTransactions(user?.id as string),
    enabled: !!user?.id,
    ...cache_12_hours,
  });

  // ~ ======= Get Transaction by id  -->
  const { data: transaction, isLoading: isTransactionLoading } = useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => getTransactionById(transactionId as string),
    enabled: !!transactionId,
    ...cache_12_hours,
  });

  // ~ ======= Get transactions and items  -->
  const {
    data: transactionsAndItems,
    isLoading: isTransactionsAndItemsLoading,
  } = useQuery({
    queryKey: ["transactionsAndItems"],
    queryFn: () => getTransactionsAndItems(user?.id as string),
    enabled: !!user?.id,
    ...cache_12_hours,
  });

  return {
    initaited,
    clientSecret,
    elements,
    setInitaited,
    setClientSecret,
    setElements,
    transactions,
    isTransactionsLoading,
    transaction,
    isTransactionLoading,
    transactionsAndItems,
    isTransactionsAndItemsLoading,
  };
};

export default usePayment;

// ~ =============================================>
// ~ ======= Use Mutate Payments  -->
// ~ =============================================>
export const useMutatePayments = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setInitaited } = paymentStore();

  // ~ ======= Create Transaction  -->
  const { mutate: createTransaction } = useMutation({
    mutationFn: async (args: {
      transaction: typeof transactions.$inferInsert;
      transactionItems: (typeof transactionItems.$inferInsert)[];
    }) => await createNewTransaction(args.transaction, args.transactionItems),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setInitaited(true);
      router.push(`/transactions/${data?.id}/pay`);
    },

    onError: (error) => {
      console.error(error);
      toast.error("Failed to create transaction");
    },
  });

  // ~ ======= Delete Transaction  -->
  const { mutate: deleteTransaction } = useMutation({
    mutationFn: async (transactionId: string) =>
      await deleteTransactionAction(transactionId),

    onSuccess: () => {
      toast.success("Transaction deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },

    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete transaction");
    },
  });

  // ~ ======= Update Transaction  -->
  const { mutate: updateTransaction } = useMutation({
    mutationFn: async (args: {
      transactionId: string;
      updateData: Partial<typeof transactions.$inferSelect>;
    }) => await updateTransactionAction(args.transactionId, args.updateData),

    onSuccess: (data) => {
      toast.success("Transaction updated successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction", data?.id] });
    },

    onError: (error) => {
      console.error(error);
      toast.error("Failed to update transaction");
    },
  });

  return { createTransaction, deleteTransaction, updateTransaction };
};
