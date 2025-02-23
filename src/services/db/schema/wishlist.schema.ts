import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { products } from "./product.schema";

// ~ =============================================>
// ~ ======= Table  -->
// ~ =============================================>
export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => products.id),
  ownerId: uuid("owner_id").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
