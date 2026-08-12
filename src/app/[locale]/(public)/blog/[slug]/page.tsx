import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { blogPosts, getPostBySlug } from "@/lib/blog";
import type { Metadata } from "next";
import { Clock, Tag, ChevronRight, ArrowRight } from "lucide-react";

import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `https://canaryvillas.com/blog/${slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://canaryvillas.com/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.heroImage, width: 1200, height: 800, alt: post.heroAlt }],
    },
    twitter: { card: "summary_large_image", title: post.metaTitle, description: post.metaDescription, images: [post.heroImage] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const prefix = locale === "en" ? "" : `/${locale}`;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = blogPosts
    .filter((p) => p.slug !== slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    image: post.heroImage,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Canary Villas", url: "https://canaryvillas.com" },
    publisher: {
      "@type": "Organization",
      name: "Canary Villas",
      logo: { "@type": "ImageObject", url: "https://canaryvillas.com/favicon.ico" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://canaryvillas.com/blog/${slug}` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://canaryvillas.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://canaryvillas.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://canaryvillas.com/blog/${slug}` },
    ],
  };

  const faqSchema = post.faqs && post.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <div className="pt-16 min-h-screen">
        {/* Hero */}
        <div className="relative h-72 md:h-[450px]">
          <Image src={post.heroImage} alt={post.heroAlt} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
            <nav className="flex items-center gap-1 text-xs text-gray-300 mb-3">
              <Link href={`${prefix}/`} className="hover:text-white">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`${prefix}/blog`} className="hover:text-white">Blog</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">{post.category}</span>
            </nav>
            <span className="inline-block bg-sky-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {post.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {t("minRead", { n: post.readTime })}
              </span>
              <span>
                {new Date(post.date).toLocaleDateString(locale === "en" ? "en-GB" : locale, { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <article className="lg:col-span-2">
              <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-sky-400 pl-4">
                {post.excerpt}
              </p>

              <div
                className="prose prose-lg max-w-none prose-headings:font-extrabold prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-800 prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    <Tag className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>

              {/* FAQ Section */}
              {post.faqs && post.faqs.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{t("faq")}</h2>
                  <div className="space-y-4">
                    {post.faqs.map((faq, i) => (
                      <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-900 hover:text-sky-600">
                          {faq.q}
                          <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-3" />
                        </summary>
                        <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                          {faq.a}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Villa CTA */}
              <div className="bg-sky-600 rounded-2xl p-6 text-white sticky top-20">
                <h3 className="text-xl font-extrabold mb-2">{t("stayHeading")}</h3>
                <p className="text-sky-100 text-sm mb-4 leading-relaxed">{t("stayDesc")}</p>
                <Link
                  href={`${prefix}/villas`}
                  className="flex items-center justify-center gap-2 bg-white text-sky-600 font-bold px-5 py-3 rounded-full hover:bg-sky-50 transition-colors w-full text-sm"
                >
                  {t("viewVillas")} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`${prefix}/contact`}
                  className="flex items-center justify-center gap-2 border border-sky-400 text-white font-medium px-5 py-2.5 rounded-full hover:bg-sky-700 transition-colors w-full text-sm mt-2"
                >
                  {t("askQuestion")}
                </Link>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">{t("relatedArticles")}</h3>
                  <div className="space-y-4">
                    {related.map((rp) => (
                      <Link
                        key={rp.slug}
                        href={`${prefix}/blog/${rp.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image src={rp.heroImage} alt={rp.heroAlt} fill className="object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div>
                          <p className="text-xs text-sky-500 font-semibold mb-0.5">{rp.category}</p>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-sky-600 transition-colors leading-snug line-clamp-2">
                            {rp.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{t("minRead", { n: rp.readTime })}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* All categories */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">{t("browseCategory")}</h3>
                <div className="flex flex-wrap gap-2">
                  <Link href={`${prefix}/blog`} className="text-xs bg-gray-100 hover:bg-sky-100 hover:text-sky-700 text-gray-600 px-3 py-1.5 rounded-full transition-colors">
                    {t("allPosts")}
                  </Link>
                  {["Watersports", "Beaches", "Travel Guide", "Food & Drink", "Nature", "Activities"].map((cat) => (
                    <Link
                      key={cat}
                      href={`${prefix}/blog?category=${encodeURIComponent(cat)}`}
                      className="text-xs bg-gray-100 hover:bg-sky-100 hover:text-sky-700 text-gray-600 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
