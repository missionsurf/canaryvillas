import Link from "next/link";
import Image from "next/image";
import { blogPosts, categories } from "@/lib/blog";
import type { Metadata } from "next";
import { Clock, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Fuerteventura Travel Blog — Guides, Tips & Local Insider Info | Canary Villas",
  description: "Discover the best of Fuerteventura with our expert travel guides. Watersports, beaches, restaurants, day trips, and everything you need to plan the perfect Canary Islands holiday.",
alternates: { canonical: "https://canaryvillas.com/blog" },
  openGraph: {
    title: "Fuerteventura Travel Blog | Canary Villas",
    description: "Expert guides to beaches, watersports, restaurants and day trips in Fuerteventura.",
    url: "https://canaryvillas.com/blog",
    images: [{ url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80", width: 1200, height: 630 }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Canary Villas — Fuerteventura Travel Blog",
  url: "https://canaryvillas.com/blog",
  description: "Expert travel guides to Fuerteventura, Corralejo and the Canary Islands",
  publisher: {
    "@type": "Organization",
    name: "Canary Villas",
    url: "https://canaryvillas.com",
  },
};

export default function BlogIndexPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams?.category || "All";
  const filtered =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

  const featured = blogPosts[0];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="pt-16 min-h-screen bg-gray-50">
        {/* Hero / Featured Post */}
        <div className="relative h-80 md:h-96 flex items-end">
          <Image
            src={featured.heroImage}
            alt={featured.heroAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
            <span className="inline-block bg-sky-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Featured
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2 max-w-3xl">
              Fuerteventura Travel Blog
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-xl">
              Expert guides, insider tips and everything you need for the perfect Canary Islands holiday.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {["All", ...categories].map((cat) => (
              <Link
                key={cat}
                href={cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-sky-500 text-white"
                    : "bg-white text-gray-600 border hover:border-sky-300 hover:text-sky-600"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Post grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.heroImage}
                    alt={post.heroAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-sky-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime} min read
                    </span>
                    <span>{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <h2 className="font-bold text-gray-900 mb-2 leading-snug group-hover:text-sky-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        <Tag className="w-2.5 h-2.5" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-20">No posts in this category yet.</p>
          )}

          {/* CTA */}
          <div className="mt-16 bg-sky-600 rounded-3xl p-10 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Ready to Visit Fuerteventura?</h2>
            <p className="text-sky-100 mb-6 max-w-xl mx-auto">
              Browse our hand-picked holiday villas in Corralejo and book direct for the best price — no fees, flexible cancellation.
            </p>
            <Link
              href="/villas"
              className="inline-block bg-white text-sky-600 font-bold px-8 py-3 rounded-full hover:bg-sky-50 transition-colors"
            >
              Browse Holiday Villas
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
