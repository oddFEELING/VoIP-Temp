"use server";

import { Supabase } from "@/services/db/supabase/server";
import { redirect } from "next/navigation";
import { generateDiceBearUrl, getSingle } from "@/lib/utils";
import db from "@/services/db";
import { profiles } from "@/schemas/profiles.schema";
import { appLogger } from "@/lib/logger";
import { eq } from "drizzle-orm";
import { User } from "@supabase/auth-js";

// ~ =============================================>
// ~ ======= Get surrent user   -->
// ~ =============================================>
export const getCurrentUser = async () => {
  const supabase = new Supabase().ssr_client();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// ~ =============================================>
// ~ ======= Sign out  -->
// ~ =============================================>
export const signOut = async () => {
  const supabase = new Supabase().ssr_client();
  await supabase.auth.signOut();
  redirect("/");
};

// ~ =============================================>
// ~ ======= Check if user exists  -->
// ~ =============================================>
export const checkGoogleAccountExists = async (email: string) => {
  return await getSingle(
    db.select().from(profiles).where(eq(profiles.email, email)),
  );
};

// ~ =============================================>
// ~ ======= Sign in with email  -->
// ~ =============================================>
export const signInWithEmail = async (email: string, password: string) => {
  const client = new Supabase().ssr_client();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    appLogger.error(error);
    return null;
  }

  return data;
};
// ~ =============================================>
// ~ ======= Sign in with Google  -->
// ~ =============================================>
export const signInWithGoogle = async () => {
  const client = new Supabase().ssr_client();
  const { data, error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.HOST}/auth/callback`,
    },
  });

  if (error) {
    appLogger.error(error);
    return null;
  }

  if (data.url) {
    redirect(data.url);
  }
};

// ~ =============================================>
// ~ ======= Link google identity  -->
// ~ =============================================>
export const linkGoogleIdentity = async () => {
  const client = new Supabase().ssr_client();
  const { data, error } = await client.auth.linkIdentity({
    provider: "google",
    options: {
      redirectTo: `${process.env.HOST}/auth/callback`,
    },
  });

  if (error) {
    appLogger.error(error);
    return null;
  }

  if (data.url) {
    redirect(data.url);
  }
};

// ~ =============================================>
// ~ ======= Link email identity   -->
// ~ =============================================>
export const linkEmailIdentity = async (email: string, password: string) => {
  const client = new Supabase().ssr_client();
  const { data, error } = await client.auth.updateUser({
    email,
    password,
  });

  if (error) {
    appLogger.error(error);
    return null;
  }

  return data;
};

// ~ =============================================>
// ~ ======= create user profile from callback  -->
// ~ =============================================>
export const createUserProfilesFromCallback = async (user: User) => {
  try {
    const exists = await getSingle(
      db.select().from(profiles).where(eq(profiles.id, user.id)),
    );

    if (exists) return exists;

    if (user) {
      // ~ ======= Get google identitty -->
      const googleProviders =
        user.identities &&
        user.identities.filter((identity) => identity.provider === "google");

      if (!googleProviders) {
        throw new Error("Email is required for profile creation");
      }

      // ~ ======= Get full name  -->
      const fullName = googleProviders![0].identity_data?.full_name;
      const [firstName, lastName] = fullName.split(" ");
      const email = googleProviders![0].identity_data?.email;
      const emailVerified = googleProviders![0].identity_data?.email_verified;
      const imageUrl = googleProviders![0].identity_data?.avatar_url;

      console.log({
        id: user.id,
        firstName,
        lastName,
        email,
        emailVerified,
        imageUrl: imageUrl ?? generateDiceBearUrl(`${firstName} ${lastName}`),
      });

      // ~ ======= Create profile -->
      const newProfile = await getSingle(
        db
          .insert(profiles)
          .values({
            id: user.id,
            firstName,
            lastName,
            email,
            emailVerified,
            imageUrl:
              imageUrl ?? generateDiceBearUrl(`${firstName} ${lastName}`),
          })
          .returning(),
      );

      if (!newProfile) {
        throw new Error(
          "Profile creation failed - no profile returned from insert",
        );
      }

      return newProfile;
    }
  } catch (error) {
    appLogger.error({
      message: "Profile creation error",
      error,
    });
    throw new Error(
      `Failed to create user profile: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

// ~ =============================================>
// ~ ======= Get user profile  -->
// ~ =============================================>
export const getUserProfile = async (userId: string) => {
  return await getSingle(
    db.select().from(profiles).where(eq(profiles.id, userId)),
  );
};

// ~ =============================================>
// ~ ======= Update user profile  -->
// ~ =============================================>
export const updateUserProfile = async (
  userId: string,
  data: Partial<typeof profiles.$inferInsert>,
) => {
  return await getSingle(
    db.update(profiles).set(data).where(eq(profiles.id, userId)).returning(),
  );
};
