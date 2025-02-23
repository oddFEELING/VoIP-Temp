"use client";

import * as React from "react";
import { Heart, Minus, Plus, ShoppingCart, Trash2, XIcon } from "lucide-react";
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
import useProducts, { useProductMutations } from "@/hooks/use-products";
import useUser from "@/hooks/use-user";
import { useMutatePayments } from "@/hooks/use-payment";
import { convertToSubCurrency } from "@/lib/utils";
// ~ =============================================>
// ~ ======= Cart Item Skeleton component for loading state -->
// ~ =============================================>
function CartItemSkeleton() {
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

        {/* ~ ======= Quantity controls skeleton ======= ~ */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-md bg-muted-foreground/20" />
          <Skeleton className="h-6 w-8 bg-muted-foreground/20" />
          <Skeleton className="h-8 w-8 rounded-md bg-muted-foreground/20" />
        </div>

        {/* ~ ======= Remove button skeleton ======= ~ */}
        <Skeleton className="h-8 w-8 rounded-md bg-muted-foreground/20" />
      </div>
      <Separator className="bg-muted-foreground/20" />
    </div>
  );
}

// ~ =============================================>
// ~ ======= Loading state component  -->
// ~ =============================================>
function LoadingState() {
  return (
    <>
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          <CartItemSkeleton />
          <CartItemSkeleton />
          <CartItemSkeleton />
        </div>
      </ScrollArea>
      <div className="space-y-4 pr-4">
        <Separator className="bg-muted-foreground/20" />
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16 bg-muted-foreground/20" />
            <Skeleton className="h-6 w-24 bg-muted-foreground/20" />
          </div>
          <Skeleton className="h-4 w-[250px] bg-muted-foreground/20" />
        </div>
        <Skeleton className="h-10 w-full bg-muted-foreground/20" />
      </div>
    </>
  );
}

// ~ =============================================>
// ~ ======= Empty state component  -->
// ~ =============================================>
function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <ShoppingCart className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-2 text-center">
        <p className="text-lg font-medium">Your cart is empty</p>
        <p className="text-sm text-muted-foreground">
          Add items to your cart to see them here
        </p>
      </div>
      <Button
        variant="outline"
        className="mt-2"
        onClick={() => {
          // We'll need to add state management for this
          window.dispatchEvent(new CustomEvent("open-wishlist"));
        }}
      >
        <Heart className="mr-2 h-4 w-4" />
        View Wishlist
      </Button>
    </div>
  );
}

// ~ =============================================>
// ~ ======= Main Component  -->
// ~ =============================================>
type ComponentProps = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UserCartSheet({ open, onOpenChange }: ComponentProps) {
  const { user, isAnonymous } = useUser();
  const { createTransaction } = useMutatePayments();
  const { userCart, isUserCartLoading } = useProducts();
  const { removeFromCart, updateQuantity, clearCart } = useProductMutations();
  const [showAddressPicker, setShowAddressPicker] = React.useState(false);

  // ~ ======= Calculate total price ======= ~
  const total =
    userCart?.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    ) ?? 0;

  // ~ ======= Determine cart content to render ======= ~
  const renderCartContent = (onCheckout: () => void) => {
    if (isUserCartLoading) return <LoadingState />;
    if (!userCart?.length) return <EmptyState />;

    return (
      <>
        {/* ~ ======= Cart items list ======= ~ */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {userCart?.map((item) => (
              <div key={item.id} className="space-y-3">
                <div className="flex items-center space-x-4">
                  {/* ~ ======= Product image ======= ~ */}
                  <div className="h-16 w-16 overflow-hidden rounded-md border p-2">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* ~ ======= Product details ======= ~ */}
                  <div className="flex flex-1 flex-col">
                    <span className="line-clamp-2 text-sm font-medium">
                      {item.productName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      £{Number(item.price).toFixed(2)}
                    </span>
                  </div>

                  {/* ~ ======= Quantity controls ======= ~ */}
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => {
                        item.quantity > 0 &&
                          updateQuantity({
                            id: item.id,
                            quantity: item.quantity - 1,
                          });

                        item.quantity === 1 && removeFromCart(item.id);
                      }}
                      variant="outline"
                      size="xs-icon"
                    >
                      <Minus size={16} strokeWidth={1.5} />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      onClick={() =>
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity + 1,
                        })
                      }
                      variant="outline"
                      size="xs-icon"
                    >
                      <Plus size={16} strokeWidth={1.5} />
                    </Button>
                  </div>

                  {/* ~ ======= Remove item button ======= ~ */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                    className="h-8 w-8 hover:bg-destructive/80 hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Separator className="bg-muted-foreground/20" />
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* ~ ======= Cart summary and checkout ======= ~ */}
        <div className="space-y-4 pr-4">
          <Separator />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total</span>
              <span className="text-lg font-semibold">
                £{total.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping and taxes will be calculated at checkout
            </p>
          </div>
          <Button
            className="w-full"
            onClick={async () => {
              if (user?.id) {
                createTransaction({
                  transaction: {
                    ownerId: user.id,
                    amount: convertToSubCurrency(Number(total)),
                  },
                  transactionItems: userCart?.map((item) => ({
                    itemId: item.productId,
                    priceAtTime: convertToSubCurrency(Number(item.price)),
                    quantity: item.quantity,
                  })),
                });
              }
            }}
          >
            Checkout
          </Button>
        </div>
      </>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* ~ ======= Cart content ======= ~ */}
      <SheetContent className="my-auto flex h-[95%] w-full flex-col overflow-hidden ring-1 ring-muted-foreground dark:ring-accent/60 sm:max-w-lg md:mr-8 md:rounded-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="flex items-center gap-2 border-b-0">
            <ShoppingCart size={18} strokeWidth={1.5} /> <span>My Cart</span>
          </SheetTitle>
          <Separator />
        </SheetHeader>
        {userCart?.length ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {userCart?.length} items
            </span>

            <Button variant="ghost" size="sm" onClick={() => clearCart()}>
              <XIcon size={16} strokeWidth={1.5} />
              <span>Clear cart</span>
            </Button>
          </div>
        ) : (
          <></>
        )}
        {renderCartContent(() => {
          setShowAddressPicker(true);
        })}
      </SheetContent>
    </Sheet>
  );
}
