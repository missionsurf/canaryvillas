import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Skip API routes, admin, static files, and Next.js internals
    "/((?!api|admin|_next|_vercel|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
