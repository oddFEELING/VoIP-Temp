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
import { useEffect, useState, useRef } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useUser from "@/hooks/use-user";
import { useParams } from "next/navigation";
import usePayment, { useMutatePayments } from "@/hooks/use-payment";
import { Phone, Mail, User } from "lucide-react";

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
  onClose?: () => void;
  onComplete?: () => void;
}

const RecieverDetails: React.FC<RecieverDetailsProps> = ({
  initialData,
  onClose,
  onComplete,
}) => {
  const { profile, isAnonymous } = useUser();
  const [mounted, setMounted] = useState(false);
  const { transaction_id } = useParams();
  const { transaction } = usePayment(transaction_id as string);
  const { updateTransaction, isUpdatingTransaction } = useMutatePayments();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const form = useForm<RecieverFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // ~ ======= Close accordion and open next item -->
  const closeAccordionAndProceed = () => {
    // First close this accordion
    if (onClose) {
      onClose();
    } else if (triggerRef.current) {
      // Manually click the trigger button to close the accordion
      triggerRef.current.click();
    }

    // Then open the next accordion (delivery)
    setTimeout(() => {
      // Find and click the delivery accordion trigger
      const deliveryAccordionItem = document.querySelector(
        '[data-value="delivery"]',
      );
      if (deliveryAccordionItem) {
        const deliveryTrigger = deliveryAccordionItem.querySelector(
          '[data-state="closed"]',
        );
        if (deliveryTrigger) {
          (deliveryTrigger as HTMLElement).click();
        }
      }

      // Also call onComplete if provided
      if (onComplete) {
        onComplete();
      }
    }, 100); // Small delay to ensure the current accordion has closed
  };

  // ~ ======= Submit Form -->
  const handleSubmit = async (data: RecieverFormData) => {
    console.log(data);
    await updateTransaction({
      transactionId: transaction_id as string,
      updateData: {
        recieverFirstName: data.firstName,
        recieverLastName: data.lastName,
        recieverPhone: data.phone,
        recieverEmail: data.email,
      },
    });

    // Close this accordion and open the next one
    closeAccordionAndProceed();
  };

  // ~ ======= hanlde Delivery to me -->
  const handleDeliveryToMe = async () => {
    form.setValue("firstName", profile?.firstName || "");
    form.setValue("lastName", profile?.lastName || "");
    form.setValue("phone", profile?.phone || "");
    form.setValue("email", profile?.email || "");

    await updateTransaction({
      transactionId: transaction_id as string,
      updateData: {
        recieverFirstName: profile?.firstName || "",
        recieverLastName: profile?.lastName || "",
        recieverPhone: profile?.phone || "",
        recieverEmail: profile?.email || "",
      },
    });

    // Close this accordion and open the next one
    closeAccordionAndProceed();
  };

  if (!mounted) {
    return null;
  }

  const hasReceiverDetails =
    transaction?.recieverFirstName ||
    transaction?.recieverLastName ||
    transaction?.recieverPhone ||
    transaction?.recieverEmail;

  return (
    <AccordionItem
      value="user"
      className="my-2 rounded-lg border border-border bg-white p-4 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex w-full flex-col space-y-3">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Receiver Details</span>
            </div>
          </div>

          {hasReceiverDetails ? (
            <ul className="space-y-2 text-sm">
              {(transaction?.recieverFirstName ||
                transaction?.recieverLastName) && (
                <li className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {transaction?.recieverFirstName}{" "}
                    {transaction?.recieverLastName}
                  </span>
                </li>
              )}

              {transaction?.recieverPhone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{transaction?.recieverPhone}</span>
                </li>
              )}

              {transaction?.recieverEmail && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{transaction?.recieverEmail}</span>
                </li>
              )}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No receiver details provided
            </p>
          )}
        </div>

        <AccordionTrigger className="h-max" ref={triggerRef}>
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
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  isUpdatingTransaction
                }
              >
                {isUpdatingTransaction ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default RecieverDetails;
