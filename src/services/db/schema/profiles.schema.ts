import { sql } from "drizzle-orm";
import {
  boolean,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// ~ =============================================>
// ~ ======= Tables  -->
// ~ =============================================>
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    isActive: boolean("is_active").notNull().default(true),
    imageUrl: text(),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },

  // ~ =============================================>
  // ~ ======= RLS Policies  -->
  // ~ =============================================>
  () => [
    // ~ ======= Insert policy -->
    pgPolicy("Enable insert for authenticated users only", {
      as: "permissive",
      to: "authenticated",
      for: "insert",
      withCheck: sql`true`,
    }),

    // ~ ======= Select policy -->
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      to: "public",
      for: "select",
      withCheck: sql`true`,
    }),

    // ~ ======= Update policy -->
    pgPolicy("Enable update for users based on email", {
      as: "permissive",
      to: "authenticated",
      for: "update",
      using: sql`(auth.jwt() ->> 'email')::text = email`,
      withCheck: sql`(auth.jwt() ->> 'email')::text = email`,
    }),
  ],
).enableRLS();
