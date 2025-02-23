"use server";

import { cartItems } from "@/schemas/cart.schema";
import db from "@/services/db";
import { desc, eq, and } from "drizzle-orm";
import { getSingle } from "@/lib/utils";
import { products } from "@/schemas/product.schema";
import { wishlistItems } from "@/services/db/schema/wishlist.schema";

// ~ =============================================>
// ~ ======= Get product list  -->
// ~ =============================================>
export const getProductList = async () => {
  return db.select().from(products);
};

// ~ =============================================>
// ~ ======= Add product to cart  -->
// ~ =============================================>
export const addProductToCart = async (
  product: typeof cartItems.$inferInsert,
) => {
  if (!product.productId || !product.ownerId) {
    throw new Error("Product ID and Owner ID are required");
  }

  // ~ ======= Check if product already exists in cart ======= ~
  const existingItem = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.productId, product.productId),
        eq(cartItems.ownerId, product.ownerId),
      ),
    );

  // ~ ======= If product exists, update quantity ======= ~
  if (existingItem.length > 0) {
    return await getSingle(
      db
        .update(cartItems)
        .set({
          quantity: existingItem[0].quantity + product.quantity,
        })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning(),
    );
  }

  // ~ ======= If product doesn't exist, create new cart item ======= ~
  return await getSingle(db.insert(cartItems).values(product).returning());
};

// ~ =============================================>
// ~ ======= Get user cart items   -->
// ~ =============================================>
export const getUserCartItems = async (userId: string) => {
  return await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.ownerId, userId))
    .orderBy(desc(cartItems.createdAt));
};

// ~ =============================================>
// ~ ======= Get product by id  -->
// ~ =============================================>
export const getProductById = async (productId: string) => {
  return await getSingle(
    db.select().from(products).where(eq(products.id, productId)),
  );
};

// ~ =============================================>
// ~ ======= Remove product from cart  -->
// ~ =============================================>
export const removeProductFromCart = async (productId: string) => {
  return db.delete(cartItems).where(eq(cartItems.id, productId));
};

// ~ =============================================>
// ~ ======= Update product quantity  -->
// ~ =============================================>
export const updateProductQuantity = async (
  productId: string,
  quantity: number,
) => {
  return await getSingle(
    db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, productId))
      .returning(),
  );
};

// ~ =============================================>
// ~ ======= Clear user cart  -->
// ~ =============================================>
export const clearUserCart = async (userId: string) => {
  return db.delete(cartItems).where(eq(cartItems.ownerId, userId));
};

// ~ =============================================>
// ~ ======= Add product to wishlist  -->
// ~ =============================================>
export const addProductToWishlist = async (
  product: typeof wishlistItems.$inferInsert,
) => {
  return await getSingle(db.insert(wishlistItems).values(product).returning());
};

// ~ =============================================>
// ~ ======= Get user wishlist items  -->
// ~ =============================================>
export const getUserWishlistItems = async (userId: string) => {
  return await db
    .select()
    .from(wishlistItems)
    .where(eq(wishlistItems.ownerId, userId))
    .orderBy(desc(wishlistItems.createdAt));
};

// ~ =============================================>
// ~ ======= Remove product from wishlist  -->
// ~ =============================================>
export const removeProductFromWishlist = async (productId: string) => {
  return db.delete(wishlistItems).where(eq(wishlistItems.id, productId));
};

// ~ =============================================>
// ~ ======= Clear user wishlist  -->
// ~ =============================================>
export const clearUserWishlist = async (userId: string) => {
  await db.delete(wishlistItems).where(eq(wishlistItems.ownerId, userId));

  return {
    success: true,
    message: "Wishlist cleared",
  };
};
