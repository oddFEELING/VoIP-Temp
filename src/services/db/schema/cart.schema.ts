import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { products } from "./product.schema";

// ~ =============================================>
// ~ ======= Tables -->
// ~ =============================================>
export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  ownerId: uuid("owner_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price").notNull(),
  productName: text("product_name").notNull(),
  productImage: text("product_image").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
