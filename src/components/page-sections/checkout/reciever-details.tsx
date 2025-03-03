"use client";

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
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useUser from "@/hooks/use-user";
import { useParams } from "next/navigation";
import usePayment, { useMutatePayments } from "@/hooks/use-payment";

// Form Schema
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
});

export type RecieverFormData = z.infer<typeof formSchema>;

interface RecieverDetailsProps {
  initialData?: RecieverFormData;
}

const RecieverDetails: React.FC<RecieverDetailsProps> = ({ initialData }) => {
  const { profile, isAnonymous } = useUser();
  const [mounted, setMounted] = useState(false);
  const { transaction_id } = useParams();
  const { transaction } = usePayment(transaction_id as string);
  const { updateTransaction, isUpdatingTransaction } = useMutatePayments();

  const form = useForm<RecieverFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // ~ ======= Submit Form -->
  const handleSubmit = (data: RecieverFormData) => {
    console.log(data);
    updateTransaction({
      transactionId: transaction_id as string,
      updateData: {
        recieverFirstName: data.firstName,
        recieverLastName: data.lastName,
        recieverPhone: data.phone,
        recieverEmail: data.email,
      },
    });
  };

  // ~ ======= hanlde Delivery to me -->
  const handleDeliveryToMe = () => {
    form.setValue("firstName", profile?.firstName || "");
    form.setValue("lastName", profile?.lastName || "");
    form.setValue("phone", profile?.phone || "");
    form.setValue("email", profile?.email || "");

    updateTransaction({
      transactionId: transaction_id as string,
      updateData: {
        recieverFirstName: profile?.firstName || "",
        recieverLastName: profile?.lastName || "",
        recieverPhone: profile?.phone || "",
        recieverEmail: profile?.email || "",
      },
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <AccordionItem
      value="user"
      className="my-2 rounded-lg border border-border bg-white p-4 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex w-full flex-col space-y-1.5">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Receiver Details</span>
              <span className="font-medium text-muted-foreground">
                {transaction?.recieverFirstName} {transaction?.recieverLastName}
              </span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>{transaction?.recieverPhone || "No phone number"}</p>
            <p>{transaction?.recieverEmail || "No email address"}</p>
          </div>
        </div>

        <AccordionTrigger className="h-max">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            Edit
          </Button>
        </AccordionTrigger>
      </div>

      <AccordionContent className="mt-4">
        <div className="w-full space-y-3 border-t px-2 pt-4">
          {!isAnonymous && (
            <Button
              variant="outline"
              size="sm"
              className="w-max"
              onClick={handleDeliveryToMe}
            >
              Deliver to me
            </Button>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="mt-4 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter phone number"
                        type="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email address"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                Save Changes
              </Button>
            </form>
          </Form>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default RecieverDetails;
