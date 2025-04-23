"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Fullscreen,
  History,
  Search,
  ShoppingCart,
  Sparkles,
  Heart,
  Router,
} from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import useProducts, { useProductMutations } from "@/hooks/use-products";
import useUser from "@/hooks/use-user";
import { EmptyState } from "@/components/ui/empty-state";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { ProductFilters, ProductFilterSheet } from "./product-filters";
import ProductInfoDialog from "@/components/dialogs/product-info-dialog";
import { convertToSubCurrency, generateDiceBearUrl } from "@/lib/utils";
import { ProductPagination } from "./product-pagination";
import ImageDisplayDialog from "@/components/dialogs/image-display-dialog";
import { products as Product } from "@/schemas/product.schema";
import useWishlist, { useWishlistMutations } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useMutatePayments } from "@/hooks/use-payment";
import { toast } from "sonner";

// ~ ======= Animation variants ======= ~
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// ~ ======= Content Variants ======= ~
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.6,
      stiffness: 100,
      damping: 15,
    },
  },
};

// ~ ======= Recent searches mock data ======= ~
const recentSearches = [
  "Cisco AT",
  "Yealink CP965",
  "Conference Phone",
  "Wireless Headset",
  "Bluetooth",
  "USB",
];

// ~ =============================================>
// ~ ======= Product Skeleton Component ======= ~
// ~ =============================================>
const ProductSkeleton = () => {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      {/* ~ ======= Product Image Skeleton ======= ~ */}
      <div className="relative w-full">
        <Skeleton className="aspect-[3/2] w-full bg-muted-foreground/30 dark:bg-muted" />
      </div>

      {/* ~ ======= Product Info Skeleton ======= ~ */}
      <div className="flex flex-col space-y-2 p-3">
        <Skeleton className="h-4 w-20 bg-muted-foreground/20 dark:bg-muted" />
        <Skeleton className="h-4 w-full bg-muted-foreground/20 dark:bg-muted" />
        <Skeleton className="h-4 w-3/4 bg-muted-foreground/20 dark:bg-muted" />

        {/* ~ ======= Price and Actions Skeleton ======= ~ */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <Skeleton className="h-6 w-20 bg-muted-foreground/20 dark:bg-muted" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8 bg-muted-foreground/20 dark:bg-muted" />
            <Skeleton className="h-8 w-16 bg-muted-foreground/20 dark:bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductList = () => {
  const [showSearchSuggestions, setShowSearchSuggestions] =
    React.useState(false);
  const { user } = useUser();
  const { addToCart } = useProductMutations();
  const { wishlistItems } = useWishlist();
  const { addToWishlist, removeFromWishlist } = useWishlistMutations();
  const searchRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const { createTransaction } = useMutatePayments();
  const [setSelectedProductForBuy] = React.useState<any>(null);

  const { productList, isLoadingProductList } = useProducts();
  const [products, setProducts] = React.useState<
    (typeof Product.$inferSelect)[]
  >([]);
  const [showProductInfoDialog, setShowProductInfoDialog] =
    React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<
    typeof Product.$inferSelect | null
  >(null);
  const [showImageDisplayDialog, setShowImageDisplayDialog] =
    React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");

  // ~ ======= Query States START ======= ~
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });
  const [minPrice, setMinPrice] = useQueryState(
    "minPrice",
    parseAsInteger.withDefault(0),
  );
  const [imageFilter] = useQueryState("imageFilter", {
    defaultValue: "all",
  });
  const [maxPrice, setMaxPrice] = useQueryState(
    "maxPrice",
    parseAsInteger.withDefault(999999),
  );
  const [brand, setBrand] = useQueryState("brand", {
    defaultValue: "all",
  });
  const [availability, setAvailability] = useQueryState("availability", {
    defaultValue: "all",
  });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [itemsPerPage] = React.useState(18);

  // ~ ======= Filtered Products ======= ~
  const filteredProducts = React.useMemo(() => {
    if (!productList) return [];
    return (
      productList
        // @ts-ignore
        .filter((product: Product) => {
          // ~ ======= Text Search Filter ======= ~
          if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
              product.descriptionShort.toLowerCase().includes(searchLower) ||
              product.description.toLowerCase().includes(searchLower) ||
              product.class.toLowerCase().includes(searchLower) ||
              product.item.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;
          }

          // ~ ======= Price Filter ======= ~
          if (minPrice !== 0 || maxPrice !== 999999) {
            if (
              Number(product.priceEach) < minPrice ||
              Number(product.priceEach) > maxPrice
            ) {
              return false;
            }
          }

          // ~ ======= Brand Filter ======= ~
          if (brand !== "all") {
            if (product.class !== brand) {
              return false;
            }
          }

          // ~ ======= Availability Filter ======= ~
          if (availability !== "all") {
            if (product.availability !== availability) {
              return false;
            }
          }

          // ~ ======= Image Filter ======= ~
          if (imageFilter !== "all") {
            if (!product.imageUrl && imageFilter === "with-image") {
              return false;
            }
            if (product.imageUrl && imageFilter === "without-image") {
              return false;
            }
          }
          return true;
        })
    );
  }, [
    productList,
    minPrice,
    maxPrice,
    brand,
    availability,
    imageFilter,
    searchQuery,
  ]);

  // ~ ======= Pagination calculations ======= ~
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

  // ~ ======= Paginated Products ======= ~
  useEffect(() => {
    const paginatedProducts = filteredProducts.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage,
    );
    setProducts(paginatedProducts);
  }, [filteredProducts, page, itemsPerPage]);

  // ~ ======= Handle page overflow ======= ~
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page, setPage]);

  // ~ ======= Query States END ======= ~

  // ~ ======= Handle click outside search suggestions ======= ~
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ~ ======= Scroll to top on page change ======= ~
  useEffect(() => {
    if (gridRef.current) {
      const yOffset = -200; // Offset to account for navbar height and some padding
      const element = gridRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [page]);

  const handleBuyNow = (product: any) => {
    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    setSelectedProductForBuy(product);
    createTransaction({
      transaction: {
        ownerId: user.id,
        amount: convertToSubCurrency(Number(product.priceEach)), // Convert to cents for Stripe
      },
      transactionItems: [
        {
          itemId: product.id,
          quantity: 1,
          priceAtTime: product.priceEach,
        },
      ],
    });
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="container mx-auto max-w-[85rem] space-y-8 py-8 pt-32"
    >
      {/* ~ ======= Header Section ======= ~ */}
      <motion.div
        variants={contentVariants}
        className="mb-8 space-y-4 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-primary dark:text-secondary md:text-5xl">
          VoIP Products
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
          Discover our comprehensive range of VoIP solutions, from
          enterprise-grade phones to cutting-edge accessories
        </p>
      </motion.div>

      {/* ~ ======= Search Section ======= ~ */}
      <motion.div variants={contentVariants} className="mb-8 px-4 md:px-0">
        <div className="relative mx-auto w-full max-w-2xl" ref={searchRef}>
          <div className="relative flex w-full flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-10 bg-muted pl-12 pr-4 text-base shadow-sm transition-shadow duration-200 focus:shadow-md sm:h-12 sm:text-lg"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
              />
            </div>
            <Button
              className="h-10 w-full shadow-sm sm:h-12 sm:w-auto sm:px-8"
              onClick={() => {
                setSearchQuery(searchQuery);
                setShowSearchSuggestions(false);
              }}
            >
              Search
            </Button>
          </div>

          {/* ~ ======= Search Suggestions ======= ~ */}
          {showSearchSuggestions && (
            <Card className="absolute top-full z-30 mt-2 w-full divide-y divide-border bg-background/95 p-0 shadow-xl ring-2 ring-primary/30 backdrop-blur-lg dark:bg-background/95 dark:ring-secondary/30">
              {/* ~ ======= Recent Searches ======= ~ */}
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <History className="h-4 w-4" />
                    <span className="font-medium">Recent Searches</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-muted-foreground"
                  >
                    Clear History
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      className="h-7 rounded-md border-primary/20 bg-background px-3 text-xs hover:bg-accent dark:border-secondary/20"
                      onClick={() => {
                        setSearchQuery(search);
                        setShowSearchSuggestions(false);
                      }}
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>

              {/* ~ ======= Popular Searches ======= ~ */}
              <div className="p-4">
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">Popular Searches</span>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {recentSearches.slice(0, 4).map((search) => (
                    <Button
                      key={search}
                      variant="ghost"
                      size="sm"
                      className="h-8 justify-start px-2 text-sm"
                      onClick={() => {
                        setSearchQuery(search);
                        setShowSearchSuggestions(false);
                      }}
                    >
                      <Search className="mr-2 h-3 w-3" />
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </motion.div>

      <div className="relative flex w-full flex-col gap-8 px-4 lg:flex-row">
        {/* ~ ======= Mobile Filters ======= ~ */}
        <div className="sticky top-20 z-20 -mx-4 px-4 py-2 lg:hidden">
          <ProductFilterSheet
            isLoadingProductList={isLoadingProductList}
            productsExist={products.length > 0}
            paginationInfo={
              products.length > 0
                ? {
                    startIndex,
                    endIndex,
                    totalItems,
                    currentPage: page,
                    totalPages,
                  }
                : undefined
            }
          />
        </div>

        {/* ~ ======= Desktop Filters Section ======= ~ */}
        <motion.div
          variants={contentVariants}
          className="hidden lg:block lg:w-[240px]"
        >
          <ProductFilters
            isLoadingProductList={isLoadingProductList}
            productsExist={products.length > 0}
            paginationInfo={
              products.length > 0
                ? {
                    startIndex,
                    endIndex,
                    totalItems,
                    currentPage: page,
                    totalPages,
                  }
                : undefined
            }
          />
        </motion.div>

        {/* ~ ======= Products Grid Section ======= ~ */}
        <motion.div ref={gridRef} variants={contentVariants} className="flex-1">
          {/* ~ ======= Loading State ======= ~ */}
          {isLoadingProductList && (
            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          )}

          {/* ~ ======= Empty State ======= ~ */}
          {products.length === 0 && !isLoadingProductList && (
            <div className="mb-10">
              <EmptyState
                title="No Products Found"
                message="We couldn't find any products matching your criteria. Try adjusting your filters or search terms."
                action={{
                  label: "Clear Filters",
                  onClick: () => {
                    setSearchQuery("");
                    setMinPrice(0);
                    setMaxPrice(999999);
                    setBrand("all");
                    setAvailability("all");
                  },
                }}
              />
            </div>
          )}

          {/* ~ ======= Products Grid ======= ~ */}
          {!isLoadingProductList && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
                {products.map((product) => (
                  <div
                    key={product.item}
                    className="group flex flex-col overflow-hidden rounded-lg border border-muted-foreground/20 bg-card transition-all duration-200 hover:shadow-lg hover:ring-1 hover:ring-primary/30 dark:hover:ring-accent"
                  >
                    {/* ~ ======= Product Image ======= ~ */}
                    <div className="relative w-full">
                      <div className="aspect-[3/2] w-full overflow-hidden bg-muted">
                        <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted bg-white p-8">
                          <AspectRatio
                            ratio={3 / 2}
                            className="h-full w-full overflow-hidden rounded-lg"
                          >
                            <Image
                              src={
                                product.imageUrl ||
                                generateDiceBearUrl(product.item!)
                              }
                              alt={product.imageUrl}
                              fill
                              priority
                              className="object-fill"
                            />
                          </AspectRatio>
                        </div>
                        {/* ~ ======= Image Hover Overlay ======= ~ */}
                        <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          {product.imageUrl && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="relative z-10 h-8 w-8 rounded-md bg-background/80 backdrop-blur-sm"
                              onClick={() => {
                                setImageUrl(product.imageUrl);
                                setShowImageDisplayDialog(true);
                              }}
                            >
                              <Fullscreen size={16} strokeWidth={1.3} />
                            </Button>
                          )}
                        </div>
                      </div>
                      {/* ~ ======= Stock Badge ======= ~ */}
                      <div className="absolute right-2 top-2">
                        {product.availability === "eol" && (
                          <span
                            className={`rounded-md bg-secondary/10 px-2 py-1 text-xs text-secondary`}
                          >
                            End of Life (EOL)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ~ ======= Product Info ======= ~ */}
                    <div className="flex flex-col p-4">
                      {/* ~ ======= Brand ======= ~ */}
                      <span className="text-xs font-medium text-muted-foreground">
                        {product.class}
                      </span>

                      {/* ~ ======= Product Name ======= ~ */}
                      <h3 className="line-clamp-1 text-base font-semibold tracking-wide">
                        {product.descriptionShort}
                      </h3>

                      {/* ~ ======= Product Description ======= ~ */}
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {product.description}
                      </p>

                      {/* ~ ======= Price and Actions ======= ~ */}
                      <div className="mt-5 flex items-center justify-between gap-2">
                        <p className="text-lg font-semibold">
                          £{Number(product.retailPrice).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              const isInWishlist = wishlistItems?.some(
                                (item) => item.productId === product.id,
                              );

                              if (isInWishlist && wishlistItems) {
                                const wishlistItem = wishlistItems.find(
                                  (item) => item.productId === product.id,
                                );
                                if (wishlistItem) {
                                  removeFromWishlist(wishlistItem.id);
                                }
                              } else {
                                addToWishlist({
                                  ownerId: user!.id,
                                  productId: product.id,
                                });
                              }
                            }}
                            disabled={product.availability === "eol"}
                          >
                            <Heart
                              className={cn(
                                "h-4 w-4 transition-colors duration-200",
                                wishlistItems?.some(
                                  (item) => item.productId === product.id,
                                )
                                  ? "fill-primary text-primary dark:fill-secondary dark:text-secondary"
                                  : "",
                              )}
                            />
                          </Button>
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
                            }}
                            disabled={product.availability === "eol"}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            disabled={product.availability === "eol"}
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowProductInfoDialog(true);
                            }}
                          >
                            View more
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => handleBuyNow(product)}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ~ ======= Pagination ======= ~ */}
              <ProductPagination
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                gridRef={gridRef}
              />
            </>
          )}

          {/* ~ ======= Product Info Dialog ======= ~ */}
          {productList && (
            <ProductInfoDialog
              open={showProductInfoDialog}
              onOpenChange={setShowProductInfoDialog}
              product={selectedProduct || productList[0]}
            />
          )}

          {/* ~ ======= Image Display Dialog ======= ~ */}
          <ImageDisplayDialog
            open={showImageDisplayDialog}
            onOpenChange={setShowImageDisplayDialog}
            imageUrl={imageUrl}
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProductList;

// ~ ======= Sample addresses for the address picker dialog ======= ~
const sampleAddresses = [
  {
    HouseNumber: "123",
    address: "123 Main St",
    city: "London",
    state: "London",
    postCode: "EC1A 1BB",
  },
  {
    HouseNumber: "456",
    address: "456 High St",
    city: "Manchester",
    state: "Manchester",
    postCode: "M1 1AA",
  },
  {
    HouseNumber: "789",
    address: "789 Queen St",
    city: "Edinburgh",
    state: "Edinburgh",
    postCode: "EH1 1AA",
  },
];
