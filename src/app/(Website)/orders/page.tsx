"use client";

import React from "react";
import usePayment from "@/hooks/use-payment";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  ArrowUpDown,
  ClipboardList,
  Package2,
  Clock,
  Receipt,
  Copy,
  CheckCircle2,
  AlertCircle,
  XCircle,
  CircleDashed,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  UserPlus,
  X,
} from "lucide-react";
import { formatDistance, format } from "date-fns";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import useProducts from "@/hooks/use-products";
import {
  cn,
  convertSubCurrencyToCurrency,
  convertToSubCurrency,
} from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useUser from "@/hooks/use-user";
import { useTheme } from "next-themes";

type TransactionStatus = "pending" | "succeeded" | "failed" | "cancelled";
type StatusFilterType = "all" | TransactionStatus;

// ~ ======= Animation variants ======= ~
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// ~ ======= Helper function to get status badge variant ======= ~
const getStatusBadgeVariant = (status: TransactionStatus) => {
  switch (status) {
    case "succeeded":
      return "default" as const;
    case "pending":
      return "secondary" as const;
    case "failed":
      return "destructive" as const;
    case "cancelled":
      return "outline" as const;
    default:
      return "default" as const;
  }
};

// ~ ======= Helper function to get status icon ======= ~
const getStatusIcon = (status: TransactionStatus) => {
  switch (status) {
    case "succeeded":
      return (
        <CheckCircle2 className="h-5 w-5 text-primary dark:text-secondary" />
      );
    case "pending":
      return <CircleDashed className="h-5 w-5 text-yellow-500" />;
    case "failed":
      return <XCircle className="h-5 w-5 text-destructive" />;
    case "cancelled":
      return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
  }
};

