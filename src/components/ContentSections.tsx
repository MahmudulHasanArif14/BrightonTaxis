import Link from "next/link";
import Reveal from "./Reveal";
import { Container, Prose, Section } from "./ui";
import type { ServiceSection } from "@/content/services";

/**
 * Renders the body of a content page.
 *
 * Shared layout, per-page words. The sections come from the content modules,
 * where each page is written separately; this file only decides what a
 * heading and a paragraph look like.
 */
export function ContentBody({ sections }: { sections: ServiceSection[] }) {
  return (
    <Section tone="white">
      <Container width="prose">
        <Prose>
          {sections.map((section, index) => (
            <Reveal key={section.heading} delay={Math.min(index, 4) * 50}>
              <section className="mt-10 first:mt-0">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            </Reveal>
          ))}
        </Prose>
      </Container>
    </Section>
  );
}

/** Contextual links out of a page, so nothing is a dead end. */
export function RelatedLinks({
  links,
  heading = "Related pages",
}: {
  links: { label: string; href: string }[];
  heading?: string;
}) {
  if (links.length === 0) return null;

  return (
    <Section tone="muted">
      <Container width="prose">
        <Reveal>
          <h2 className="font-display text-xl font-semibold text-gray-900">
            {heading}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-xl border border-gray-200 bg-white px-5 py-4 font-medium text-gray-900 transition-colors hover:border-green-300 hover:text-green-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}

/** A visible FAQ block with its own heading, used on content pages. */
export function FaqSection({
  children,
  title = "Questions and answers",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <Section tone="white" id="faq">
      <Container width="prose">
        <Reveal>
          <h2 className="mb-6 font-display text-2xl font-bold text-gray-900 sm:text-3xl">
            {title}
          </h2>
        </Reveal>
        {children}
      </Container>
    </Section>
  );
}
