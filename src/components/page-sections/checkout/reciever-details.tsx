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

const RecieverDetails: React.FC<RecieverDetailsProps> = ({
  initialData = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  },
}) => {
  const { user, isAnonymous } = useUser();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<RecieverFormData>(initialData);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const form = useForm<RecieverFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (data: RecieverFormData) => {
    setFormData(data);
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
                {formData.firstName} {formData.lastName}
              </span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>{formData.phone}</p>
            <p>{formData.email}</p>
          </div>
        </div>

        <AccordionTrigger className="h-max">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            Edit {isAnonymous ? "Guest" : "User"}
          </Button>
        </AccordionTrigger>
      </div>

      <AccordionContent className="mt-4">
        <div className="space-y-3 border-t pt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
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
