# Content notes — claims the website makes and cannot yet support

The landing page (`/`) is the original design and has been kept that way on
request: the same sections, the same animations, the same imagery. The pages
added alongside it (`/services/*`, `/airport-transfers/*`, `/about`,
`/contact`, `/faq`, `/how-to-book`, `/service-areas`, `/privacy`, `/cookies`)
were written from scratch and deliberately contain **no** fares, ratings,
fleet details or waiting times, because none of those has been confirmed.

This file lists the gap between the two: the claims the landing page makes
today that nothing in this project substantiates, and the facts the business
could supply to make them safe.

Nothing here is blocking. Everything builds and works.

Last reviewed: 2026-10-22.

---

## 1. Live on the landing page: rating and review count

**Where.** `src/components/Testimonials.tsx` — a five-star row, the heading
"Trusted by Thousands", and the line *"5.0 based on 700+ verified reviews"*.

**The problem.** Nothing in this project is the source of either number.

**Status.** The visible copy has been left exactly as it was. The matching
`aggregateRating` of `5.0` from `reviewCount: "700"` has **not** been restored
to the structured data in `src/components/Seo.tsx`, and should not be: invented
review markup is a Google structured-data violation in its own right and puts
the whole site's rich results at risk, whereas the visible text is ordinary
marketing copy. That is the one place the restoration was not verbatim.

**To resolve.** Supply the real rating and review count from the Google
Business Profile and both can be published, markup included. Or point the
section at the profile and let the numbers live there.

---

## 2. Live on the landing page: published fares

**Where.** `src/components/Popular.tsx` — "from £35", "from £42", "from £65",
"from £85".

**The problem.** No fare schedule exists anywhere in this project, and a
published "from" price is a commitment.

**To resolve.** A confirmed fare table with its conditions. It belongs in
`src/lib/business.ts` rather than inline in a component. Note that the new
pages all state that the fare is confirmed before a booking is accepted, which
is consistent with a "from" price but not with a fixed one.

---

## 3. Live on the landing page: stock photography as the fleet

**Where.** Seven `images.unsplash.com` images across `Hero`, `Fleet`,
`WhyUs`, `CTA` and `Popular`, two of them captioned "BMW X5" and
"Range Rover".

**The problem.** They are a third party's stock images presented as this
company's vehicles. They are also the page's largest downloads and its LCP
element, and they are served from a host this site does not control.

**To resolve.** Photographs of actual Western Cars vehicles, with permission.
Drop them in `public/` and the existing layout takes them unchanged — at which
point the `remotePatterns` entry in `next.config.ts` can go.

---

## 4. Removed and not restored: geographic coordinates

`geo.position` meta tags and a `GeoCoordinates` block both read
`50.8225, -0.1372` — the middle of Brighton, not the company's address. A
precise-looking coordinate pair that is wrong is worse than none, so these are
gone from `layout.tsx` and `Seo.tsx`.

**To resolve.** The actual coordinates of the registered office, if the
business wants them published.

---

## 5. Live on the landing page: unverifiable service claims

"24/7 Roadside Assistance" (`Fleet.tsx`), "Best Prices" and "Verified
Vehicles" (`Hero.tsx`), "Meet & greet + flight tracking" and "fixed guide
prices" (`Services.tsx`).

Several of these may well be true; none has been confirmed. The new airport
pages in `src/content/airports.ts` deliberately say nothing about meet-and-greet
or flight tracking, and are written to take that detail the moment it is
confirmed.

---

## 6. Kept, but needs confirming: the four customer quotes

`src/components/Testimonials.tsx` carries four quotes that were already
published on this site. They have been kept as written, but the invented
star ratings and review count around them have gone.

**Needs confirming:** that these are genuine customer comments and that the
attributions are correct. Two of them reference journeys from East Grinstead
and Lingfield, which are not in this site's stated service area, and two name
specific cars. If they cannot be sourced, they should be removed.

---

## 7. Not built: per-town location pages

There is one `/service-areas` page rather than separate pages for Hove,
Kemptown, Portslade, Lewes, Worthing and the rest.

**Why.** There is no verified local information to put on them — no branch, no
local number, no service that differs by town. Nine pages differing only in a
place name are a doorway set and would be treated as one.

**What would change that.** Any genuinely local detail per town: common
destinations, pickup points that need special handling, local events the
business plans around. With that, each town earns a real page.

---

## 8. Needs legal review: the privacy and cookie pages

