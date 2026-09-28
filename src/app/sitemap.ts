import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { toolsRegistry } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticPages = [
    "",
    "/tat-ca-cong-cu",
    "/gioi-thieu",
    "/chinh-sach-bao-mat",
    "/dieu-khoan-su-dung",
    "/lien-he",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const toolPages = toolsRegistry.map((tool) => ({
    url: `${baseUrl}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...toolPages];
}
