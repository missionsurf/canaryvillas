import { MetadataRoute } from "next";

// Private areas (also blocked under every locale prefix)
const PRIVATE = [
  "/admin",
  "/api/",
  "/account",
  "/booking",
  "/*/account",
  "/*/booking",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard crawlers — full access except admin/api
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE,
      },
      // OpenAI — allow indexing for ChatGPT search & recommendations
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: PRIVATE,
      },
      // OpenAI OAI-SearchBot (ChatGPT search)
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: PRIVATE,
      },
      // Anthropic Claude
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: PRIVATE,
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: PRIVATE,
      },
      // Perplexity AI
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: PRIVATE,
      },
      // Google Gemini / AI Overviews training data
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: PRIVATE,
      },
      // Apple AI
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: PRIVATE,
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: PRIVATE,
      },
      // Amazon Alexa / Rufus shopping AI
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: PRIVATE,
      },
      // Meta AI
      {
        userAgent: "FacebookBot",
        allow: "/",
        disallow: PRIVATE,
      },
      // Cohere AI
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: PRIVATE,
      },
      // You.com AI search
      {
        userAgent: "YouBot",
        allow: "/",
        disallow: PRIVATE,
      },
    ],
    sitemap: "https://www.canaryvillas.com/sitemap.xml",
    host: "https://www.canaryvillas.com",
  };
}
