import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";
import { Toaster } from "sonner";
import { APP_NAME } from "@/constants/bn";
import "./globals.css";

const bangla = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
  description: "গাড়ি, ড্রাইভার, ট্রিপ আর খরচের সহজ হিসাব",
  applicationName: APP_NAME,
  appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: "default" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1e40af",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" className={bangla.variable}>
      <body className="min-h-dvh antialiased">
        {children}
        <Toaster position="top-center" richColors closeButton toastOptions={{ style: { fontFamily: "var(--font-sans)" } }} />
      </body>
    </html>
  );
}
