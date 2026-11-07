import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard crawlers — full access except admin/api
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      // OpenAI — allow indexing for ChatGPT search & recommendations
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      // OpenAI OAI-SearchBot (ChatGPT search)
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      // Anthropic Claude
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      // Perplexity AI
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      // Google Gemini / AI Overviews training data
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      // Apple AI
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      // Amazon Alexa / Rufus shopping AI
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      // Meta AI
      {
        userAgent: "FacebookBot",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      // Cohere AI
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      // You.com AI search
      {
        userAgent: "YouBot",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: "https://www.canaryvillas.com/sitemap.xml",
    host: "https://www.canaryvillas.com",
  };
}
