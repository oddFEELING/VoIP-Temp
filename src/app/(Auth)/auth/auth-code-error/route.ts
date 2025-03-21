import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // ~ ======= Extract error information from URL hash ======= ~
  const url = request.url;

  // console.log(url);

  // ~ ======= Check for identity_already_exists error ======= ~
  if (url.includes("error_code=identity_already_exists")) {
    // ~ ======= Redirect to a more user-friendly page ======= ~
    return redirect("/auth/user-exists");
  }

  // ~ ======= For other errors, redirect to a general error page ======= ~
  return redirect("/auth/error");
}