`/privacy` and `/cookies` describe accurately what **this website** does: it
sets no cookies, runs no analytics, and collects nothing, because that is how
the application is built.

They do **not** describe how the operator handles booking records, call
recordings, driver data or retention periods, because none of that is visible
from the codebase.

**Action:** the business should review both pages against its actual
data-protection practices and its ICO registration before treating them as the
company's full privacy notice. If analytics or any other cookie-setting tool is
added to the site, both pages must be updated in the same change and a consent
mechanism added.

---

## 9. Confirmed and in use

For the avoidance of doubt, these are being published and were verified against
what was already in the repository before this work:

| Fact | Value | Source |
| --- | --- | --- |
| Canonical origin | `https://brightontaxis.westerncars.com` | `src/lib/site.ts`, confirmed 2026-10-21 |
| Trading name | Western Cars Brighton | existing site |
| Registered company | Western Cars Private Hire Limited | existing footer |
| Company number | 09243357 | existing footer |
| Established | 2007 | existing copy |
| Telephone | 01273 220220 | existing site |
| Email | info@westerncarsbrighton.co.uk | existing site |
| Registered office | Mocatta House, Trafalgar Place, Brighton, BN1 4DU | existing site |
| Booking system | `https://westerncars.webbooker.icabbi.com` | existing integration, unchanged |

Note that the website's origin and the company's `.co.uk` domain are different
things and both are correct: the mailbox lives on the latter.

---

## 10. Unused asset: the real logo

`public/logo.png` is the actual Western Cars mark — a blue and teal circle. It
is not displayed anywhere on the site: the header and footer draw a green "W"
in a div instead, which is the original design and has been kept.

The file is referenced in structured data as the organisation's logo, so it is
not dead weight, but it is worth a decision. The mark and the site's green
palette (`--primary: #22c55e`, and the manifest theme colour) do not sit
together comfortably, which may be exactly why the "W" was drawn in the first
place.

**To resolve.** Either a brand mark in the site's green, or a decision to
re-palette the site to the logo. Both are business calls rather than code
changes.

## 11. Resolved on 2026-10-22, from the live site

The live site at `https://www.westerncarsbrighton.co.uk/` was read and used as
the source for this pass. Several items this document had flagged as invented
turned out to be answerable from it, and several claims that were on this site
turned out to be contradicted by it.

**Corrected because the business says otherwise**

| Was on this site | What the business actually publishes |
|---|---|
| Vehicle cards headed "BMW X5" and "Range Rover" | Three classes only: Saloon, Estate, Multi-Seater. No model is named anywhere. |
| "from £35 / £42 / £65 / £85" | No fixed prices. One rule: guide prices, with the fare confirmed before booking. |
| "Most Loved by Our Customers" | "A Vehicle to Suit Every Traveller" |
| Fleet badge "BMW X5" over a saloon | No model claim at all |
| Invented answer to "How is the fare worked out?" | Guide prices vary by pickup, destination, date, time and requirements; local metered journeys follow Brighton & Hove City Council tariffs. |

The four prices and the two SUV classes were this site's invention and are
gone. The luggage figures now carry the qualifier the business uses —
"subject to actual luggage dimensions" — wherever they appear.

**Confirmed, so no longer open questions**

- The 5.0 rating and the "700+ verified reviews" figure are the business's own
  published claim, not something this site made up. They are still *not* in the
  structured data: `aggregateRating` markup has to be backed by reviews the
  page itself can evidence, and a number carried over from marketing copy is
  not that. The visible text stands; the markup stays out.
- Seven named reviews are published, and all seven are now on this site. The
  four that were here already match the source wording.
- "DBS-checked, licensed by Brighton & Hove City Council" is the business's own
  description of its drivers, quoted on /about rather than asserted here.
- Opening hours, the registered office, the company number and the booking
  channels (web booker, phone, email, iOS/Android app) all match.
- Event hire is a real service and was missing from this site. It now has a
  page.

**Still outstanding**

- **Real vehicle photographs.** Every car picture is still stock. The captions
  no longer claim a model, so nothing is now false, but no photograph on this
  site shows a Western Cars vehicle.
- **The iOS/Android app.** The FAQ mentions it because the business does;
  this site has no link for it. Supply the store URLs and it can be linked.
- **The blue palette.** The live site is built in blue, which matches the logo.
  This site is green. Both cannot be the brand. That is a decision for the
  business, not a bug to fix unilaterally.
- Legal review of /privacy and /cookies, which remain this site's own drafts.
