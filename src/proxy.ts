import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PRIVATE = ["/add-studio", "/my-listings", "/my-bookings", "/dashboard", "/studios/edit"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PRIVATE.some((p) => pathname.startsWith(p)) && !getSessionCookie(req)) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };