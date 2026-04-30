import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://safaryat.net/ar", lastModified: new Date(), priority: 1 },
    { url: "https://safaryat.net/en", lastModified: new Date(), priority: 1 },
    { url: "https://safaryat.net/ar/login", lastModified: new Date(), priority: 0.8 },
    { url: "https://safaryat.net/en/login", lastModified: new Date(), priority: 0.8 },
  ];
}
