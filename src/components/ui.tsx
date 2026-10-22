import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import Reveal from "./Reveal";
import type { Faq } from "./Seo";

/**
 * The small set of primitives every page is built from.
 *
 * These are server components. Only the pieces that genuinely need the browser
 * -- the mobile menu and the scroll reveal -- are client components, which
 * keeps the JavaScript on a content page close to nothing.
 */

export function Container({
  children,
  className = "",
  width = "wide",
}: {
  children: React.ReactNode;
  className?: string;
  /** `prose` caps the line length for body text; `wide` is for layouts. */
  width?: "wide" | "prose";
}) {
  const max = width === "prose" ? "max-w-3xl" : "max-w-7xl";
  return (
    <div className={`${max} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-green-700 font-semibold text-sm tracking-wider uppercase mb-3">
      {children}
    </p>
  );
}

/** The two things we always want someone to be able to do. */
export function BookingActions({
  tone = "dark",
  className = "",
  bookLabel = "Book online",
}: {
  /** `dark` sits on a dark background, `light` on white. */
  tone?: "dark" | "light";
  className?: string;
  bookLabel?: string;
}) {
  const secondary =
    tone === "dark"
      ? "border-white/25 text-white hover:bg-white/10 hover:border-white/50"
      : "border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400";

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href={BUSINESS.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
      >
        {bookLabel}
        <ArrowRight size={18} aria-hidden="true" />
      </a>
      <a
        href={BUSINESS.telHref}
        className={`inline-flex items-center gap-2 rounded-full border px-7 py-3.5 font-semibold transition-colors ${secondary}`}
      >
        <Phone size={18} aria-hidden="true" />
        <span>
          Call {BUSINESS.telephone}
          <span className="sr-only">
            {" "}
            — booking line open {BUSINESS.phoneHours}
          </span>
        </span>
      </a>
    </div>
  );
}

/**
 * The banner at the top of every page other than the homepage.
 *
 * It is a gradient and a pattern, not a photograph. The site previously pulled
 * four hero images from Unsplash over the network: they were a third party's
 * stock cars presented as this company's fleet, they were the largest thing on
 * the page, and any one of them could stop resolving without warning.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  image,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  breadcrumbs?: { name: string; path: string }[];
  /**
   * An optional photograph behind the wash. Decorative: the heading already
   * says what the page is, so it carries an empty alt. Pages without a
   * photograph that honestly matches their subject simply omit it rather than
   * borrowing a picture of something else.
   */
  image?: { src: string };
}) {
  return (
    <section className="relative overflow-hidden bg-gray-950 pt-28 pb-14 md:pt-36 md:pb-20">
      {image ? (
        <div aria-hidden="true" className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-950/70" />
        </div>
      ) : null}
      <div
        aria-hidden="true"
        className={`hero-wash absolute inset-0 ${image ? "opacity-75" : ""}`}
      />
      <Container className="relative">
        {breadcrumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-green-300"
                >
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-white/90" aria-current="page">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link
                      href={crumb.path}
                      className="transition-colors hover:text-green-300"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-green-400">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {intro ? (
            <p className="mt-5 text-lg leading-relaxed text-white/85">{intro}</p>
          ) : null}
          <BookingActions className="mt-8" />
        </div>
      </Container>
    </section>
  );
}

export function Section({
  children,
  className = "",
  tone = "white",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "white" | "muted" | "dark";
  id?: string;
}) {
  const tones = {
    white: "bg-white text-gray-900",
    muted: "bg-gray-50 text-gray-900",
    dark: "bg-gray-950 text-white",
  } as const;

  return (
    <section id={id} className={`py-16 md:py-24 ${tones[tone]} ${className}`}>
      {children}
    </section>
  );
}

/** Body copy for the long-form parts of a page. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose-site text-[1.0625rem] leading-[1.75] text-gray-700">
      {children}
    </div>
  );
}

/**
 * Questions and answers, rendered as real text.
 *
 * The same array is handed to FaqJsonLd, so the markup can never drift from
 * what a visitor can actually read -- which is the condition Google attaches
 * to FAQ rich results.
 */
export function FaqList({ faqs, id }: { faqs: Faq[]; id?: string }) {
  return (
    <dl id={id} className="divide-y divide-gray-200 border-y border-gray-200">
      {faqs.map((faq, index) => (
        <Reveal key={faq.question} delay={Math.min(index, 4) * 60}>
          <div className="py-6">
            <dt className="font-display text-lg font-semibold text-gray-900">
              {faq.question}
            </dt>
            <dd className="mt-2 leading-relaxed text-gray-700">{faq.answer}</dd>
          </div>
        </Reveal>
      ))}
    </dl>
  );
}

/** A card that links somewhere, used for service and airport grids. */
export function LinkCard({
  href,
  title,
  description,
  icon: Icon,
  external = false,
}: {
  href: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  external?: boolean;
}) {
  const inner = (
    <>
      {Icon ? (
        <span
          aria-hidden="true"
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 transition-colors group-hover:bg-green-600"
        >
          <Icon className="h-6 w-6 text-green-700 transition-colors group-hover:text-white" />
        </span>
      ) : null}
      <h3 className="font-display text-lg font-semibold text-gray-900">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
        {description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green-700">
        Read more
        <ArrowRight
          size={15}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </>
  );

  const className =
    "group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-green-300 hover:shadow-lg";

  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

/** The closing call to action shared by every inner page. */
export function ClosingCta({
  title = "Book your next journey",
  body,
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Section tone="dark">
      <Container>
        <Reveal>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-950 p-8 md:p-12">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-white/70">
              {body ??
                `Book online in a couple of minutes, or call us on ${BUSINESS.telephone}. The booking line is staffed ${BUSINESS.phoneHours}.`}
            </p>
            <BookingActions className="mt-7" />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
