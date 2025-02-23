"use client";

import { User } from "@supabase/auth-js";
import { createClient } from "@/services/db/supabase/supabase";
import { appLogger } from "@/lib/logger";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getUserProfile,
  linkGoogleIdentity,
  signInWithGoogle,
  updateUserProfile,
} from "@/actions/auth.actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profiles } from "@/services/db/schema/profiles.schema";
import { toast } from "sonner";

// ~ ======= Auth set to hold users & their anonymous status -->
const subscribers = new Set<
  (user: User | null, isAnonymous: boolean) => void
>();

// ~ ======= Create Supabase client -->
const supabase = createClient();

// ~ ======= Subscribe to all auth events -->
supabase.auth.onAuthStateChange((event, session) => {
  appLogger.info({
    message: "@onAuthStateChange",
    event,
    session,
  });
  if (session?.user) {
    appLogger.info({
      message: "User session found",
      userId: session.user.id,
      isAnonymous: session.user.is_anonymous,
    });
    subscribers.forEach((callback) =>
      callback(session.user, session.user.is_anonymous === true),
    );
  } else {
    appLogger.info({
      message: "No user session",
    });
    subscribers.forEach((callback) => callback(null, true));
  }
});

// ~ =============================================>
// ~ ======= Main hook for user state  -->
// ~ =============================================>
const useUser = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);

  useEffect(() => {
    // ~ ======= Get initial session on mount -->
    const initializeSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          setIsAnonymous(session.user.is_anonymous === true);
        } else {
          setUser(null);
          setIsAnonymous(true);
        }
      } catch (error) {
        appLogger.error({
          message: "Failed to get initial session",
          error,
        });
      } finally {
        setIsReady(true);
      }
    };

    initializeSession();

    // ~ ======= Subscribe to auth changes -->
    subscribers.add((user, isAnonymous) => {
      setUser(user);
      setIsAnonymous(isAnonymous);
      setIsReady(true);
    });

    // ~ ======= Cleanup subscription -->
    return () => {
      subscribers.clear();
    };
  }, []);

  // ~ ======= Sign out user -->
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAnonymous(false);
      router.replace("/");
    } catch (error) {
      appLogger.error({
        message: "Failed to sign out",
        error,
      });
    }
  };

  // ~ ======= Google sign in -->
  const googleSignIn = async () => {
    return await signInWithGoogle();
  };

  // ~ ======= google link -->
  const linkGoogleWithIdentity = async () => {
    return await linkGoogleIdentity();
  };

  // ~ ======= Get user profile -->
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: () => getUserProfile(user?.id ?? ""),
    enabled: !!user?.id,
  });

  return {
    isReady,
    user,
    isAnonymous,
    signOut,
    googleSignIn,
    linkGoogleWithIdentity,
    profile,
    isProfileLoading,
  };
};

export default useUser;

// ~ =============================================>
// ~ ======= useMutate user hook  -->
// ~ =============================================>
export const useMutateUser = () => {
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (args: {
      userId: string;
      data: Partial<typeof profiles.$inferInsert>;
    }) => updateUserProfile(args.userId, args.data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", data?.id] });
      toast.success("Profile updated successfully");
    },

    onError: (error) => {
      appLogger.error({
        message: "Failed to update profile",
        error,
      });
      toast.error("Failed to update profile");
    },
  });

  return { updateProfile, isUpdatingProfile };
};
