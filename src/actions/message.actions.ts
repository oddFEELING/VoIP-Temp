"use server";

import { getSingle } from "@/lib/utils";
import { messages } from "@/schemas/message.schema";
import db from "@/services/db";
import { eq } from "drizzle-orm";

// ~ =============================================>
// ~ ======= Get all messages  -->
// ~ =============================================>
export const getAllMessages = async () => {
  return await db.select().from(messages);
};

// ~ =============================================>
// ~ ======= Get all messages by receiver id  -->
// ~ =============================================>
export const getAllMessagesByReceiverId = async (receiverId: string) => {
  return db.select().from(messages).where(eq(messages.receiverId, receiverId));
};

// ~ =============================================>
// ~ ======= Get All messages by sender id  -->
// ~ =============================================>
export const getAllMessagesBySenderId = async (senderId: string) => {
  return db.select().from(messages).where(eq(messages.senderId, senderId));
};

// ~ =============================================>
// ~ ======= Create message  -->
// ~ =============================================>
export const createMessage = async (message: typeof messages.$inferInsert) => {
  return await getSingle(db.insert(messages).values(message).returning());
};

// ~ =============================================>
// ~ ======= Update message      -->
// ~ =============================================>
export const updateMessage = async (
  messageId: string,
  updateContent: Partial<typeof messages.$inferSelect>,
) => {
  return await getSingle(
    db
      .update(messages)
      .set(updateContent)
      .where(eq(messages.id, messageId))
      .returning(),
  );
};

// ~ =============================================>
// ~ ======= Delete message  -->
// ~ =============================================>
export const deleteMessage = async (messageId: string) => {
  return await db.delete(messages).where(eq(messages.id, messageId));
};
