import { Supabase } from "@/services/db/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

const updateSession = async (request: NextRequest) => {
  let supabase_response = NextResponse.next({ request });

  // ~ ======= create client instance -->
  const client = new Supabase().ssr_client();

  const {
    data: { user },
  } = await client.auth.getUser();

  // ~ ======= redirect to sign in if there is no current user -->
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/signin") &&
    !request.nextUrl.pathname.startsWith("/auth") // todo: check that this should be here
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // ~ ======= return response -->
  return supabase_response;
};

export { updateSession };
