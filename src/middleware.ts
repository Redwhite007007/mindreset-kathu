import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static, _next/image, favicon.ico
     * - /icons (PWA icons) and manifest + sw
     * - /callback (handles its own exchange)
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.webmanifest|sw.js|callback).*)",
  ],
};