// ~ ======= Transaction Card Component ======= ~
const TransactionCard = ({ transaction }: { transaction: any }) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { theme } = useTheme();

  // ~ ======= Copy transaction ID to clipboard ======= ~
  const copyTransactionId = () => {
    navigator.clipboard.writeText(transaction.id);
    toast.success("Transaction ID copied to clipboard");
  };

  // ~ ======= Get first 3 items for preview ======= ~
  const previewItems = transaction.items.slice(0, 3);
  const remainingItems = transaction.items.length - 3;

  return (
    <Card className="group overflow-hidden transition-all hover:border-primary/40 hover:shadow-md dark:hover:border-secondary/40">
      <CardContent className="p-4">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          {/* ~ ======= Main Transaction Info ======= ~ */}
          <div className="flex items-start justify-between gap-4">
            {/* ~ ======= Left Section ======= ~ */}
            <div className="flex flex-1 items-start gap-4">
              {/* ~ ======= Status Icon ======= ~ */}
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  transaction.status === "succeeded" &&
                    "bg-primary/10 dark:bg-secondary/10",
                  transaction.status === "pending" && "bg-yellow-500/10",
                  transaction.status === "failed" && "bg-destructive/10",
                  transaction.status === "cancelled" && "bg-muted",
                )}
              >
                {getStatusIcon(transaction.status as TransactionStatus)}
              </div>

              {/* ~ ======= Order Details ======= ~ */}
              <div className="flex-1 space-y-3">
                {/* ~ ======= Order Summary and Status ======= ~ */}
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">
                    Order with {transaction.items.length} item
                    {transaction.items.length !== 1 ? "s" : ""}
                  </p>
                  <Badge
                    variant={theme === "light" ? "default" : "secondary"}
                    className="hidden md:block"
                  >
                    {transaction.status}
                  </Badge>
                </div>

                {/* ~ ======= Items Preview ======= ~ */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {previewItems.map((item: any, index: number) => (
                      <div
                        key={item.id}
                        className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-background"
                      >
                        {item.product.imageUrl ? (
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name || "Product"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <Package2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    {remainingItems > 0 && (
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                        +{remainingItems}
                      </div>
                    )}
                  </div>
                </div>

                {/* ~ ======= Transaction Info ======= ~ */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <button
                    onClick={copyTransactionId}
                    className="flex items-center gap-1 transition-colors hover:text-primary dark:hover:text-secondary"
                  >
                    <Copy className="h-3 w-3" />
                    {transaction.id}
                  </button>
                  {transaction.createdAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(transaction.createdAt), "PPp")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ~ ======= Right Section ======= ~ */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-lg font-semibold">
                  £{convertSubCurrencyToCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.items.reduce(
                    (acc: number, item: any) => acc + item.quantity,
                    0,
                  )}{" "}
                  items
                </p>
              </div>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 transition-transform group-hover:text-primary dark:group-hover:text-secondary"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* ~ ======= Expanded Content ======= ~ */}
          <CollapsibleContent className="mt-4 space-y-4">
            {/* ~ ======= Status Timeline ======= ~ */}
            <div className="rounded-lg border bg-card p-4">
              <h4 className="mb-3 text-sm font-medium">Order Status</h4>
              <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2",
                      transaction.status !== "cancelled"
                        ? "border-primary dark:border-secondary"
                        : "border-muted-foreground",
                    )}
                  >
                    <Receipt className="h-4 w-4" />
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2",
                      transaction.status === "succeeded"
                        ? "border-primary dark:border-secondary"
                        : "border-muted-foreground/30",
                    )}
                  >
                    {getStatusIcon(transaction.status as TransactionStatus)}
                  </div>
                </div>
              </div>
            </div>

            {/* ~ ======= Transaction Items ======= ~ */}
            <div className="space-y-2 rounded-lg border bg-card p-4">
              <h4 className="text-sm font-medium">Order Items</h4>
              <div className="space-y-3">
                {transaction.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 border-t pt-3 first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
                        {item.product.imageUrl ? (
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name || "Product"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <Package2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {item.product.name || item.product.item}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Quantity: {item.quantity}</span>
                          <span>•</span>
                          <span>{item.product.category}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium">
                      £{Number(item.product.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ~ ======= Additional Details ======= ~ */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-lg border bg-card p-4">
                <h4 className="text-sm font-medium">Payment Details</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Amount: £{(transaction.amount / 100).toFixed(2)}</p>
                  <p>Payment ID: {transaction.intentId || "N/A"}</p>
                  <p>Status: {transaction.status}</p>
                </div>
              </div>
              <div className="space-y-2 rounded-lg border bg-card p-4">
                <h4 className="text-sm font-medium">Order Summary</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Items: {transaction.items.length}</p>
                  <p>
                    Total Items:{" "}
                    {transaction.items.reduce(
                      (acc: number, item: any) => acc + item.quantity,
                      0,
                    )}
                  </p>
                  <p>Order ID: {transaction.id}</p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

const OrdersPage = () => {
  const router = useRouter();
  const { transactionsAndItems, isTransactionsAndItemsLoading } = usePayment();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] =
    React.useState<StatusFilterType>("all");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [showBanner, setShowBanner] = React.useState(true);
  const { isAnonymous } = useUser();

  // ~ ======= Get unique categories from all items ======= ~
  const categories = React.useMemo(() => {
    if (!transactionsAndItems) return [];
    const uniqueCategories = new Set<string>();
    transactionsAndItems.forEach((transaction) => {
      transaction.items.forEach((item) => {
        if (item.product.category) {
          uniqueCategories.add(item.product.category);
        }
      });
    });
    return Array.from(uniqueCategories);
  }, [transactionsAndItems]);

  // ~ ======= Filter and sort transactions ======= ~
  const filteredTransactions = React.useMemo(() => {
    if (!transactionsAndItems) return [];

    return transactionsAndItems
      .filter((transaction) => {
        const matchesSearch =
          searchQuery === "" ||
          transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (transaction.intentId?.toLowerCase() ?? "").includes(
            searchQuery.toLowerCase(),
          ) ||
          transaction.items.some(
            (item) =>
              item.product.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.product.item
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.product.category
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()),
          );

        const matchesStatus =
          statusFilter === "all" || transaction.status === statusFilter;

        const matchesCategory =
          categoryFilter === "all" ||
          transaction.items.some(
            (item) => item.product.category === categoryFilter,
          );

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "desc"
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      });
  }, [
    transactionsAndItems,
    searchQuery,
    statusFilter,
    categoryFilter,
    sortOrder,
  ]);

  // ~ ======= Calculate total items and amount ======= ~
  const stats = React.useMemo(() => {
    if (!transactionsAndItems)
      return { totalTransactions: 0, totalAmount: 0, pendingOrders: 0 };

    return transactionsAndItems.reduce(
      (acc, transaction) => ({
        totalTransactions: acc.totalTransactions + 1,
        totalAmount: acc.totalAmount + transaction.amount,
        pendingOrders:
          acc.pendingOrders + (transaction.status === "pending" ? 1 : 0),
      }),
      { totalTransactions: 0, totalAmount: 0, pendingOrders: 0 },
    );
  }, [transactionsAndItems]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-background px-4 md:px-8">
      {/* ~ ======= Anonymous User Banner ======= ~ */}
      {isAnonymous && showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative w-full bg-background pt-20"
        >
          <Alert className="mx-auto flex max-w-7xl items-center justify-between border-primary/20">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary dark:text-secondary" />
              <AlertDescription className="text-sm">
                Keep your data safe, create an account
              </AlertDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => router.push("/auth")}
              >
                Sign up
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowBanner(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        </motion.div>
      )}

      {/* ~ ======= Background Pattern ======= ~ */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <GridPattern
          width={80}
          height={80}
          x={-1}
          y={-1}
          strokeDasharray="4 4"
          className="absolute inset-0 h-full w-full fill-neutral-50 stroke-neutral-900/[0.1] [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)] dark:stroke-neutral-100/[0.1]"
        />
      </div>

      {/* ~ ======= Hero Section ======= ~ */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto flex h-max w-full max-w-7xl flex-col items-center justify-center gap-8 py-16"
      >
        {/* ~ ======= Header Content ======= ~ */}
        <motion.div variants={itemVariants} className="text-center">
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-accent">
            Transaction History
          </span>
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Your{" "}
            <span className="text-primary dark:text-secondary">Orders</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
            Track and manage all your orders in one place. View transaction
            history, check order status, and more.
          </p>
        </motion.div>

        {/* ~ ======= Stats Cards ======= ~ */}
        <motion.div
          variants={itemVariants}
          className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <Card className="group relative overflow-hidden border-border p-4 transition-all hover:border-primary/40 hover:shadow-md dark:border-muted-foreground/20 dark:hover:border-secondary/40">
            <div className="flex h-full flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-1.5 text-primary transition-colors dark:bg-secondary/10 dark:text-secondary dark:group-hover:bg-secondary/20">
                  <Package2 size={16} strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold">Total Orders</h3>
              </div>
              <p className="text-2xl font-bold text-primary dark:text-secondary">
                {isTransactionsAndItemsLoading ? (
                  <Skeleton className="h-7 w-14" />
                ) : (
                  stats.totalTransactions
                )}
              </p>
              <div className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                <Package2 className="h-3.5 w-3.5" />
                <span>Total transactions</span>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden border-border p-4 transition-all hover:border-primary/40 hover:shadow-md dark:border-muted-foreground/20 dark:hover:border-secondary/40">
            <div className="flex h-full flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-1.5 text-primary transition-colors dark:bg-secondary/10 dark:text-secondary dark:group-hover:bg-secondary/20">
                  <ClipboardList size={16} strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold">Active Orders</h3>
              </div>
              <p className="text-2xl font-bold text-primary dark:text-secondary">
                {isTransactionsAndItemsLoading ? (
                  <Skeleton className="h-7 w-14" />
                ) : (
                  stats.pendingOrders
                )}
              </p>
              <div className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Pending delivery</span>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden border-border p-4 transition-all hover:border-primary/40 hover:shadow-md dark:border-muted-foreground/20 dark:hover:border-secondary/40">
            <div className="flex h-full flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-1.5 text-primary transition-colors dark:bg-secondary/10 dark:text-secondary dark:group-hover:bg-secondary/20">
                  <Receipt size={16} strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold">Total Spent</h3>
              </div>
              <p className="text-2xl font-bold text-primary dark:text-secondary">
                {isTransactionsAndItemsLoading ? (
                  <Skeleton className="h-7 w-14" />
                ) : (
                  `£${(stats.totalAmount / 100).toFixed(2)}`
                )}
              </p>
              <div className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                <Receipt className="h-3.5 w-3.5" />
                <span>All time spending</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.header>

      {/* ~ ======= Orders Content ======= ~ */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto w-full max-w-7xl space-y-6 py-8"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
        >
          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            {/* ~ ======= Search Input ======= ~ */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders, products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* ~ ======= Status Filter ======= ~ */}
            <Select
              value={statusFilter}
              onValueChange={(value: StatusFilterType) =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="succeeded">Succeeded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {/* ~ ======= Category Filter ======= ~ */}
            <Select
              value={categoryFilter}
              onValueChange={(value: string) => setCategoryFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* ~ ======= Sort Order ======= ~ */}
            <button
              onClick={() =>
                setSortOrder(sortOrder === "desc" ? "asc" : "desc")
              }
              className="flex items-center space-x-1 rounded-md border px-3 py-2 hover:bg-accent"
            >
              <Calendar className="h-4 w-4" />
              <span>Date</span>
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* ####################################### */}
        {/* -- Orders List -- */}
        {/* ####################################### */}
        <motion.div variants={itemVariants} className="space-y-3">
          {isTransactionsAndItemsLoading ? (
            // Loading state
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="w-full">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredTransactions.length === 0 ? (
            // Empty state
            <Card>
              <CardContent className="flex flex-col items-center justify-center space-y-2 p-8 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-base font-semibold">No orders found</h3>
                <p className="text-sm text-muted-foreground">
                  We couldn't find any orders matching your criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            // Orders list
            filteredTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))
          )}
        </motion.div>
      </motion.section>
    </div>
  );
};

export default OrdersPage;
