import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatDate, getArticle } from "@/lib/content-api";
import { BLOG_PATH, BLOG_TITLE, SITE_NAME, articleUrl, siteUrl } from "@/lib/site";

// On demand, never at build time: the body lives on the central platform, and
// a build must not fail because that platform is unreachable.
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

/**
 * Per-article metadata.
 *
 * The canonical points at *this* domain, not the central hub. The hub holds
 * the same article under its own canonical, and the rule is that each copy is
 * canonical for its own domain. Pointing this page's canonical at the hub
 * would ask Google to drop the Brighton URL from its index, which is the exact
 * opposite of what this integration is for.
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Article not found",
      // A 404 must not be indexable, or Google accumulates soft-404 URLs.
      robots: { index: false, follow: true },
    };
  }

  const description = article.meta_description || article.excerpt;
  const url = articleUrl(article.slug);

  return {
    title: article.title,
    description,
    alternates: { canonical: `${BLOG_PATH}/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_GB",
      publishedTime: article.published_at ?? undefined,
      modifiedTime: article.updated_at ?? undefined,
      ...(article.image_url
        ? {
            images: [
              {
                url: article.image_url,
                alt: article.image_alt || article.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      ...(article.image_url ? { images: [article.image_url] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

/**
 * Split the plain-text body into blocks.
 *
 * The platform stores articles as text with blank-line-separated paragraphs,
 * optionally using markdown-style heading prefixes. Nothing here is rendered
 * as HTML: every block becomes a text node inside an element this component
 * chose, so a body cannot inject markup into the page.
 */
function parseBlocks(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const heading = /^(#{2,3})\s+(.*)$/.exec(block);

      if (heading) {
        return {
          kind: heading[1].length === 2 ? ("h2" as const) : ("h3" as const),
          text: heading[2].trim(),
        };
      }

      return { kind: "p" as const, text: block };
    });
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    // A draft, another location's article, a slug that never existed and an
    // unreachable API are all one 404 from here. That is deliberate: none of
    // them is an article this site has.
    notFound();
  }

  const blocks = parseBlocks(article.content ?? "");
  const published = formatDate(article.published_at);
  const updated = formatDate(article.updated_at);
  const url = articleUrl(article.slug);

  // Article structured data only. No review, rating or aggregate markup:
  // there is nothing on this page that would make such a claim truthful.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.meta_description || article.excerpt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en-GB",
    datePublished: article.published_at ?? undefined,
    dateModified: article.updated_at ?? article.published_at ?? undefined,
    author: {
      "@type": "Organization",
      name: article.author || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl(),
      logo: { "@type": "ImageObject", url: `${siteUrl()}/logo.png` },
    },
    ...(article.image_url ? { image: [article.image_url] } : {}),
    ...(article.tags.length > 0 ? { keywords: article.tags.join(", ") } : {}),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      {
        "@type": "ListItem",
        position: 2,
        name: BLOG_TITLE,
        item: `${siteUrl()}${BLOG_PATH}`,
      },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <Header />

      <main id="main" className="pt-24 md:pt-28 pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Visible breadcrumb as well as the markup, so the internal link to
              the listing exists for crawlers and for readers. */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href={BLOG_PATH}
              className="inline-flex items-center gap-2 text-sm text-green-600 font-semibold hover:text-green-700 transition-colors"
            >
              <ArrowLeft size={16} />
              All articles
            </Link>
          </nav>

          <header>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
              {article.published_at ? (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  <time dateTime={article.published_at}>{published}</time>
                </span>
              ) : null}

              {updated && updated !== published ? (
                <span>Updated {updated}</span>
              ) : null}

              {article.reading_minutes ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} />
                  {article.reading_minutes} min read
                </span>
              ) : null}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {article.title}
            </h1>

            {article.excerpt ? (
              <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                {article.excerpt}
              </p>
            ) : null}
          </header>

          {article.image_url ? (
            <figure className="my-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.image_url}
                alt={article.image_alt || article.title}
                width={1200}
                height={675}
                className="w-full rounded-2xl object-cover max-h-[460px]"
              />

              {/* The credit and licence travel with the image from the
                  platform, which refuses to publish an article whose image has
                  no licence check. Dropping them here would undo that. */}
              <figcaption className="text-xs text-gray-500 mt-2 leading-relaxed">
                {article.image_credit || "Image creator not specified"}
                {article.image_license ? ` · ${article.image_license}` : null}
                {article.image_license_url ? (
                  <>
                    {" · "}
                    <a
                      href={article.image_license_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-gray-700"
                    >
                      Licence
                    </a>
                  </>
                ) : null}
                {article.image_source_url ? (
                  <>
                    {" · "}
                    <a
                      href={article.image_source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-gray-700"
                    >
                      Source
                    </a>
                  </>
                ) : null}
              </figcaption>
            </figure>
          ) : null}

          <article className="mt-8">
            {blocks.map((block, index) => {
              if (block.kind === "h2") {
                return (
                  <h2
                    key={index}
                    className="font-display text-2xl font-bold text-gray-900 mt-10 mb-3"
                  >
                    {block.text}
                  </h2>
                );
              }

              if (block.kind === "h3") {
                return (
                  <h3
                    key={index}
                    className="font-display text-xl font-semibold text-gray-900 mt-8 mb-2"
                  >
                    {block.text}
                  </h3>
                );
              }

              return (
                <p
                  key={index}
                  className="text-gray-700 leading-[1.8] mb-5 text-[1.0625rem]"
                >
                  {block.text}
                </p>
              );
            })}
          </article>

          {article.sources.length > 0 ? (
            <section className="mt-12 pt-8 border-t border-gray-100">
              <h2 className="font-display text-base font-semibold text-gray-900 mb-3">
                Sources
              </h2>
              <ul className="space-y-2">
                {article.sources.map((source) => (
                  <li key={source} className="text-sm break-words">
                    <a
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-green-600 hover:text-green-700 underline"
                    >
                      {source}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Conversion path, and an internal link off the article. */}
          <aside className="mt-12 rounded-2xl bg-gray-900 text-white p-8">
            <h2 className="font-display text-2xl font-bold">
              Need a taxi in Brighton?
            </h2>
            <p className="text-white/70 mt-2">
              Licensed private hire, 24/7, across Brighton &amp; Hove and to
              every major airport.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href="https://westerncars.webbooker.icabbi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-black font-semibold px-6 py-3 rounded-full hover:bg-green-400 transition-colors"
              >
                Book online
              </a>
              <a
                href="tel:01273220220"
                className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
              >
                <Phone size={16} />
                01273 220220
              </a>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
