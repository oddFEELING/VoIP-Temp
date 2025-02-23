import {
  boolean,
  decimal,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/* ~ =================================== ~ */
/* -- Product table schema definition -- */
/* -- Contains all product information including details, pricing, and inventory -- */
/* ~ =================================== ~ */
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Basic product information
  item: varchar("item", { length: 255 }).unique(),
  webName: text("web_name"),
  descriptionShort: text("description_short"),
  descriptionLong: text("description_long"),
  description: text("description"),

  // Classification
  class: text("class").notNull(),
  subclass: text("subclass"),
  category: text("category"),

  // Pricing
  retailPrice: decimal("retail_price", { precision: 10, scale: 2 }),
  priceEach: decimal("price_each", { precision: 10, scale: 2 }),

  // Inventory and stock
  freeStock: text("free_stock"),
  weight: text("weight"),
  availability: text("availability"),
  inStock: boolean("in_stock").default(false),

  // Product identifiers
  ean: text("ean"),
  mpn: text("mpn"),

  // Product details
  accessory: text("accessory"),
  virtual: text("virtual"),
  psuItem: text("psu_item"),
  features: text("features"),
  boxContents: text("box_contents"),
  imageUrl: text("image_url").notNull(),

  //   Timestamp
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
