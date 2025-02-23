"use server";
import {
  transactionItems,
  transactions,
} from "@/services/db/schema/transaction.schema";
import db from "@/services/db";
import { getSingle } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { products } from "@/services/db/schema/product.schema";

// ~ =============================================>
// ~ ======= Create a transaction  -->
// ~ =============================================>
export const createNewTransaction = async (
  transactionData: typeof transactions.$inferInsert,
  transactionItemsData: (typeof transactionItems.$inferInsert)[],
) => {
  try {
    // ~ ======= Create the transaction  -->
    const transaction = await getSingle(
      db.insert(transactions).values(transactionData).returning(),
    );

    // ~ ======= Add transaction items  -->
    await db.insert(transactionItems).values(
      transactionItemsData.map((item) => ({
        ...item,
        transactionId: transaction?.id as string,
      })),
    );

    return transaction;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create transaction");
  }
};

// ~ =============================================>
// ~ ======= Get all user transactions   -->
// ~ =============================================>
export const getAllUserTransactions = async (userId: string) => {
  return db.select().from(transactions).where(eq(transactions.ownerId, userId));
};

// ~ =============================================>
// ~ ======= Update a transaction  -->
// ~ =============================================>
export const updateTransaction = async (
  transactionId: string,
  updateData: Partial<typeof transactions.$inferSelect>,
) => {
  return await getSingle(
    db
      .update(transactions)
      .set(updateData)
      .where(eq(transactions.id, transactionId))
      .returning(),
  );
};

// ~ =============================================>
// ~ ======= Delete a transaction  -->
// ~ =============================================>
export const deleteTransaction = async (transactionId: string) => {
  return db.delete(transactions).where(eq(transactions.id, transactionId));
};

// ~ =============================================>
// ~ ======= Get transaction by id  -->
// ~ =============================================>
export const getTransactionById = async (transactionId: string) => {
  return await getSingle(
    db.select().from(transactions).where(eq(transactions.id, transactionId)),
  );
};

type TransactionWithItems = {
  id: string;
  status: string;
  amount: number;
  createdAt: string;
  intentId: string | null;
  ownerId: string;
  items: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string | null;
      imageUrl: string;
      price: string | null;
      item: string;
      category: string | null;
      class: string;
      subclass: string | null;
    };
  }[];
};

// ~ =============================================>
// ~ ======= Get transactions and items  -->
// ~ =============================================>
export const getTransactionsAndItems = async (userId: string) => {
  // ~ ======= Get transactions with their items and product data in a single query -->
  const result = await db
    .select({
      id: transactions.id,
      status: transactions.status,
      amount: transactions.amount,
      createdAt: transactions.createdAt,
      intentId: transactions.intentId,
      ownerId: transactions.ownerId,
      items: {
        id: transactionItems.id,
        quantity: transactionItems.quantity,
        product: {
          id: products.id,
          name: products.descriptionShort as unknown as string,
          imageUrl: products.imageUrl,
          price: products.priceEach as unknown as string,
          item: products.item,
          category: products.category as unknown as string,
          class: products.class,
          subclass: products.subclass as unknown as string,
        },
      },
    })
    .from(transactions)
    .leftJoin(
      transactionItems,
      eq(transactions.id, transactionItems.transactionId),
    )
    .leftJoin(products, eq(transactionItems.itemId, products.id))
    .where(eq(transactions.ownerId, userId));

  // ~ ======= Group transactions with their items -->
  const groupedTransactions = result.reduce<
    Record<string, TransactionWithItems>
  >((acc, row: any) => {
    if (!acc[row.id]) {
      acc[row.id] = {
        id: row.id,
        status: row.status,
        amount: row.amount,
        createdAt: row.createdAt,
        intentId: row.intentId,
        ownerId: row.ownerId,
        items: [],
      };
    }
    if (row.items?.id) {
      acc[row.id].items.push({
        id: row.items.id,
        quantity: row.items.quantity,
        product: row.items.product,
      });
    }
    return acc;
  }, {});

  return Object.values(groupedTransactions);
};
