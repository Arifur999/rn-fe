import "server-only";

// Server-only settings. The API URL is never sent to the browser: every API
// call happens on the Next.js server (services/*), so there is no NEXT_PUBLIC_.
export const getEnv = () => {
  const apiBaseUrl = process.env.API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API_BASE_URL is not set (e.g. http://localhost:5000/api/v1)");
  }
  return {
    API_BASE_URL: apiBaseUrl.replace(/\/$/, ""),
    IS_PRODUCTION: process.env.NODE_ENV === "production",
  };
};
