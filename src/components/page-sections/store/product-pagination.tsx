"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { parseAsInteger, useQueryState } from "nuqs";

// ~ =============================================>
// ~ ======= Type Definitions ======= ~
// ~ =============================================>

// ~ ======= Props for pagination information display ======= ~
interface PaginationInfoProps {
  startIndex: number;
  endIndex: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

// ~ ======= Props for main pagination component ======= ~
interface ProductPaginationProps {
  totalItems: number;
  itemsPerPage: number;
  gridRef?: React.RefObject<HTMLDivElement>;
}

// ~ =============================================>
// ~ ======= Pagination Info Component ======= ~
// ~ =============================================>

export const PaginationInfo = ({
  startIndex,
  endIndex,
  totalItems,
  currentPage,
  totalPages,
}: PaginationInfoProps) => (
  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
    {/* ~ ======= Results summary section ======= ~ */}
    <div className="flex items-center justify-between">
      <span className="font-medium">Results</span>
      <span className="text-xs">{totalItems.toLocaleString()} items found</span>
    </div>
    {/* ~ ======= Detailed pagination stats ======= ~ */}
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span>Currently showing</span>
        <span className="font-medium text-foreground">
          {startIndex} - {endIndex}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span>Page</span>
        <span className="font-medium text-foreground">
          {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  </div>
);

// ~ =============================================>
// ~ ======= Product Pagination Component ======= ~
// ~ =============================================>

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  totalItems,
  itemsPerPage,
  gridRef,
}) => {
  // ~ ======= Pagination state management ======= ~
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  // ~ ======= Calculate pagination values ======= ~
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

  // ~ ======= Handle page overflow protection ======= ~
  React.useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page, setPage]);

  // ~ ======= Scroll handling on page change ======= ~
  React.useEffect(() => {
    if (gridRef?.current) {
      const yOffset = -200;
      const element = gridRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [page, gridRef]);

  if (totalItems === 0) return null;

  return (
    <div className="mt-8 flex justify-center">
      <Pagination>
        <PaginationContent>
          {/* ~ ======= Previous page button ======= ~ */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) setPage(page - 1);
              }}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* ~ ======= Page number buttons ======= ~ */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (page <= 3) {
              pageNumber = i + 1;
            } else if (page >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = page - 2 + i;
            }

            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageNumber <= totalPages) {
                      setPage(pageNumber);
                    }
                  }}
                  isActive={page === pageNumber}
                  className={
                    pageNumber > totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* ~ ======= Next page button ======= ~ */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) setPage(page + 1);
              }}
              className={
                page >= totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

// Export pagination info type for use in other components
export type { PaginationInfoProps };
