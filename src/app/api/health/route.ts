import { NextResponse } from "next/server";
import { isLocalOnlyMode } from "@/lib/supabase/env";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "mindreset-kathu",
    version: 1,
    localOnly: isLocalOnlyMode(),
    timestamp: new Date().toISOString(),
  });
}
