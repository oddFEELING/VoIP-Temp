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
// ~ ======= create user profile from callback  -->
// ~ =============================================>
export const createUserProfilesFromCallback = async (user: User) => {
  try {
    const exists = await getSingle(
      db.select().from(profiles).where(eq(profiles.id, user.id)),
    );

    if (exists) return exists;

    // Extract and validate required fields
    const fullName =
      user.user_metadata.full_name || user.email?.split("@")[0] || "User";
    const [firstName, ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ") || "User";
    const email = user.email;

    if (!email) {
      throw new Error("Email is required for profile creation");
    }

    // Log user data for debugging
    appLogger.info({
      message: "Creating profile for user",
      data: {
        id: user.id,
        firstName,
        lastName,
        email,
        metadata: user.user_metadata,
      },
    });

    // Create the profile
    const insertResult = await db
      .insert(profiles)
      .values({
        id: user.id,
        firstName,
        lastName,
        email,
        imageUrl:
          user.user_metadata.avatar_url ??
          generateDiceBearUrl(`${firstName} ${lastName}`),
      })
      .returning();

    appLogger.info({ insertResult });

    const profile = insertResult[0];

    if (!profile) {
      throw new Error(
        "Profile creation failed - no profile returned from insert",
      );
    }

    return profile;
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
