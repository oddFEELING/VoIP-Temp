import { NextResponse } from "next/server";
import { Supabase } from "@/services/db/supabase/server";
import {
  createUserProfilesFromCallback,
  signInWithGoogle,
} from "@/actions/auth.actions";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const error_code = searchParams.get("error_code");
  console.log(error_code);

  if (code) {
    const supabase = new Supabase().ssr_client();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await createUserProfilesFromCallback(data.user);
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  if (error_code) {
    if (error_code.includes("identity_already_exists")) {
      console.log("identity_already_exists");

      await signInWithGoogle();
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}${next}/auth/auth-code-error`);
}
