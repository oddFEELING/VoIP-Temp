import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { staff } from "./staff.schema";

// ~ =============================================>
// ~ ======= Enum for topics  -->
// ~ =============================================>
export const messageTopicsEnum = pgEnum("message_topics_enum", [
  "General",
  "Support",
  "Billing",
  "Enquiry",
  "Sales",
  "Other",
]);

// ~ =============================================>
// ~ ======= Table for messages  -->
// ~ =============================================>
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  senderId: uuid("sender_id"),
  senderFirstName: text("sender_first_name").notNull(),
  senderLastName: text("sender_last_name").notNull(),
  senderEmail: text("sender_email").notNull(),
  topic: messageTopicsEnum("topic").notNull().default("General"),
  receiverId: uuid("receiver_id").references(() => staff.id),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});
