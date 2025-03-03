import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { profiles } from "@/services/db/schema/profiles.schema";

// ~ =============================================>
// ~ ======= Tables  -->
// ~ =============================================>
export const userAddresses = pgTable("user_addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id),
  houseNumber: text("house_number").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postCode: text("post_code").notNull(),
  country: text("country").notNull(),
});
