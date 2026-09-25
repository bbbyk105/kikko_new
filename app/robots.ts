import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
