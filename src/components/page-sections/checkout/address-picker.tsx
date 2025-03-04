"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronsUp, ChevronsUpDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import useUser, { useMutateUser } from "@/hooks/use-user";
import usePayments, { useMutatePayments } from "@/hooks/use-payment";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CommandGroup,
  CommandEmpty,
  CommandInput,
  CommandList,
  Command,
  CommandItem,
} from "@/components/ui/command";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { cache_14_days } from "@/hooks/cache-info";

type CheckoutAddressPickerProps = {};

const CheckoutAddressPicker: React.FC<CheckoutAddressPickerProps> = ({}) => {
  const { transaction_id } = useParams();
  const { transaction } = usePayments(transaction_id as string);
  const { updateTransaction } = useMutatePayments();
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const { addresses, isAddressesLoading, isAnonymous } = useUser();

  useEffect(() => {}, []);

  return (
    <AccordionItem
      value="delivery"
      data-value="delivery"
      className="my-2 rounded-lg border border-border bg-white p-4 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex w-full flex-col space-y-1.5">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-semibold">Delivering to</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              {transaction?.deliveryAddress?.houseNumber},{" "}
              {transaction?.deliveryAddress?.address},{" "}
              {transaction?.deliveryAddress?.city}
            </p>
            <p>{transaction?.deliveryAddress?.postCode}</p>
          </div>
        </div>

        <AccordionTrigger className="h-max">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            Change
          </Button>
        </AccordionTrigger>
      </div>

      <AccordionContent className="mt-4">
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Select delivery address</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddressDialog(!showAddressDialog)}
            >
              {showAddressDialog ? "Cancel" : "Add new address"}
            </Button>
          </div>

          {/* ~ ======= New Address Form Card ======= ~ */}
          {showAddressDialog && (
            <Card className="border-border p-4">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg">Add New Address</CardTitle>
              </CardHeader>
              <AddressCard
                setShowAddressDialog={setShowAddressDialog}
                transactionId={transaction_id as string}
                isAnonymous={isAnonymous}
              />
            </Card>
          )}

          {/* ~ ======= Existing Addresses ======= ~ */}
          {!showAddressDialog &&
            addresses?.map((address) => (
              <Card
                key={address.postCode}
                className="border-border bg-muted/50 transition-colors hover:bg-muted"
              >
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2 text-base">
                        {address.houseNumber}
                        {address.address ===
                          transaction?.deliveryAddress?.address && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
                            Current
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {address.address}, {address.city}
                        <br />
                        {address.state}, {address.postCode}
                      </CardDescription>
                    </div>
                    <Button
                      variant={
                        address.postCode ===
                        transaction?.deliveryAddress?.postCode
                          ? "secondary"
                          : "outline"
                      }
                      size="sm"
                      className="h-8"
                      disabled={
                        address.address ===
                        transaction?.deliveryAddress?.address
                      }
                      onClick={() =>
                        updateTransaction({
                          transactionId: transaction_id as string,
                          updateData: {
                            deliveryAddress: address,
                          },
                        })
                      }
                    >
                      {address.postCode ===
                      transaction?.deliveryAddress?.postCode
                        ? "Selected"
                        : "Select"}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CheckoutAddressPicker;

// ~ =============================================>
// ~ ======= Supporting Components  -->
// ~ =============================================>
type AddressComponentProps = {
  transactionId: string;
  className?: string;
  isAnonymous: boolean;
  setShowAddressDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const addDeliveryAddressFormSchema = z.object({
  houseNumber: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postCode: z.string().min(1),
  country: z.string().min(1),
});

const AddressCard: React.FC<AddressComponentProps> = ({
  setShowAddressDialog,
  transactionId,
  isAnonymous,
}) => {
  const { createAddress } = useMutateUser();
  const [openCountryPopover, setOpenCountryPopover] = useState(false);
  const { updateTransaction } = useMutatePayments();
  const { data: countries, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: () =>
      axios.get("https://restcountries.com/v3.1/all?fields=name,flags"),
    ...cache_14_days,
  });

  // ~ ======= Form instance ======= ~
  const form = useForm<z.infer<typeof addDeliveryAddressFormSchema>>({
    resolver: zodResolver(addDeliveryAddressFormSchema),
    defaultValues: {
      houseNumber: "",
      address: "",
      city: "",
      state: "",
      postCode: "",
      country: "United Kingdom",
    },
  });

  // ~ ======= Handle submit ======= ~
  const onSubmit = (data: z.infer<typeof addDeliveryAddressFormSchema>) => {
    !isAnonymous &&
      createAddress({
        houseNumber: data.houseNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        postCode: data.postCode,
        country: "United Kingdom",
      });

    updateTransaction({
      transactionId: transactionId,
      updateData: {
        deliveryAddress: data,
      },
    });
    setShowAddressDialog(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-4 gap-4"
      >
        {/* ~ ======= House Number Field ======= ~ */}
        <FormField
          control={form.control}
          name="houseNumber"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>House Number/Name</FormLabel>
              <FormControl>
                <Input placeholder="Flat 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ~ ======= Street Address Field ======= ~ */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ~ ======= State Field ======= ~ */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>State/County</FormLabel>
              <FormControl>
                <Input placeholder="Durham" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ~ ======= City Field ======= ~ */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Enter your city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ~ ======= Country Field ======= ~ */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Popover
                  open={openCountryPopover}
                  onOpenChange={setOpenCountryPopover}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {field.value}
                      <ChevronsUpDown size={16} strokeWidth={1.2} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search country..."
                        className="focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0"
                      />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {isLoading ? (
                            <div className="p-4">
                              <div className="space-y-3">
                                <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                                <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                                <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                              </div>
                            </div>
                          ) : (
                            countries?.data.map((country: any, idx: number) => (
                              <CommandItem
                                key={idx}
                                onSelect={() => {
                                  form.setValue("country", country.name.common);
                                  setOpenCountryPopover(false);
                                }}
                              >
                                <img
                                  src={country.flags.svg}
                                  alt={country.name.common}
                                  className="mr-2 h-4 w-4"
                                />
                                {country.name.common}
                              </CommandItem>
                            ))
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ~ ======= Post Code Field ======= ~ */}
        <FormField
          control={form.control}
          name="postCode"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Post Code</FormLabel>
              <FormControl>
                <Input placeholder="DL3 7JZ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ~ ======= Submit Button ======= ~ */}
        <div className="col-span-4 flex justify-end space-x-4 pt-4">
          <Button type="submit">Save Address</Button>
        </div>
      </form>
    </Form>
  );
};
