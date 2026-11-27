import type { MetadataRoute } from "next";
import { APP_NAME } from "@/constants/bn";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description: "গাড়ি, ড্রাইভার, ট্রিপ আর খরচের সহজ হিসাব",
    lang: "bn",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f4f6fb",
    theme_color: "#1e40af",
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
