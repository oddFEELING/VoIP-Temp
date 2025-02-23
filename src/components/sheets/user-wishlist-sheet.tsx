"use client";

import * as React from "react";
import { Heart, ShoppingCart, Trash2, XIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useWishlist, { useWishlistMutations } from "@/hooks/use-wishlist";
import { useProductMutations } from "@/hooks/use-products";
import useUser from "@/hooks/use-user";
import useProducts from "@/hooks/use-products";
import { generateDiceBearUrl } from "@/lib/utils";
import { useState } from "react";
import UserCartSheet from "@/components/sheets/user-cart-sheet";

// ~ ======= Wishlist Item Skeleton component for loading state ======= ~
function WishlistItemSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        {/* ~ ======= Product image skeleton ======= ~ */}
        <Skeleton className="h-16 w-16 rounded-md bg-muted-foreground/20" />

        {/* ~ ======= Product details skeleton ======= ~ */}
        <div className="flex flex-1 flex-col space-y-2">
          <Skeleton className="h-4 w-[150px] bg-muted-foreground/20" />
          <Skeleton className="h-4 w-[70px] bg-muted-foreground/20" />
        </div>

        {/* ~ ======= Action buttons skeleton ======= ~ */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-md bg-muted-foreground/20" />
          <Skeleton className="h-8 w-8 rounded-md bg-muted-foreground/20" />
        </div>
      </div>
      <Separator className="bg-muted-foreground/20" />
    </div>
  );
}

// ~ ======= Loading State Component ======= ~
function LoadingState() {
  return (
    <ScrollArea className="flex-1 pr-4">
      <div className="space-y-4">
        <WishlistItemSkeleton />
        <WishlistItemSkeleton />
        <WishlistItemSkeleton />
      </div>
    </ScrollArea>
  );
}

// ~ ======= Empty State Component ======= ~
function EmptyState() {
  return (
    <div className="flex h-[450px] flex-col items-center justify-center space-y-2">
      <Heart className="h-12 w-12 text-muted-foreground" />
      <p className="text-lg font-medium">Your wishlist is empty</p>
      <p className="text-sm text-muted-foreground">
        Add items to your wishlist to see them here
      </p>
    </div>
  );
}

type ComponentProps = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UserWishlistSheet({
  open,
  onOpenChange,
}: ComponentProps) {
  const { user } = useUser();
  const { wishlistItems, isLoadingWishlistItems } = useWishlist();
  const { removeFromWishlist, clearUserWishlist } = useWishlistMutations();
  const { addToCart } = useProductMutations();
  const { productList } = useProducts();
  const [showCartSheet, setShowCartSheet] = useState(false);

  // ~ ======= Event listener for opening wishlist from cart ======= ~
  React.useEffect(() => {
    const handleOpenWishlist = () => {
      onOpenChange(true);
    };

    window.addEventListener("open-wishlist", handleOpenWishlist);
    return () =>
      window.removeEventListener("open-wishlist", handleOpenWishlist);
  }, [onOpenChange]);

  // ~ ======= Determine wishlist content to render ======= ~
  const renderWishlistContent = () => {
    if (isLoadingWishlistItems || !productList) return <LoadingState />;
    if (!wishlistItems?.length) return <EmptyState />;

    return (
      <div className="space-y-4">
        {wishlistItems?.map((item) => {
          const product = productList.find((p) => p.id === item.productId);
          if (!product) return null;

          return (
            <div key={item.id} className="space-y-3">
              <div className="flex items-center space-x-4">
                {/* ~ ======= Product image ======= ~ */}
                <div className="h-16 w-16 overflow-hidden rounded-md border p-2">
                  <img
                    src={
                      product.imageUrl ||
                      generateDiceBearUrl(product.item as string)
                    }
                    alt={
                      product.descriptionShort ||
                      product.item ||
                      "Product image"
                    }
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* ~ ======= Product details ======= ~ */}
                <div className="flex flex-1 flex-col">
                  <span className="line-clamp-2 text-sm font-medium">
                    {product.descriptionShort}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    £{Number(product.priceEach).toFixed(2)}
                  </span>
                </div>

                {/* ~ ======= Action buttons ======= ~ */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      addToCart({
                        ownerId: user!.id,
                        productId: product.id,
                        productName: product.descriptionShort!,
                        price: product.priceEach!,
                        productImage:
                          product.imageUrl ||
                          generateDiceBearUrl(product.item as string),
                        quantity: 1,
                      });
                      removeFromWishlist(item.id);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromWishlist(item.id)}
                    className="h-8 w-8 hover:bg-destructive/80 hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Separator className="bg-muted-foreground/20" />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        {/* ~ ======= Wishlist content ======= ~ */}
        <SheetContent className="my-auto flex h-[95%] w-full flex-col overflow-hidden p-4 ring-1 ring-muted-foreground dark:ring-accent/60 sm:max-w-lg md:mr-8 md:rounded-lg">
          <SheetHeader className="space-y-2.5">
            <SheetTitle className="flex items-center gap-2 border-b-0">
              <Heart size={18} strokeWidth={1.5} /> <span>My Wishlist</span>
            </SheetTitle>
            <Separator />
          </SheetHeader>

          <div className="py-2">
            {wishlistItems?.length ? (
              <span className="text-sm text-muted-foreground">
                {wishlistItems?.length} items
              </span>
            ) : null}
          </div>

          {/* ~ ======= Main content area with scroll ======= ~ */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {renderWishlistContent()}
            </ScrollArea>
          </div>

          {/* ~ ======= Footer Actions ======= ~ */}
          {wishlistItems?.length ? (
            <div className="mt-auto pt-4">
              <Separator />
              <div className="flex items-center gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    onOpenChange(false);
                    setShowCartSheet(true);
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Cart
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    clearUserWishlist();
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Wishlist
                </Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
      <UserCartSheet open={showCartSheet} onOpenChange={setShowCartSheet} />
    </>
  );
}
