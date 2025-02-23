"use client";

import StorePageHero from "@/components/page-sections/store/hero";
import ProductList from "@/components/page-sections/store/product-list";
import { BackgroundGradients } from "@/components/ui/background-gradients";
import React from "react";

const StorePage = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <BackgroundGradients />
      {/* <StorePageHero /> */}
      <ProductList />
    </div>
  );
};

export default StorePage;
