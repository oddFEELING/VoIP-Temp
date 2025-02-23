"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShoppingCart, Star, StarHalf } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { products } from "@/schemas/product.schema";
import { generateDiceBearUrl } from "@/lib/utils";
import { useProductMutations } from "@/hooks/use-products";
import useUser from "@/hooks/use-user";
import { appLogger } from "@/lib/logger";
import { log } from "console";

type ComponentProps = {
  open: boolean;
  product: typeof products.$inferSelect;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProductInfoDialog: React.FC<ComponentProps> = ({
  open,
  onOpenChange,
  product,
}) => {
  const { addToCart } = useProductMutations();
  const { user } = useUser();

  // ~ ======= State for quantity input ======= ~
  const [quantity, setQuantity] = useState(1);

  // ~ ======= Handler for quantity changes ======= ~
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen rounded-lg p-0 dark:ring-1 dark:ring-secondary/30 md:h-[600px] md:max-w-5xl md:overflow-hidden">
        <div className="flex h-full w-full flex-col md:grid md:grid-cols-[1fr,1.5fr]">
          {/* ~ ======= Product Image Section ======= ~ */}
          <div className="relative h-[300px] w-full bg-muted bg-white p-10 md:h-full md:min-h-[500px]">
            <div className="relative flex h-full w-full items-center justify-center bg-white">
              <Image
                src={
                  product.imageUrl ||
                  generateDiceBearUrl(product.webName as string)
                }
                alt={product.webName || "product-image"}
                fill
                className="object-contain md:object-fill"
                priority
              />
            </div>
          </div>

          {/* ~ ======= Scrollable Content Section ======= ~ */}
          <div className="flex-1 md:h-[600px]">
            <ScrollArea className="h-full w-full">
              {/* ~ ======= Product Details Section ======= ~ */}
              <div className="space-y-4 p-4 md:space-y-6 md:p-6">
                {/* ~ ======= Breadcrumb ======= ~ */}
                <div className="hidden items-center text-sm text-muted-foreground md:flex">
                  <span>Shop All</span>
                  <span className="mx-2">&gt;</span>
                  <span>
                    {product.category?.length && product.category.length > 25
                      ? `${product.category.slice(0, 25)}...`
                      : product.category}
                  </span>
                  <span className="mx-2">&gt;</span>
                  <span>
                    {product.class?.length > 25
                      ? `${product.class.slice(0, 25)}...`
                      : product.class}
                  </span>
                </div>

                {/* ~ ======= Title and Price ======= ~ */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <h2 className="text-2xl font-semibold md:text-3xl">
                      {product.webName}
                    </h2>
                    <span className="text-2xl font-semibold md:text-3xl">
                      £{product.retailPrice}
                    </span>
                  </div>

                  {/* ~ ======= Rating Section ======= ~ */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex">
                      <Star className="h-4 w-4 fill-primary md:h-5 md:w-5" />
                      <Star className="h-4 w-4 fill-primary md:h-5 md:w-5" />
                      <Star className="h-4 w-4 fill-primary md:h-5 md:w-5" />
                      <StarHalf className="h-4 w-4 fill-primary md:h-5 md:w-5" />
                      <Star className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />
                    </div>
                    <span className="text-xs text-muted-foreground md:text-sm">
                      (3.5 stars) • 10 reviews
                    </span>

                    {/* ~ ======= Stock Status ======= ~ */}
                    <div className="ml-auto text-xs md:text-sm">
                      <span
                        className={`font-medium ${
                          product.availability === "eol"
                            ? "text-destructive"
                            : "text-green-600"
                        }`}
                      >
                        {product.availability === "eol"
                          ? "Out of Stock"
                          : "In Stock"}
                      </span>
                    </div>
                  </div>

                  {/* ~ ======= Description ======= ~ */}
                  <p className="text-sm text-muted-foreground md:text-base">
                    {product.descriptionShort}
                  </p>
                </div>

                {/* ~ ======= Quantity Section ======= ~ */}
                <div className="space-y-2">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Quantity
                  </label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-24 ring-1"
                  />
                </div>

                {/* ~ ======= Action Buttons ======= ~ */}
                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      if (
                        product.retailPrice &&
                        product.descriptionShort &&
                        user
                      ) {
                        addToCart({
                          productId: product.id,
                          quantity,
                          price: product.retailPrice,
                          productName: product.descriptionShort,
                          productImage: product.imageUrl,
                          ownerId: user?.id,
                        });

                        setQuantity(1);
                      }
                    }}
                  >
                    <ShoppingCart
                      size={16}
                      strokeWidth={1.5}
                      className="mr-2"
                    />
                    Add to Cart
                  </Button>
                  <Button size="lg" className="w-full">
                    Buy Now
                  </Button>
                </div>

                {/* ~ ======= Free Shipping Notice ======= ~ */}
                <p className="text-xs text-muted-foreground md:text-sm">
                  Free shipping on orders £50+
                </p>

                {/* ~ ======= Product Details Accordion ======= ~ */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details">
                    <AccordionTrigger>Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <p className="text-sm md:text-base">
                          {product.descriptionLong}
                        </p>
                        {product.features && (
                          <div>
                            <h4 className="mb-2 font-medium">Features</h4>
                            <p className="text-sm md:text-base">
                              {product.features}
                            </p>
                          </div>
                        )}
                        <div>
                          <h4 className="mb-2 font-medium">Box Contents</h4>
                          <p className="text-sm md:text-base">
                            {product.boxContents}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="specifications">
                    <AccordionTrigger>Specifications</AccordionTrigger>
                    <AccordionContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="w-[120px] bg-muted/50 font-medium md:w-[200px]">
                                Model
                              </TableCell>
                              <TableCell>{product.item}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="w-[120px] bg-muted/50 font-medium md:w-[200px]">
                                Category
                              </TableCell>
                              <TableCell>{product.category}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="w-[120px] bg-muted/50 font-medium md:w-[200px]">
                                Class
                              </TableCell>
                              <TableCell>{product.class}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="w-[120px] bg-muted/50 font-medium md:w-[200px]">
                                Subclass
                              </TableCell>
                              <TableCell>{product.subclass}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="w-[120px] bg-muted/50 font-medium md:w-[200px]">
                                Weight
                              </TableCell>
                              <TableCell>{product.weight}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="w-[120px] bg-muted/50 font-medium md:w-[200px]">
                                EAN
                              </TableCell>
                              <TableCell>{product.ean}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="w-[120px] bg-muted/50 font-medium md:w-[200px]">
                                MPN
                              </TableCell>
                              <TableCell>{product.mpn}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="w-[120px] bg-muted/50 font-medium md:w-[200px]">
                                Stock Status
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`font-medium ${
                                    product.availability === "eol"
                                      ? "text-destructive"
                                      : "text-green-600"
                                  }`}
                                >
                                  {product.availability === "eol"
                                    ? "Out of Stock"
                                    : `In Stock (free stock: ${product.freeStock} units)`}
                                </span>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="shipping">
                    <AccordionTrigger>Shipping</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-xs text-muted-foreground md:text-sm">
                        Free shipping available on orders over £50. Standard
                        delivery takes 3-5 business days. Express shipping
                        options are available at checkout.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="returns">
                    <AccordionTrigger>Returns</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-xs text-muted-foreground md:text-sm">
                        Our return policy allows returns within 30 days of
                        delivery. Item must be unused and in original packaging.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductInfoDialog;
