/**
 * The business this website speaks for.
 *
 * Every page, every piece of metadata and every JSON-LD block reads its facts
 * from here. Before this file the phone number was written out in nine
 * components, the email in four and the address in two, which is how a site
 * ends up telling search engines one thing and visitors another.
 *
 * The rule for this file: nothing goes in that the business cannot
 * substantiate. No fleet sizes, no licence numbers, no prices, no review
 * counts, no ratings, no geographic coordinates. Those were all previously
 * asserted somewhere in this codebase and have been removed rather than
 * guessed at -- see docs/CONTENT_NOTES.md for what is still outstanding.
 *
 * Note that the *website* lives on brightontaxis.westerncars.com (see
 * lib/site.ts) while the *mailbox* lives on westerncarsbrighton.co.uk. Both
 * are correct; they are different things.
 */

export const BUSINESS = {
  /** Trading name, as used in headings and on-page copy. */
  name: "Western Cars Brighton",

  /** Registered company name, for the footer and the Organization entity. */
  legalName: "Western Cars Private Hire Limited",

  /** Companies House number, as already published in the site footer. */
  companyNumber: "09243357",

  /** Year the business was established. */
  founded: "2007",

  /** Dialling format, for display. */
  telephone: "01273 220220",

  /** E.164, for tel: links and structured data. */
  telephoneE164: "+441273220220",

  /** Link target for a click-to-call. */
  telHref: "tel:+441273220220",

  email: "info@westerncarsbrighton.co.uk",

  address: {
    street: "Mocatta House, Trafalgar Place",
    locality: "Brighton",
    region: "East Sussex",
    postalCode: "BN1 4DU",
    country: "GB",
  },

  /**
   * The live booking system. This is an existing production integration --
   * do not point it somewhere else without checking the account it belongs to.
   */
  bookingUrl: "https://westerncars.webbooker.icabbi.com",

  /** Verified external profiles, used for sameAs. */
  profiles: [
    "https://www.facebook.com/westerncarsbrighton/",
    "https://www.westerncarsbrighton.co.uk/",
  ],

  /** Phone bookings are taken around the clock. */
  phoneHours: "24 hours a day, 7 days a week",
} as const;

/** Airports this site advertises transfers to. */
export const AIRPORTS = [
  {
    slug: "gatwick",
    name: "Gatwick Airport",
    short: "Gatwick",
    code: "LGW",
    blurb:
      "The closest major airport to Brighton and the transfer we are asked for most often.",
  },
  {
    slug: "heathrow",
    name: "Heathrow Airport",
    short: "Heathrow",
    code: "LHR",
    blurb:
      "A longer run north-west around the M25, booked ahead so the timing works for your flight.",
  },
  {
    slug: "london-city",
    name: "London City Airport",
    short: "London City",
    code: "LCY",
    blurb:
      "A door-to-door alternative to the train for short-haul and business flights from the Docklands.",
  },
  {
    slug: "stansted",
    name: "Stansted Airport",
    short: "Stansted",
    code: "STN",
    blurb:
      "An early-hours run for most Brighton passengers, which is exactly when a pre-booked car earns its keep.",
  },
  {
    slug: "luton",
    name: "Luton Airport",
    short: "Luton",
    code: "LTN",
    blurb:
      "North of London and awkward by rail from the south coast, so most passengers travel by road.",
  },
] as const;

export type Airport = (typeof AIRPORTS)[number];

/**
 * Service pages, in the order they appear in navigation.
 *
 * `href` rather than a slug, because airport transfers live at the top level
 * (/airport-transfers) and not under /services. Giving them both URLs would
 * mean two pages competing to answer the same query with the same words,
 * which is the one thing a site this size cannot afford.
 */
export const SERVICES = [
  {
    slug: "airport-transfers",
    href: "/airport-transfers",
    title: "Airport Transfers",
    nav: "Airport transfers",
    summary:
      "Pre-booked transfers from Brighton and Hove to Gatwick, Heathrow, London City, Stansted and Luton.",
  },
  {
    slug: "local-journeys",
    href: "/services/local-journeys",
    title: "Local Taxis in Brighton & Hove",
    nav: "Local journeys",
    summary:
      "Everyday private hire across Brighton, Hove and the surrounding Sussex towns, booked online or by phone.",
  },
  {
    slug: "corporate-accounts",
    href: "/services/corporate-accounts",
    title: "Corporate Taxi Accounts",
    nav: "Corporate accounts",
    summary:
      "Business travel on account, with booking arranged centrally instead of paid for in the car.",
  },
  {
    slug: "executive-travel",
    href: "/services/executive-travel",
    title: "Executive Travel",
    nav: "Executive travel",
    summary:
      "A quieter, more comfortable car for client collections, meetings and longer business journeys.",
  },
  {
    slug: "group-travel",
    href: "/services/group-travel",
    title: "Group & Multi-Seater Travel",
    nav: "Group travel",
    summary:
      "Larger vehicles for families, luggage-heavy airport runs and groups travelling together.",
  },
  {
    slug: "event-hire",
    href: "/services/event-hire",
    title: "Event Taxi Hire",
    nav: "Event hire",
    summary:
      "Weddings, Amex match days, Brighton festivals and nights out, with group vehicles available.",
  },
  {
    slug: "accessible-transport",
    href: "/services/accessible-transport",
    title: "Wheelchair-Accessible Transport",
    nav: "Accessible transport",
    summary:
      "Wheelchair-accessible vehicles, arranged in advance so the right car is sent.",
  },
] as const;

export type Service = (typeof SERVICES)[number];

/** Places this site says it serves. Mirrors the areas listed in the footer. */
export const SERVICE_AREAS = [
  "Brighton city centre (BN1)",
  "Hove (BN3)",
  "Kemptown & Brighton Marina (BN2)",
  "Preston Park & Patcham",
  "Portslade & Shoreham-by-Sea",
  "Falmer & Lewes",
  "Worthing",
  "Haywards Heath",
] as const;

/**
 * The vehicle classes offered, as the business describes them.
 *
 * Three classes, not named models. An earlier version of this site listed a
 * "BMW X5" and a "Range Rover" at fixed prices from £35 to £85; the business
 * publishes neither a model list nor a fixed price, so both were invented.
 * What it does publish is a class, a passenger count, a luggage guide hedged
 * with "subject to actual luggage dimensions", and one pricing rule: guide
 * prices, with the fare confirmed before booking.
 */
export const VEHICLES = [
  {
    slug: "saloon",
    name: "Saloon",
    tag: "Most popular",
    summary:
      "Perfect for solo travellers, couples and small families with light luggage. An excellent choice for everyday journeys and airport transfers.",
    passengers: "Up to 4 passengers",
    luggage:
      "Suitable for 2–3 medium suitcases, subject to actual luggage dimensions",
  },
  {
    slug: "estate",
    name: "Estate",
    summary:
      "Spacious and practical, ideal for travellers who need extra luggage capacity without moving to a larger vehicle.",
    passengers: "Up to 4 passengers",
    luggage:
      "Suitable for up to 4 medium suitcases, subject to actual luggage dimensions",
  },
  {
    slug: "multi-seater",
    name: "Multi-Seater",
    summary:
      "An excellent option for families, groups, airport transfers and event transport, offering additional passenger capacity and luggage space.",
    passengers: "6-seater and 7–8 seater vehicles available",
    luggage:
      "Luggage space depends on the vehicle and the number of passengers",
  },
] as const;

export type Vehicle = (typeof VEHICLES)[number];

/** The pricing rule, stated the same way everywhere it appears. */
export const PRICING_NOTE =
  "Guide prices, with your fare confirmed before booking.";
