import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { products } from "@/schemas/product.schema";

// ~ =============================================>
// ~ ======= Enums  -->
// ~ =============================================>
export const transactionStatus = pgEnum("transaction_status", [
  "pending",
  "succeeded",
  "failed",
  "cancelled",
]);

// ~ =============================================>
// ~ ======= Table Definition -->
// ~ =============================================>
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  intentId: text("intent_id").unique(),
  ownerId: uuid("owner_id").notNull(),
  paymentIntentClientSecret: text("payment_intent_client_secret").unique(),
  amount: integer("amount").notNull(),
  deliveryAddress: jsonb("delivery_address").$type<{
    HouseNumber: string;
    address: string;
    city: string;
    state: string;
    postCode: string;
  }>(),
  status: transactionStatus("payment_status").default("pending"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// ~ =============================================>
// ~ ======= Transaction Items Junction Table -->
// ~ =============================================>
export const transactionItems = pgTable("transaction_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  transactionId: uuid("transaction_id").references(() => transactions.id, {
    onDelete: "cascade",
  }),
  itemId: uuid("item_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").notNull().default(1),
  priceAtTime: integer("price_at_time").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
