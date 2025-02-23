import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PackageSearch } from "lucide-react";

/* ~ =================================== ~ */
/* -- Interface for EmptyState props -- */
/* ~ =================================== ~ */
interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/* ~ =================================== ~ */
/* -- Reusable empty state component -- */
/* ~ =================================== ~ */
export const EmptyState = ({
  title = "No Results Found",
  message = "We couldn't find any items matching your criteria.",
  icon,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <Card
      className={cn(
        "flex h-full min-h-max w-full flex-col items-center justify-center bg-transparent p-8 text-center shadow-none ring-1 ring-border dark:ring-accent/30",
        className,
      )}
    >
      <div className="mx-auto flex flex-col items-center justify-center space-y-6">
        {/* ~ ======= Icon Section ======= ~ */}
        <div className="rounded-full bg-muted/30 p-4">
          {icon || (
            <PackageSearch
              size={30}
              strokeWidth={1.5}
              className="text-muted-foreground"
            />
          )}
        </div>

        {/* ~ ======= Content Section ======= ~ */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        {/* ~ ======= Action Button ======= ~ */}
        {action && (
          <Button onClick={action.onClick} variant="outline" className="mt-4">
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
};
