import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = "https://levatahq.com";
    const now = new Date();

    return [
        { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
        { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
        { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${base}/products/ai-intelligence`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        { url: `${base}/products/automation-systems`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        { url: `${base}/products/sales-intelligence-platform`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        { url: `${base}/products/digital-infrastructure`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        { url: `${base}/products/product-engineering`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ];
}
