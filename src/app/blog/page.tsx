import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatDate, listArticles } from "@/lib/content-api";
import {
  BLOG_DESCRIPTION,
  BLOG_PATH,
  BLOG_TITLE,
  SITE_NAME,
  siteUrl,
} from "@/lib/site";

// Rendered on demand and cached, not prerendered at build time. The articles
// come from the central platform, so a build must not depend on that platform
// being reachable — a deployment that cannot be built when someone else's
// service is down is a deployment that cannot be rolled back in an incident.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  alternates: {
    // Canonical to this domain. The same article also exists on the central
    // hub under its own canonical; each copy points at itself as the canonical
    // for its own domain, which is what stops the two competing in search.
    canonical: BLOG_PATH,
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    type: "website",
    title: `${BLOG_TITLE} | ${SITE_NAME}`,
    description: BLOG_DESCRIPTION,
    url: `${siteUrl()}${BLOG_PATH}`,
    siteName: SITE_NAME,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image", title: BLOG_TITLE },
  robots: { index: true, follow: true },
};

export default async function BlogIndex() {
  const { articles, truncated } = await listArticles();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${BLOG_TITLE} | ${SITE_NAME}`,
    description: BLOG_DESCRIPTION,
    url: `${siteUrl()}${BLOG_PATH}`,
    inLanguage: "en-GB",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl(),
    },
    // Only what is actually on this page. No aggregate ratings or counts that
    // nothing here substantiates.
    blogPost: articles.slice(0, 20).map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      description: article.meta_description || article.excerpt,
      url: `${siteUrl()}${BLOG_PATH}/${article.slug}`,
      datePublished: article.published_at ?? undefined,
      dateModified: article.updated_at ?? undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main" className="pt-24 md:pt-28 pb-20 md:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="max-w-3xl mb-12">
            <p className="text-green-600 font-semibold text-sm tracking-wider uppercase mb-2">
              Advice &amp; Guides
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              {BLOG_TITLE}
            </h1>
            <p className="text-gray-600 mt-4 text-lg leading-relaxed">
              {BLOG_DESCRIPTION}
            </p>
          </header>

          {articles.length === 0 ? (
            // The empty state covers a genuinely empty blog and an unreachable
            // content platform alike. It deliberately does not say "error":
            // from a visitor's point of view there is simply nothing to read
            // yet, and the page itself is fine.
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-10 text-center">
              <h2 className="font-display text-xl font-semibold text-gray-900">
                No articles just yet
              </h2>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                We are working on our travel guides. In the meantime, call{" "}
                <a
                  href="tel:01273220220"
                  className="text-green-600 font-semibold hover:text-green-700"
                >
                  01273 220220
                </a>{" "}
                and we will help you plan your journey.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <article
                  key={article.slug}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow"
                >
                  <Link
                    href={`${BLOG_PATH}/${article.slug}`}
                    className="block relative h-44 overflow-hidden bg-gray-100"
                  >
                    {article.image_url ? (
                      // Plain img, not next/image: these URLs come from the
                      // central platform's image providers and the set of
                      // hostnames is not known at build time, which
                      // next/image requires. Width and height are set to
                      // reserve the space and avoid layout shift.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.image_url}
                        alt={article.image_alt || article.title}
                        width={640}
                        height={360}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}

                    {article.category ? (
                      <span className="absolute top-3 left-3 bg-green-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    ) : null}
                  </Link>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      {article.published_at ? (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          <time dateTime={article.published_at}>
                            {formatDate(article.published_at)}
                          </time>
                        </span>
                      ) : null}

                      {article.reading_minutes ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={14} />
                          {article.reading_minutes} min read
                        </span>
                      ) : null}
                    </div>

                    <h2 className="font-display text-lg font-semibold text-gray-900 leading-snug">
                      <Link
                        href={`${BLOG_PATH}/${article.slug}`}
                        className="hover:text-green-600 transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-gray-600 mt-2 leading-relaxed flex-1">
                      {article.excerpt || article.meta_description}
                    </p>

                    <Link
                      href={`${BLOG_PATH}/${article.slug}`}
                      className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm mt-4 hover:text-green-700 transition-colors"
                      aria-label={`Read ${article.title}`}
                    >
                      Read more
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {truncated ? (
            // Honest about a partial list rather than silently showing fewer
            // articles than exist.
            <p className="text-sm text-gray-500 mt-8">
              Some older articles could not be loaded just now. Please refresh
              shortly.
            </p>
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
}
