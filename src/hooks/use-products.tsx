"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProductToCart,
  clearUserCart,
  getProductById,
  getProductList,
  getUserCartItems,
  removeProductFromCart,
  updateProductQuantity,
} from "@/actions/product.actions";
import { cartItems } from "@/schemas/cart.schema";
import useUser from "@/hooks/use-user";
import { cache_6_hours } from "@/hooks/cache-info";
import { toast } from "sonner";
import { appLogger } from "@/lib/logger";

// ~ =============================================>
// ~ ======= Main hook for products  -->
// ~ =============================================>
const useProducts = (productId?: string) => {
  const { user } = useUser();
  // ~ ======= get products -->
  const { data: productList, isLoading: isLoadingProductList } = useQuery({
    queryKey: ["product-list"],
    queryFn: () => getProductList(),
  });

  // ~ ======= Get cart items  -->
  const { data: userCart, isLoading: isUserCartLoading } = useQuery({
    queryKey: ["cart-items"],
    queryFn: () => getUserCartItems(user!.id),
    enabled: !!user?.id,
    ...cache_6_hours,
    refetchOnReconnect: true,
  });

  // ~ ======= Get product by id  -->
  const { data: productById, isLoading: isProductByIdLoading } = useQuery({
    queryKey: ["product-by-id", productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId,
    ...cache_6_hours,
    refetchOnReconnect: true,
  });

  return {
    productList,
    isLoadingProductList,
    userCart,
    isUserCartLoading,
    productById,
    isProductByIdLoading,
  };
};

export default useProducts;

// ~ =============================================>
// ~ ======= Handle mutations  -->
// ~ =============================================>
export const useProductMutations = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // ~ ======= Add item to cart -->
  const { mutate: addToCart } = useMutation({
    mutationFn: async (productData: typeof cartItems.$inferInsert) =>
      await addProductToCart(productData),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["cart-items"],
      });
      toast.success(`Added ${data?.productName} to cart`);
    },

    onError: (error) => {
      appLogger.error(error);
      toast.error("Failed to add to cart");
    },
  });

  // ~ ======= Remove item from cart -->
  const { mutate: removeFromCart } = useMutation({
    mutationFn: async (productId: string) =>
      await removeProductFromCart(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart-items"],
      });
      toast.info(`Item removed from cart`);
    },

    onError: (error) => {
      appLogger.error(error);
      toast.error("Failed to remove from cart");
    },
  });

  // ~ ======= Update product quantity -->
  const { mutate: updateQuantity } = useMutation({
    mutationFn: async (args: { id: string; quantity: number }) =>
      await updateProductQuantity(args.id, args.quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart-items"],
      });
    },

    onError: (error) => {
      appLogger.error(error);
      toast.error("Failed to update quantity");
    },
  });

  // ~ ======= Clear user cart -->
  const { mutate: clearCart } = useMutation({
    mutationFn: async () => await clearUserCart(user!.id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart-items"],
      });
      toast.success("Cart cleared");
    },

    onError: (error) => {
      appLogger.error(error);
      toast.error("Failed to clear cart");
    },
  });

  return { addToCart, removeFromCart, updateQuantity, clearCart };
};
