"use server";

import { getSingle } from "@/lib/utils";
import db from "@/services/db";
import { userAddresses } from "@/services/db/schema/address.schema";
import { eq } from "drizzle-orm";
import { profiles } from "@/services/db/schema/profiles.schema";
// ~ =============================================>
// ~ ======= Create user profile  -->
// ~ =============================================>
export const createUserProfile = async (user: typeof profiles.$inferInsert) => {
  return await getSingle(db.insert(profiles).values(user).returning());
};

// ~ =============================================>
// ~ ======= Create Address  -->
// ~ =============================================>
export const createAddress = async (
  address: typeof userAddresses.$inferInsert,
) => {
  return await getSingle(db.insert(userAddresses).values(address).returning());
};

// ~ =============================================>
// ~ ======= Get Addresses  -->
// ~ =============================================>
export const getAddresses = async (userId: string) => {
  return db
    .select()
    .from(userAddresses)
    .where(eq(userAddresses.userId, userId));
};

// ~ =============================================>
// ~ ======= Update User Address  -->
// ~ =============================================>
export const updateAddress = async (
  addressId: string,
  address: Partial<typeof userAddresses.$inferSelect>,
) => {
  return await getSingle(
    db
      .update(userAddresses)
      .set(address)
      .where(eq(userAddresses.id, addressId))
      .returning(),
  );
};

// ~ =============================================>
// ~ ======= Delete Address  -->
// ~ =============================================>
export const deleteAddress = async (addressId: string) => {
  return await getSingle(
    db.delete(userAddresses).where(eq(userAddresses.id, addressId)),
  );
};
