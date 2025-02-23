"use client";

import {
  addProductToWishlist,
  getUserWishlistItems,
  removeProductFromWishlist,
  clearUserWishlist as clearUserWishlistAction,
} from "@/actions/product.actions";
import useUser from "@/hooks/use-user";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { cache_6_hours } from "./cache-info";
import { wishlistItems } from "@/services/db/schema/wishlist.schema";
import { appLogger } from "@/lib/logger";
import { toast } from "sonner";

// ~ =============================================>
// ~ ======= Use wishlist  -->
// ~ =============================================>
const useWishlist = () => {
  const { user } = useUser();

  // ~ ======= Get wishlist items  -->
  const { data: wishlistItems, isLoading: isLoadingWishlistItems } = useQuery({
    queryKey: ["wishlist-items"],
    queryFn: () => getUserWishlistItems(user!.id),
    enabled: !!user?.id,
    ...cache_6_hours,
    refetchOnReconnect: true,
  });

  return {
    wishlistItems,
    isLoadingWishlistItems,
  };
};

export default useWishlist;

// ~ =============================================>
// ~ ======= Handle mutations  -->
// ~ =============================================>
export const useWishlistMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  // ~ ======= Add item to wishlist  -->
  const { mutate: addToWishlist } = useMutation({
    mutationFn: async (productData: typeof wishlistItems.$inferInsert) =>
      await addProductToWishlist(productData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist-items"],
      });
      toast.success("Item added to wishlist");
    },

    onError: (error) => {
      appLogger.error(error);
      toast.error("Failed to add to wishlist");
    },
  });

  // ~ ======= Remove item from wishlist  -->
  const { mutate: removeFromWishlist } = useMutation({
    mutationFn: async (productId: string) =>
      await removeProductFromWishlist(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist-items"],
      });
      toast.success("Item removed from wishlist");
    },

    onError: (error) => {
      appLogger.error(error);
      toast.error("Failed to remove from wishlist");
    },
  });

  // ~ ======= Clear user wishlist  -->
  const { mutate: clearUserWishlist } = useMutation({
    mutationFn: async () => await clearUserWishlistAction(user!.id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist-items"],
      });
      toast.success("Wishlist cleared");
    },

    onError: (error) => {
      appLogger.error(error);
      toast.error("Failed to clear wishlist");
    },
  });

  return {
    addToWishlist,
    removeFromWishlist,
    clearUserWishlist,
  };
};
