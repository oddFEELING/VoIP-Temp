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
      // Transaction fields
      id: transactions.id,
      status: transactions.status,
      amount: transactions.amount,
      createdAt: transactions.createdAt,
      intentId: transactions.intentId,
      ownerId: transactions.ownerId,
      // Item fields
      itemId: transactionItems.id,
      itemQuantity: transactionItems.quantity,
      // Product fields
      productId: products.id,
      productName: products.descriptionShort,
      productImageUrl: products.imageUrl,
      productPrice: products.priceEach,
      productItem: products.item,
      productCategory: products.category,
      productClass: products.class,
      productSubclass: products.subclass,
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
  >((acc, row) => {
    if (!acc[row.id]) {
      acc[row.id] = {
        id: row.id,
        status: row.status as string,
        amount: row.amount as number,
        createdAt: row.createdAt as string,
        intentId: row.intentId as string | null,
        ownerId: row.ownerId as string,
        items: [],
      };
    }
    // Only add item if it exists (left join might return nulls)
    if (row.itemId) {
      // Check if this item is already added to avoid duplicates
      const existingItemIndex = acc[row.id].items.findIndex(
        (item) => item.id === row.itemId,
      );

      if (existingItemIndex === -1) {
        acc[row.id].items.push({
          id: row.itemId,
          quantity: row.itemQuantity as number,
          product: {
            id: row.productId as string,
            name: row.productName as string,
            imageUrl: row.productImageUrl as string,
            price: row.productPrice as string,
            item: row.productItem as string,
            category: row.productCategory as string,
            class: row.productClass as string,
            subclass: row.productSubclass as string,
          },
        });
      }
    }
    return acc;
  }, {});

  return Object.values(groupedTransactions);
};

// ~ =============================================>
// ~ ======= transactions and items by id   -->
// ~ =============================================>
export const getTransactionsAndItemsById = async (transactionId: string) => {
  // ~ ======= Get transaction with its items and product data in a single query -->
  const results = await db
    .select({
      // Transaction fields
      id: transactions.id,
      status: transactions.status,
      amount: transactions.amount,
      createdAt: transactions.createdAt,
      intentId: transactions.intentId,
      ownerId: transactions.ownerId,
      recieverEmail: transactions.recieverEmail,
      recieverFirstName: transactions.recieverFirstName,
      recieverLastName: transactions.recieverLastName,
      recieverPhone: transactions.recieverPhone,
      deliveryAddress: transactions.deliveryAddress,
      // Item fields
      itemId: transactionItems.id,
      itemQuantity: transactionItems.quantity,
      // Product fields
      productId: products.id,
      productName: products.descriptionShort,
      productImageUrl: products.imageUrl,
      productPrice: products.priceEach,
      productItem: products.item,
      productCategory: products.category,
      productClass: products.class,
      productSubclass: products.subclass,
    })
    .from(transactions)
    .leftJoin(
      transactionItems,
      eq(transactions.id, transactionItems.transactionId),
    )
    .leftJoin(products, eq(transactionItems.itemId, products.id))
    .where(eq(transactions.id, transactionId));

  if (!results || results.length === 0) {
    return null;
  }

  // ~ ======= Build the transaction object with all items -->
  const firstRow = results[0];
  const transaction = {
    id: firstRow.id,
    status: firstRow.status,
    amount: firstRow.amount,
    createdAt: firstRow.createdAt,
    intentId: firstRow.intentId,
    ownerId: firstRow.ownerId,
    recieverDetails: {
      email: firstRow.recieverEmail,
      firstName: firstRow.recieverFirstName,
      lastName: firstRow.recieverLastName,
      phone: firstRow.recieverPhone,
      deliveryAddress: firstRow.deliveryAddress,
    },
    items: [] as {
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
    }[],
  };

  // ~ ======= Process all transaction items while avoiding duplicates -->
  const processedItemIds = new Set<string>();

  for (const result of results) {
    if (result.itemId && !processedItemIds.has(result.itemId)) {
      processedItemIds.add(result.itemId);

      transaction.items.push({
        id: result.itemId,
        quantity: result.itemQuantity as number,
        product: {
          id: result.productId as string,
          name: result.productName,
          imageUrl: result.productImageUrl as string,
          price: result.productPrice,
          item: result.productItem as string,
          category: result.productCategory,
          class: result.productClass as string,
          subclass: result.productSubclass,
        },
      });
    }
  }

  return transaction;
};
