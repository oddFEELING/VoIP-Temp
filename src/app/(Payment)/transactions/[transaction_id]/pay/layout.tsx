"use client";

import usePayment from "@/hooks/use-payment";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

/* ~ =================================== ~ */
/* -- Layout props type definition -- */
/* ~ =================================== ~ */
type LayoutProps = {
  children: React.ReactNode;
};

/* ~ =================================== ~ */
/* -- Payment layout component that handles payment initialization check -- */
/* ~ =================================== ~ */
const PaymentLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { initaited } = usePayment();
  const [isLoading, setIsLoading] = useState(true);

  // ~ ======= Check payment initialization and handle redirect ======= ~
  useEffect(() => {
    if (!initaited) {
      router.replace("/");
    } else {
      setIsLoading(false);
    }
  }, [initaited, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
};

export default PaymentLayout;
