"use client";

import { User } from "@supabase/auth-js";
import { createClient } from "@/services/db/supabase/supabase";
import { appLogger } from "@/lib/logger";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getUserProfile,
  linkGoogleIdentity,
  linkEmailIdentity as linkEmailIdentityAction,
  signInWithGoogle,
  signInWithEmail as signInWithEmailAction,
  updateUserProfile,
} from "@/actions/auth.actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profiles } from "@/services/db/schema/profiles.schema";
import { toast } from "sonner";
import {
  createAddress as createAddressAction,
  deleteAddress as deleteAddressAction,
  updateAddress as updateAddressAction,
  getAddresses as getAddressesAction,
  createUserProfile as createUserProfileAction,
} from "@/actions/user.actions";
import { userAddresses } from "@/services/db/schema/address.schema";
import { cache_24_hours } from "./cache-info";

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

  // ~ ======= Sign in with email -->
  const signInWithEmail = async (email: string, password: string) => {
    return await signInWithEmailAction(email, password);
  };

  // ~ ======= Link email identity -->
  const linkEmailIdentity = async (email: string, password: string) => {
    return await linkEmailIdentityAction(email, password);
  };

  // ~ ======= Google sign in -->
  const googleSignIn = async () => {
    return await signInWithGoogle();
  };

  // ~ ======= google link -->
  const linkGoogleWithIdentity = async () => {
    return await linkGoogleIdentity();
  };

  // ~ ======= Update user email -->
  const updateUserEmail = async (email: string) => {
    return await supabase.auth.updateUser({ email });
  };

  const updateUserPassword = async (password: string) => {
    return await supabase.auth.updateUser({ password });
  };

  // ~ ======= Get user profile -->
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: () => getUserProfile(user?.id ?? ""),
    enabled: !!user?.id,
  });

  // ~ ======= Get user addresses -->
  const { data: addresses, isLoading: isAddressesLoading } = useQuery({
    queryKey: ["user-addresses", user?.id],
    queryFn: () => getAddressesAction(user?.id ?? ""),
    enabled: !!user?.id,
    ...cache_24_hours,
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
    addresses,
    isAddressesLoading,
    updateUserEmail,
    updateUserPassword,
    signInWithEmail,
    linkEmailIdentity,
  };
};

export default useUser;

// ~ =============================================>
// ~ ======= useMutate user hook  -->
// ~ =============================================>
export const useMutateUser = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  // ~ ======= Create user profile  -->
  const { mutate: createUserProfile, isPending: isCreatingUserProfile } =
    useMutation({
      mutationFn: async (user: typeof profiles.$inferInsert) =>
        await createUserProfileAction(user),

      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["user-profile", data?.id] });
        toast.success("Profile created successfully");
      },

      onError: (error) => {
        appLogger.error({
          message: "Failed to create profile",
          error,
        });
        toast.error("Failed to create profile");
      },
    });

  // ~ ======= Update User Profile  -->
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

  // ~ ======= Create user Address  -->
  const { mutate: createAddress, isPending: isCreatingAddress } = useMutation({
    mutationFn: async (data: typeof userAddresses.$inferInsert) =>
      await createAddressAction({ ...data, userId: user?.id }),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses", user?.id] });
      toast.success("Address created successfully");
    },

    onError: (error) => {
      appLogger.error({
        message: "Failed to create address",
        error,
      });
      toast.error("Failed to create address");
    },
  });

  // ~ ======= Update user Address  -->
  const { mutate: updateAddress, isPending: isUpdatingAddress } = useMutation({
    mutationFn: async (args: {
      addressId: string;
      data: Partial<typeof userAddresses.$inferSelect>;
    }) => await updateAddressAction(args.addressId, args.data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses", data?.id] });
      toast.success("Address updated successfully");
    },

    onError: (error) => {
      appLogger.error({
        message: "Failed to update address",
        error,
      });
      toast.error("Failed to update address");
    },
  });

  // ~ ======= Delete user Address  -->
  const { mutate: deleteAddress, isPending: isDeletingAddress } = useMutation({
    mutationFn: async (addressId: string) =>
      await deleteAddressAction(addressId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      toast.success("Address deleted successfully");
    },

    onError: (error) => {
      appLogger.error({
        message: "Failed to delete address",
        error,
      });
      toast.error("Failed to delete address");
    },
  });

  return {
    updateProfile,
    isUpdatingProfile,
    createAddress,
    isCreatingAddress,
    updateAddress,
    isUpdatingAddress,
    deleteAddress,
    isDeletingAddress,
    createUserProfile,
    isCreatingUserProfile,
  };
};
