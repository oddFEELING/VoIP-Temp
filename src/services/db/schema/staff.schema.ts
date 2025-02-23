import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// ~ =============================================>
// ~ ======= Enums  -->
// ~ =============================================>
export const staffRoleEnums = pgEnum("staff_roles", [
  "admin",
  "manager",
  "staff",
  "developer",
]);

// ~ =============================================>
// ~ ======= Table for staff  -->
// ~ =============================================>
export const staff = pgTable("staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  image: text("image").notNull(),
  role: staffRoleEnums("role").default("staff"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
