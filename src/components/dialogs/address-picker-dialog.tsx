"use client";

import React from "react";
import {
  MapPin,
  Plus,
  Check,
  ArrowLeft,
  HomeIcon,
  CircleCheckBig,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import { Address } from "@/types/address";
import usePayment, { useMutatePayments } from "@/hooks/use-payment";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";

// ~ ======= Animation Variants ======= ~
const slideAnimation = {
  initial: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  }),
};

// ~ ======= Types and Schema ======= ~
const addressFormSchema = z.object({
  houseNumber: z.string().min(1, "House number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postCode: z.string().min(1, "Post code is required"),
  country: z.string(),
});

type ComponentProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addresses: Address[];
  transactionId: string;
  isDialog?: boolean;
  onContinue: () => void;
};

// ~ ======= Main Component ======= ~
const AddressPickerDialog: React.FC<ComponentProps> = ({
  open,
  setOpen,
  addresses,
  transactionId,
  isDialog = true,
  onContinue,
}) => {
  const router = useRouter();
  const { transaction, isTransactionLoading, setInitaited } =
    usePayment(transactionId);
  const { updateTransaction } = useMutatePayments();
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [direction, setDirection] = React.useState(0);

  // ~ ======= Debug logging ======= ~
  React.useEffect(() => {
    console.log("Current transaction:", transaction);
    console.log("Delivery address:", transaction?.deliveryAddress);
    console.log("Available addresses:", addresses);
  }, [transaction, addresses]);

  // ~ ======= Form setup ======= ~
  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      houseNumber: "",
      address: "",
      city: "",
      state: "",
      postCode: "",
      country: "United Kingdom",
    },
  });

  // ~ ======= Form submission handler ======= ~
  const handleSubmit = (values: z.infer<typeof addressFormSchema>) => {
    updateTransaction({
      transactionId,
      updateData: {
        deliveryAddress: values,
      },
    });
    onContinue();
    setIsAddingNew(false);
    form.reset();
  };

  const handleAddNew = () => {
    setDirection(1);
    setIsAddingNew(true);
  };

  const handleBack = () => {
    setDirection(-1);
    setIsAddingNew(false);
  };

  const content = (
    <>
      <AnimatePresence initial={false} custom={direction} mode="wait">
        {!isAddingNew ? (
          // ~ ======= Address List Section ======= ~
          <motion.div
            key="address-list"
            custom={direction}
            variants={slideAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative"
          >
            <ScrollArea className={isDialog ? "h-[400px] pr-4" : "h-full pr-4"}>
              <div className="space-y-6">
                {/* ~ ======= Selected Address Section ======= ~ */}
                <div>
                  <h3 className="mb-3 text-sm font-medium">Selected Address</h3>
                  {transaction?.deliveryAddress ? (
                    <Card className="relative overflow-hidden border-primary transition-all dark:border-secondary">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 dark:border-accent">
                            <MapPin
                              size={18}
                              strokeWidth={1.5}
                              className="text-primary dark:text-accent"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="font-medium leading-none">
                              {transaction.deliveryAddress.houseNumber}{" "}
                              {transaction.deliveryAddress.address}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.deliveryAddress.city}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.deliveryAddress.state},{" "}
                              {transaction.deliveryAddress.postCode}
                            </p>
                          </div>
                          <div className="flex h-6 w-6 items-center justify-center rounded-full">
                            <CircleCheckBig className="h-4 w-4 text-primary dark:text-accent" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="relative overflow-hidden border-dashed transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-center text-sm text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          No address selected
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* ~ ======= Available Addresses Section ======= ~ */}
                <div>
                  <h3 className="mb-3 text-sm font-medium">
                    Available Addresses
                  </h3>
                  {addresses.length === 0 ? (
                    <Card className="relative overflow-hidden transition-all">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <HomeIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="space-y-1 text-center">
                            <p className="text-sm text-muted-foreground">
                              No saved addresses
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <RadioGroup
                      value={
                        transaction?.deliveryAddress
                          ? JSON.stringify(transaction.deliveryAddress)
                          : undefined
                      }
                      onValueChange={(value) => {
                        const selectedAddress = JSON.parse(value);
                        updateTransaction({
                          transactionId,
                          updateData: {
                            deliveryAddress: selectedAddress,
                          },
                        });
                      }}
                      className="grid gap-4"
                    >
                      {addresses.map((address, index) => (
                        <Card
                          key={index}
                          className={cn(
                            "relative overflow-hidden transition-all",
                            JSON.stringify(address) ===
                              JSON.stringify(transaction?.deliveryAddress)
                              ? "border-primary"
                              : "hover:border-muted-foreground/50",
                          )}
                        >
                          <CardContent className="p-6">
                            <RadioGroupItem
                              value={JSON.stringify(address)}
                              id={`address-${index}`}
                              className="absolute right-6 top-6"
                            />
                            <Label
                              htmlFor={`address-${index}`}
                              className="block cursor-pointer"
                            >
                              <div className="flex items-start space-x-4">
                                <div
                                  className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-full border-2",
                                    JSON.stringify(address) ===
                                      JSON.stringify(
                                        transaction?.deliveryAddress,
                                      )
                                      ? "border-primary bg-primary/10"
                                      : "border-muted",
                                  )}
                                >
                                  <MapPin
                                    className={cn(
                                      "h-5 w-5",
                                      JSON.stringify(address) ===
                                        JSON.stringify(
                                          transaction?.deliveryAddress,
                                        )
                                        ? "text-primary"
                                        : "text-muted-foreground",
                                    )}
                                  />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <p className="font-medium leading-none">
                                    {address.HouseNumber} {address.address}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {address.city}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {address.state}, {address.postCode}
                                  </p>
                                </div>
                              </div>
                            </Label>
                          </CardContent>
                        </Card>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            {/* ~ ======= Actions Section ======= ~ */}
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddNew}
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Address
              </Button>

              <Button
                className="w-full"
                onClick={onContinue}
                disabled={!transaction?.deliveryAddress}
              >
                {transaction?.deliveryAddress ? (
                  "Continue to Payment"
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Select an Address
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          // ~ ======= New Address Form Section ======= ~
          <motion.div
            key="address-form"
            custom={direction}
            variants={slideAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative"
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                {/* ~ ======= House Number  --> */}
                <FormField
                  control={form.control}
                  name="houseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>House Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter house number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ~ ======= Street Address  --> */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ~ ======= City  --> */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  {/* ~ ======= State  --> */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State / County</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ~ ======= Post Code  --> */}
                  <FormField
                    control={form.control}
                    name="postCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Post Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter post code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ~ ======= Save Address  --> */}
                <div className="space-y-4 pt-4">
                  <Button type="submit" className="w-full">
                    Save Address
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleBack}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  // ~ =============================================>
  // ~ ======= Loading state  -->
  // ~ =============================================>
  if (isTransactionLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  // ~ =============================================>
  // ~ ======= No transaction
  // ~ =============================================>
  if (!transaction && !isTransactionLoading) {
    router.replace("/");
  }

  // ~ =============================================>
  // ~ ======= Non Dialog usage  -->
  // ~ =============================================>
  if (!isDialog) {
    return content;
  }

  // ~ =============================================>
  // ~ ======= Dialog usage  -->
  // ~ =============================================>
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isAddingNew && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {isAddingNew ? "Add New Address" : "Select Delivery Address"}
          </DialogTitle>
          <DialogDescription>
            {isAddingNew
              ? "Fill in the details for your new delivery address"
              : "Choose a delivery address for your order or add a new one"}
          </DialogDescription>
        </DialogHeader>

        <Separator className="mb-3" />

        {content}
      </DialogContent>
    </Dialog>
  );
};

export default AddressPickerDialog;
