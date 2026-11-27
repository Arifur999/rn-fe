import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./sessionConstants";

// The API's session token lives in an httpOnly cookie on this site. The
// browser never reads it; the Next.js server forwards it as a Bearer token.

export { SESSION_COOKIE, SESSION_EXPIRED_REASON } from "./sessionConstants";

export const getSessionToken = async (): Promise<string | undefined> => (await cookies()).get(SESSION_COOKIE)?.value;

export const setSessionToken = async (token: string, expiresAt: string) => {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
};

export const clearSessionToken = async () => {
  (await cookies()).delete(SESSION_COOKIE);
};
