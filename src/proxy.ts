import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_EXPIRED_REASON } from "./lib/sessionConstants";

// Next 16's middleware. A UX gate only: the API checks the session on every call.
//   no cookie            -> /login
//   cookie + /login      -> /dashboard
//   /login?reason=expired -> clear the dead cookie (a Server Component cannot)
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (pathname === "/login") {
    if (searchParams.get("reason") === SESSION_EXPIRED_REASON) {
      const response = NextResponse.next();
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }
    return hasSession ? NextResponse.redirect(new URL("/dashboard", request.url)) : NextResponse.next();
  }

  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|icon|apple-icon|pwa-icon|manifest.webmanifest|robots.txt).*)"],
};
