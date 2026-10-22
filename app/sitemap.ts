import type { MetadataRoute } from "next";
import { siteConfig, spaceCategories } from "@/app/data/site";

const pages: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/space", priority: 0.9 },
  ...spaceCategories.map((category) => ({ path: `/space/${category.id}`, priority: 0.8 })),
  { path: "/pricing", priority: 0.9 },
  { path: "/access", priority: 0.7 },
  { path: "/faq", priority: 0.6 },
  { path: "/reserve", priority: 0.8 },
  { path: "/contact", priority: 0.6 },
  { path: "/privacy", priority: 0.2 },
];

/** canonical と同じ URL にする。トップは Next が末尾スラッシュを付けない */
function absoluteUrl(path: string): string {
  if (path === "/") return siteConfig.url;
  return new URL(path, `${siteConfig.url}/`).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    lastModified: siteConfig.contentUpdated,
    changeFrequency: "monthly",
    priority,
  }));
}
