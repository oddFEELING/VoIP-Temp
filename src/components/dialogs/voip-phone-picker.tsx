"use client";

import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PackagePlan } from "@/app/(Website)/packages/package-plans.data";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ComponentProps = {
  plan: PackagePlan;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const formSchema = z.object({
  phone: z.string(),
  location: z.string(),
  plan: z.custom<PackagePlan>(),
});

// ~ ======= Submit handler ======= ~
const onSubmit = async (formData: z.infer<typeof formSchema>) => {
  console.log(formData);
};

const VoipPhonePickerDialog: FC<ComponentProps> = ({ plan, open, setOpen }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      plan,
    },
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
    shouldFocusError: true,
    shouldUseNativeValidation: false,
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Choose Phone{" "}
            <span className="text-muted-foreground">({plan.name})</span>
          </DialogTitle>
          <DialogDescription>
            Choose a phone number for your VoIP package.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full lg:max-w-lg">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-y-3"
            >
              {/* Phone number */}
              <FormField
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>{" "}
                    <FormMessage />
                  </FormItem>
                )}
                name="phone"
              />

              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Loaction</FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Service location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="london">London</SelectItem>
                          <SelectItem value="Oxford">Oxford</SelectItem>
                          <SelectItem value="manchester">Manchester</SelectItem>
                          <SelectItem value="leeds">Leeds</SelectItem>
                          <SelectItem value="newcastle">Newcastle</SelectItem>
                          <SelectItem value="birmingham">Birmingham</SelectItem>
                          <SelectItem value="liverpool">Liverpool</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
                name="location"
              />

              <DialogFooter className="mt-5 w-full">
                <Button variant="outline">Cancel</Button>
                <Button>Get service</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoipPhonePickerDialog;
