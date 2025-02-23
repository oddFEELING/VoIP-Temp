"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { parseAsInteger, useQueryState } from "nuqs";
import { PaginationInfo, type PaginationInfoProps } from "./product-pagination";

// ~ ======= Types for the component ======= ~
interface ProductFiltersProps {
  isLoadingProductList: boolean;
  productsExist: boolean;
  paginationInfo?: PaginationInfoProps;
}

// ~ =============================================>
// ~ ======= Desktop Product Filters Component ======= ~
// ~ =============================================>
const ProductFilters: React.FC<ProductFiltersProps> = ({
  isLoadingProductList,
  productsExist,
  paginationInfo,
}) => {
  // ~ ======= Query States -->
  const [minPrice, setMinPrice] = useQueryState(
    "minPrice",
    parseAsInteger.withDefault(0),
  );
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
  const [imageFilter, setImageFilter] = useQueryState("imageFilter", {
    defaultValue: "all",
  });
  const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });

  // ~ ======= Handle price change -->
  const handlePriceChange = (value: string) => {
    const [min, max] = value.split("_").map(Number);
    setMinPrice(min);
    setMaxPrice(max);
    setPage(1);
  };

  // ~ ======= Handle brand change -->
  const handleBrandChange = (value: string) => {
    setBrand(value);
    setPage(1);
  };

  // ~ ======= Handle availability change -->
  const handleAvailabilityChange = (value: string) => {
    setAvailability(value);
    setPage(1);
  };

  // ~ ======= Handle image filter change -->
  const handleImageFilterChange = (value: string) => {
    setImageFilter(value);
    setPage(1);
  };

  // ~ ======= Handle clear filters -->
  const handleClearFilters = () => {
    setSearchQuery("");
    setMinPrice(0);
    setMaxPrice(999999);
    setBrand("all");
    setAvailability("all");
    setImageFilter("all");
    setPage(1);
  };

  return (
    <Card className="sticky top-24 w-full min-w-[250px] border border-border/40 bg-background/80 p-4 shadow-lg ring-1 ring-primary/20 backdrop-blur-[2px] supports-[backdrop-filter]:bg-background/80 dark:bg-background/40 dark:ring-accent/10">
      <div className="space-y-6">
        {/* ~ ======= Filter Header ======= ~ */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Filters</p>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleClearFilters}
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* ~ ======= Filter Controls ======= ~ */}
        <div className="flex flex-col gap-4">
          {/* ~ ======= Price Range Filter ======= ~ */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Price Range
            </p>
            <Select
              value={`${minPrice}_${maxPrice}`}
              onValueChange={handlePriceChange}
            >
              <SelectTrigger className="w-full border-primary/20 dark:border-muted-foreground/20">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0_999999">All Prices</SelectItem>
                <SelectItem value="0_100">£0 - £100</SelectItem>
                <SelectItem value="100_250">£100 - £250</SelectItem>
                <SelectItem value="250_500">£250 - £500</SelectItem>
                <SelectItem value="500_999999">£500+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ~ ======= Brand Filter ======= ~ */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Brand</p>
            <Select value={brand} onValueChange={handleBrandChange}>
              <SelectTrigger className="w-full border-primary/20 dark:border-muted-foreground/20">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                <SelectItem value="cisco">Cisco</SelectItem>
                <SelectItem value="yealink">Yealink</SelectItem>
                <SelectItem value="fanvil">Fanvil</SelectItem>
                <SelectItem value="grandstream">Grandstream</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ~ ======= Availability Filter ======= ~ */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Availability
            </p>
            <Select
              value={availability}
              onValueChange={handleAvailabilityChange}
            >
              <SelectTrigger className="w-full border-primary/20 dark:border-muted-foreground/20">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="eol">End of Life (EOL)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ~ ======= Image Filter ======= ~ */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Image Status
            </p>
            <Select value={imageFilter} onValueChange={handleImageFilterChange}>
              <SelectTrigger className="w-full border-primary/20 dark:border-muted-foreground/20">
                <SelectValue placeholder="Image Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="with-image">With Image</SelectItem>
                <SelectItem value="without-image">Without Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ~ ======= Pagination Info ======= ~ */}
        {!isLoadingProductList && productsExist && paginationInfo && (
          <div className="space-y-4">
            <div className="h-px w-full bg-border/40" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Overview</p>
              <PaginationInfo {...paginationInfo} />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// ~ =============================================>
// ~ ======= Mobile Filter Sheet Component ======= ~
// ~ =============================================>
const ProductFilterSheet: React.FC<ProductFiltersProps> = ({
  isLoadingProductList,
  productsExist,
  paginationInfo,
}) => {
  // ~ ======= Query States -->
  const [minPrice, setMinPrice] = useQueryState(
    "minPrice",
    parseAsInteger.withDefault(0),
  );
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
  const [imageFilter, setImageFilter] = useQueryState("imageFilter", {
    defaultValue: "with-image",
  });
  const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });

  // ~ ======= Handle price change -->
  const handlePriceChange = (value: string) => {
    const [min, max] = value.split("_").map(Number);
    setMinPrice(min);
    setMaxPrice(max);
    setPage(1);
  };

  // ~ ======= Handle brand change -->
  const handleBrandChange = (value: string) => {
    setBrand(value);
    setPage(1);
  };

  // ~ ======= Handle availability change -->
  const handleAvailabilityChange = (value: string) => {
    setAvailability(value);
    setPage(1);
  };

  // ~ ======= Handle image filter change -->
  const handleImageFilterChange = (value: string) => {
    setImageFilter(value);
    setPage(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setMinPrice(0);
    setMaxPrice(999999);
    setBrand("all");
    setAvailability("all");
    setImageFilter("all");
    setPage(1);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex h-10 w-full items-center justify-center gap-2 px-4 text-base ring-1"
        >
          <Filter size={16} strokeWidth={1.5} />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-lg px-6">
        <div className="flex h-full flex-col">
          {/* ~ ======= Sheet Header ======= ~ */}
          <SheetHeader className="space-y-2.5 border-b pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl">Filters</SheetTitle>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
                onClick={handleClearFilters}
              >
                <X className="h-4 w-4" />
                Clear all
              </Button>
            </div>
            {paginationInfo && (
              <p className="text-sm text-muted-foreground">
                Showing {paginationInfo.startIndex}-{paginationInfo.endIndex} of{" "}
                {paginationInfo.totalItems} products
              </p>
            )}
          </SheetHeader>

          {/* ~ ======= Filter Controls ======= ~ */}
          <div className="flex-1 space-y-6 overflow-y-auto py-4">
            {/* ~ ======= Price Range Filter ======= ~ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Price Range</p>
                <span className="text-xs text-muted-foreground">
                  £{minPrice} - £{maxPrice === 999999 ? "∞" : maxPrice}
                </span>
              </div>
              <Select
                value={`${minPrice}_${maxPrice}`}
                onValueChange={handlePriceChange}
              >
                <SelectTrigger className="w-full border-primary/20 dark:border-muted-foreground/20">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0_999999">All Prices</SelectItem>
                  <SelectItem value="0_100">£0 - £100</SelectItem>
                  <SelectItem value="100_250">£100 - £250</SelectItem>
                  <SelectItem value="250_500">£250 - £500</SelectItem>
                  <SelectItem value="500_999999">£500+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ~ ======= Brand Filter ======= ~ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Brand</p>
                <span className="text-xs capitalize text-muted-foreground">
                  {brand === "all" ? "All brands" : brand}
                </span>
              </div>
              <Select value={brand} onValueChange={handleBrandChange}>
                <SelectTrigger className="w-full border-primary/20 dark:border-muted-foreground/20">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  <SelectItem value="cisco">Cisco</SelectItem>
                  <SelectItem value="yealink">Yealink</SelectItem>
                  <SelectItem value="fanvil">Fanvil</SelectItem>
                  <SelectItem value="grandstream">Grandstream</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ~ ======= Availability Filter ======= ~ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Availability</p>
                <span className="text-xs capitalize text-muted-foreground">
                  {availability === "all" ? "All products" : availability}
                </span>
              </div>
              <Select
                value={availability}
                onValueChange={handleAvailabilityChange}
              >
                <SelectTrigger className="w-full border-primary/20 dark:border-muted-foreground/20">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="eol">End of Life (EOL)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ~ ======= Image Filter ======= ~ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Image Status</p>
                <span className="text-xs capitalize text-muted-foreground">
                  {imageFilter === "all"
                    ? "All products"
                    : imageFilter.replace("-", " ")}
                </span>
              </div>
              <Select
                value={imageFilter}
                onValueChange={handleImageFilterChange}
              >
                <SelectTrigger className="w-full border-primary/20 dark:border-muted-foreground/20">
                  <SelectValue placeholder="Select image status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="with-image">With Image</SelectItem>
                  <SelectItem value="without-image">Without Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ~ ======= Active Filters Summary ======= ~ */}
          {(brand !== "all" ||
            availability !== "all" ||
            imageFilter !== "all" ||
            minPrice !== 0 ||
            maxPrice !== 999999) && (
            <div className="border-t pt-4">
              <div className="space-y-3">
                <p className="text-sm font-medium">Active Filters</p>
                <div className="flex flex-wrap gap-2">
                  {brand !== "all" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5"
                      onClick={() => handleBrandChange("all")}
                    >
                      {brand}
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  {availability !== "all" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5"
                      onClick={() => handleAvailabilityChange("all")}
                    >
                      {availability}
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  {imageFilter !== "all" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5"
                      onClick={() => handleImageFilterChange("all")}
                    >
                      {imageFilter.replace("-", " ")}
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  {(minPrice !== 0 || maxPrice !== 999999) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5"
                      onClick={() => handlePriceChange("0_999999")}
                    >
                      £{minPrice} - £{maxPrice === 999999 ? "∞" : maxPrice}
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { ProductFilters, ProductFilterSheet };
