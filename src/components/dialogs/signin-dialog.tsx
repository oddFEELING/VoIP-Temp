"use client";

import { useState } from "react";
import { createClient } from "@/services/db/supabase/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { ChevronRight, Mail } from "lucide-react";
import { useTheme } from "next-themes";
import useUser from "@/hooks/use-user";

// ~ ======= Form schema for validation =======  ~
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// ~ ======= Abstract pattern component =======  ~
const AbstractPattern = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative h-full w-full overflow-hidden bg-primary/5 dark:bg-secondary/5">
      <svg
        className="absolute inset-0 h-[200%] w-[200%] -translate-x-1/4 -translate-y-1/4"
        viewBox="0 0 1600 1600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{
                stopColor: isDark
                  ? "rgba(147, 51, 234, 0.12)"
                  : "rgba(147, 51, 234, 0.05)",
              }}
            />
            <stop
              offset="100%"
              style={{
                stopColor: isDark
                  ? "rgba(147, 51, 234, 0.08)"
                  : "rgba(147, 51, 234, 0.12)",
              }}
            />
          </linearGradient>
          <pattern
            id="circles"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(0)"
          >
            <circle cx="50" cy="50" r="30" fill="url(#gradient)">
              <animate
                attributeName="r"
                values="30;34;30"
                dur="5s"
                repeatCount="indefinite"
              />
            </circle>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circles)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 800 800"
            to="360 800 800"
            dur="180s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  );
};

const SignInDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const { linkGoogleWithIdentity } = useUser();

  // ~ ======= Form setup with validation =======  ~
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // ~ ======= Handle magic link sign in =======  ~
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Check your email for the login link!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send login link");
    } finally {
      setIsLoading(false);
    }
  };

  // ~ ======= Handle Google sign in =======  ~
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await linkGoogleWithIdentity();
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-[900px]">
        <div className="flex">
          {/* ~ ======= Left side - Content --> */}
          <div className="flex w-full items-center justify-center p-12 md:w-1/2">
            <div className="w-full max-w-[340px] space-y-8">
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-center text-3xl font-semibold tracking-tight text-primary dark:text-secondary">
                  Welcome back
                </DialogTitle>
                <p className="text-center text-sm text-muted-foreground">
                  Sign in to continue to your account
                </p>
              </DialogHeader>

              <div className="space-y-6">
                {/* ~ ======= Google Sign In --> */}
                <Button
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  disabled={isLoading}
                  className="flex h-12 w-full items-center justify-center gap-3 border-2 py-6 text-[15px]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* ~ ======= Separator --> */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-4 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* ~ ======= Email Form --> */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative flex items-center">
                              <Mail
                                size={18}
                                strokeWidth={1.5}
                                className="absolute left-3 text-muted-foreground/70"
                              />
                              <Input
                                placeholder="Email"
                                className="h-12 pl-10"
                                {...field}
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-[15px]"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending link..." : "Continue with Email"}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Terms Text */}
              <p className="text-center text-[13px] leading-relaxed text-muted-foreground">
                By continuing, you agree to our{" "}
                <span className="underline">Terms of Service</span> and{" "}
                <span className="underline">Privacy Policy</span>
              </p>
            </div>
          </div>

          {/* Right side - Abstract Pattern */}
          <div className="hidden w-1/2 md:block">
            <AbstractPattern />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
