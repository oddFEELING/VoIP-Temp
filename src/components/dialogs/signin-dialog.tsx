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
import { ChevronRight, Mail, Lock, User } from "lucide-react";
import { useTheme } from "next-themes";
import useUser from "@/hooks/use-user";

// ~ ======= Form schemas for validation =======  ~
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<"initial" | "details">("initial");
  const supabase = createClient();
  const { linkGoogleWithIdentity, googleSignIn } = useUser();

  // ~ ======= Form setup with validation =======  ~
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  // ~ ======= Handle email step submission =======  ~
  const onEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    try {
      setIsLoading(true);
      // Store email for next step
      if (isSignUp) {
        signUpForm.setValue("email", values.email);
      } else {
        signInForm.setValue("email", values.email);
      }
      setStep("details");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ~ ======= Handle sign in submission =======  ~
  const onSignInSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      toast.success("Successfully signed in!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  // ~ ======= Handle sign up submission =======  ~
  const onSignUpSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
        },
      });

      if (error) throw error;

      toast.success("Account created successfully!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  // ~ ======= Handle Google sign up =======  ~
  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      await linkGoogleWithIdentity();
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  // ~ ======= Handle Google sign in =======  ~
  const handleGoogleSignin = async () => {
    try {
      setIsLoading(true);
      await googleSignIn();
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  // ~ ======= Reset state when dialog closes =======  ~
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStep("initial");
      setIsSignUp(false);
      emailForm.reset();
      signInForm.reset();
      signUpForm.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-[900px]">
        <div className="flex">
          {/* ~ ======= Left side - Content ======= ~ */}
          <div className="flex w-full items-center justify-center p-12 md:w-1/2">
            <div className="w-full max-w-[340px] space-y-8">
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-center text-3xl font-semibold tracking-tight text-primary dark:text-secondary">
                  {step === "initial"
                    ? isSignUp
                      ? "Create an account"
                      : "Welcome back"
                    : isSignUp
                      ? "Complete signup"
                      : "Sign in"}
                </DialogTitle>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="ghost"
                    className={
                      !isSignUp ? "font-semibold" : "text-muted-foreground"
                    }
                    onClick={() => setIsSignUp(false)}
                    disabled={step === "details"}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="ghost"
                    className={
                      isSignUp ? "font-semibold" : "text-muted-foreground"
                    }
                    onClick={() => setIsSignUp(true)}
                    disabled={step === "details"}
                  >
                    Sign Up
                  </Button>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {step === "initial" ? (
                  <>
                    {/* ~ ======= Google Sign In ======= ~ */}
                    <Button
                      onClick={
                        isSignUp ? handleGoogleSignup : handleGoogleSignin
                      }
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

                    {/* ~ ======= Separator ======= ~ */}
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

                    {/* ~ ======= Email Form ======= ~ */}
                    <Form {...emailForm}>
                      <form
                        onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                        className="space-y-5"
                      >
                        <FormField
                          control={emailForm.control}
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
                          Continue
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </form>
                    </Form>
                  </>
                ) : (
                  /* ~ ======= Details Form ======= ~ */
                  <Form {...(isSignUp ? signUpForm : signInForm)}>
                    <form
                      onSubmit={
                        isSignUp
                          ? signUpForm.handleSubmit(onSignUpSubmit)
                          : signInForm.handleSubmit(onSignInSubmit)
                      }
                      className="space-y-5"
                    >
                      {isSignUp && (
                        <FormField
                          control={signUpForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative flex items-center">
                                  <User
                                    size={18}
                                    strokeWidth={1.5}
                                    className="absolute left-3 text-muted-foreground/70"
                                  />
                                  <Input
                                    placeholder="Full Name"
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
                      )}
                      <FormField
                        control={
                          isSignUp ? signUpForm.control : signInForm.control
                        }
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative flex items-center">
                                <Lock
                                  size={18}
                                  strokeWidth={1.5}
                                  className="absolute left-3 text-muted-foreground/70"
                                />
                                <Input
                                  type="password"
                                  placeholder="Password"
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
                        {isLoading
                          ? "Processing..."
                          : isSignUp
                            ? "Create Account"
                            : "Sign In"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => setStep("initial")}
                        disabled={isLoading}
                      >
                        Back
                      </Button>
                    </form>
                  </Form>
                )}
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
