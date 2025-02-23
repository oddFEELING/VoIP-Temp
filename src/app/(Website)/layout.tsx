"use client";

import WebsiteNavBar from "@/components/navigation/website-navbar";
import useUser from "@/hooks/use-user";
import { createClient } from "@/services/db/supabase/supabase";
import { useEffect, useRef } from "react";
import { appLogger } from "@/lib/logger";

type WebsiteLayoutProps = {
  children: React.ReactNode;
};

const WebsiteLayout: React.FC<WebsiteLayoutProps> = ({ children }) => {
  const { user, isReady, isAnonymous } = useUser();
  const supabase = createClient();
  const isCreatingAnonUser = useRef<boolean>(false);

  // ~ ======= Handle anonymous sign-in -->
  useEffect(() => {
    const handleAnonymousSignIn = async () => {
      if (!isReady || user || isCreatingAnonUser.current) return;

      try {
        isCreatingAnonUser.current = true;
        appLogger.info({
          message: "Attempting anonymous sign-in",
        });

        const { error, data } = await supabase.auth.signInAnonymously();

        if (error) {
          throw error;
        }

        appLogger.info({
          message: "Anonymous sign-in successful",
          userId: data.user?.id,
        });
      } catch (error) {
        appLogger.error({
          message: "Failed to create anonymous user",
          error,
        });
      } finally {
        isCreatingAnonUser.current = false;
      }
    };

    handleAnonymousSignIn();
  }, [isReady, user, supabase.auth]);

  return (
    <>
      <WebsiteNavBar />
      {children}
    </>
  );
};

export default WebsiteLayout;
