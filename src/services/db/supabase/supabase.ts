import { createBrowserClient } from "@supabase/ssr";

const projectUrl = process.env.NEXT_PUBLIC_PROJECT_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!projectUrl || !supabaseAnonKey) {
  throw new Error("Failed to get database URL. Check env variables.");
}

export function createClient() {
  return createBrowserClient(projectUrl, supabaseAnonKey);
}
