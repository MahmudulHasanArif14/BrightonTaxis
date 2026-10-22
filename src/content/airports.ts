import type { Faq } from "@/components/Seo";
import { BUSINESS } from "@/lib/business";
import type { ServiceSection } from "./services";

/**
 * Per-airport copy.
 *
 * Each page describes a genuinely different journey — a different road, a
 * different realistic departure time, a different reason people choose a car
 * over the train. Writing them one at a time is the point: five pages that
 * differ only in the airport's name are a doorway set, and would deserve to
 * be treated as one.
 *
 * Deliberately absent from every page here: fares, journey durations stated as
 * promises, waiting-time allowances, meet-and-greet procedures and parking
 * arrangements. None of those has been confirmed by the business, and an
 * airport page is the worst possible place to guess. Approximate road
 * distances are included because they are public geography, and they are
 * written as approximations.
 */

export type AirportContent = {
  /** Page title and h1, kept identical so they cannot drift apart. */
  heading: string;
  description: string;
  intro: string;
  sections: ServiceSection[];
  faqs: Faq[];
};

const sharedBookingSection: ServiceSection = {
  heading: "What to give us when you book",
  paragraphs: [
    "The flight number is the detail that does the most work — it lets the pickup be planned around the flight rather than around the time printed on your ticket.",
  ],
  bullets: [
    "Pickup address, with a flat or building number.",
    "The terminal, if your airline has told you which one.",
    "The flight number and the departure or arrival time.",
    "Passenger count and the number of bags.",
    "Anything that changes the vehicle: a wheelchair, a child seat, sports equipment.",
  ],
};

const sharedPriceFaq: Faq = {
  question: "How is the fare confirmed?",
  answer: `The fare is confirmed with you before the booking is accepted, by phone on ${BUSINESS.telephone} or as part of the online booking. This website does not publish fixed airport fares, because the price depends on the route, the vehicle and the time of travel.`,
};

export const AIRPORT_CONTENT: Record<string, AirportContent> = {
  gatwick: {
    heading: "Brighton to Gatwick Airport transfers",
    description:
      "Pre-booked taxi transfers from Brighton and Hove to Gatwick Airport, roughly 30 miles up the A23 and M23. Fares confirmed before travel. Call 01273 220220.",
    intro:
      "Gatwick is the airport Brighton treats as its own: roughly thirty miles straight up the A23 and M23, and the transfer we are asked for more than all the others combined.",
    sections: [
      {
        heading: "The journey",
        paragraphs: [
          "It is a single run north on the A23, joining the M23 near Pease Pottage and leaving it at the airport. There is no sensible alternative route, which makes the timing unusually predictable outside the morning peak — and unusually sensitive to an incident on the A23 when there is one.",
          "Both terminals are served. If your airline has told you which one you are flying from, tell us; if it has not, the flight number will sort it out.",
        ],
      },
      {
        heading: "Car or train?",
        paragraphs: [
          "Honestly: if you are travelling alone with hand luggage in the middle of the day, the direct train from Brighton station is quick and hard to beat. A car earns its place when there are several of you, when you are carrying hold luggage, when you are leaving before the trains are useful, or when your pickup point is nowhere near a station.",
          "That is also why Gatwick bookings cluster around the early hours. If your flight goes before eight, book the car well ahead.",
        ],
      },
      sharedBookingSection,
      {
        heading: "Coming back",
        paragraphs: [
          "Return pickups are booked the same way. Give us the inbound flight number so the collection can be planned around the flight itself, and call us if the flight moves — the booking line is staffed around the clock.",
        ],
      },
    ],
    faqs: [
      {
        question: "How far is Gatwick Airport from Brighton?",
        answer:
          "Roughly 30 miles by road, almost all of it on the A23 and M23. It is the closest major airport to Brighton and Hove by a considerable margin.",
      },
      {
        question: "Do you cover both Gatwick terminals?",
        answer:
          "Yes, North and South. Tell us the terminal if you know it, and give us the flight number either way.",
      },
      sharedPriceFaq,
      {
        question: "Can you collect very early in the morning?",
        answer: `Yes. Early departures are the most common reason people book a Gatwick transfer rather than taking the train, and the booking line is staffed ${BUSINESS.phoneHours}.`,
      },
    ],
  },

  heathrow: {
    heading: "Brighton to Heathrow Airport transfers",
    description:
      "Pre-booked taxi transfers from Brighton and Hove to Heathrow Airport, around the M25 via the A23 and M23. Fares confirmed before travel. Call 01273 220220.",
    intro:
      "Heathrow is a longer run than Gatwick and a less forgiving one: up the A23 and M23, then anticlockwise around the western side of the M25. The M25 is what makes the timing worth planning.",
    sections: [
      {
        heading: "The journey",
        paragraphs: [
          "The route north is the same as for Gatwick until the M23 meets the M25, and then it turns west along a stretch of motorway that behaves very differently at eight in the morning than it does at midnight. Roughly seventy miles in total, but the distance is not the part that varies.",
          "All of the Heathrow terminals are served. The terminal matters more here than at most airports, so give us the flight number and we will work it out even if your ticket is vague.",
        ],
      },
      {
        heading: "Why people book a car rather than connecting",
        paragraphs: [
          "There is no direct public transport from Brighton to Heathrow. Every rail route involves at least one change and usually a coach or an underground leg at the end, with luggage. For a family, an early flight, or a long-haul departure where you want to arrive settled, a single vehicle from the door is a genuinely different proposition.",
        ],
      },
      sharedBookingSection,
      {
        heading: "Arrivals",
        paragraphs: [
          "Long-haul arrivals take an unpredictable amount of time to clear the airport. Give us the inbound flight number when you book, and call the office once you are through if your timing has shifted.",
        ],
      },
    ],
    faqs: [
      {
        question: "How far is Heathrow from Brighton?",
        answer:
          "Around 70 miles by road, via the A23, the M23 and the western side of the M25. Traffic on the M25 affects the journey time more than the distance does.",
      },
      {
        question: "Is there a direct train from Brighton to Heathrow?",
        answer:
          "No. Every rail route involves at least one change and usually a coach or underground leg, which is why a large share of Heathrow passengers from Brighton travel by road.",
      },
      sharedPriceFaq,
      {
        question: "Which Heathrow terminal will you drop me at?",
        answer:
          "Whichever your flight departs from. Give us the flight number when you book and we will confirm the terminal rather than relying on memory.",
      },
    ],
  },

  "london-city": {
    heading: "Brighton to London City Airport transfers",
    description:
      "Pre-booked taxi transfers from Brighton and Hove to London City Airport in the Docklands. Fares confirmed before travel. Call 01273 220220.",
    intro:
      "London City sits in the Docklands, east of the centre, and it is mostly a business airport — short-haul European routes and a schedule built around the working day.",
    sections: [
      {
        heading: "The journey",
        paragraphs: [
          "This is the only one of the five that takes you through or around London rather than skirting it, and the route depends heavily on the time of day. It is a journey where leaving the departure time to chance is a poor idea.",
          "Because the airport's schedule is built around meetings, a great many of these transfers are first thing in the morning or last thing in the evening.",
        ],
      },
      {
        heading: "Business travel and accounts",
        paragraphs: [
          "London City transfers are one of the most common uses of a corporate account: the person travelling is often not the person paying, and the booking is frequently made by somebody back at the office. If that describes your organisation, an account is likely to be tidier than expensing individual journeys.",
        ],
      },
      sharedBookingSection,
    ],
    faqs: [
      {
        question: "Why travel to London City by car from Brighton?",
        answer:
          "Rail routes to the Docklands from Brighton involve crossing London with luggage and at least one change. For an early meeting or an evening return, a single door-to-door vehicle is often the more reliable option.",
      },
      {
        question: "Can a London City transfer go on a company account?",
        answer:
          "Yes — these are among the most common account journeys we carry. See our corporate accounts page.",
      },
      sharedPriceFaq,
    ],
  },

  stansted: {
    heading: "Brighton to Stansted Airport transfers",
    description:
      "Pre-booked taxi transfers from Brighton and Hove to Stansted Airport, north-east of London via the M25 and M11. Fares confirmed before travel. Call 01273 220220.",
    intro:
      "Stansted is north-east of London, which from Brighton means the whole length of the eastern M25 and then the M11. It is a long run, and more often than not an early one.",
    sections: [
      {
        heading: "The journey",
        paragraphs: [
          "Up the A23 and M23, round the eastern arc of the M25 — including the Dartford crossing — and north on the M11. Around a hundred miles, and a route with more that can go wrong along it than the Gatwick run.",
          "That combination is exactly why these journeys should be booked well in advance rather than arranged the night before.",
        ],
      },
      {
        heading: "Early departures",
        paragraphs: [
          "Stansted's schedule is heavy with early-morning low-cost departures. From Brighton, an early Stansted flight usually means leaving in the small hours — before any useful train, and at a time when having a booked car with a confirmed price matters more than it does at noon.",
        ],
      },
      sharedBookingSection,
    ],
    faqs: [
      {
        question: "How far is Stansted from Brighton?",
        answer:
          "Roughly 100 miles by road, via the M23, the eastern side of the M25 and the M11. It is one of the longer airport runs we carry from the south coast.",
      },
      {
        question: "How much notice should I give for a Stansted transfer?",
        answer:
          "As much as you can. It is a long journey, frequently at an antisocial hour, and both of those are reasons to have the vehicle allocated well in advance.",
      },
      sharedPriceFaq,
    ],
  },

  luton: {
    heading: "Brighton to Luton Airport transfers",
    description:
      "Pre-booked taxi transfers from Brighton and Hove to Luton Airport, north of London via the M25 and M1. Fares confirmed before travel. Call 01273 220220.",
    intro:
      "Luton sits north of London, which from the south coast means the western M25 and then the M1. There is no convenient rail route from Brighton, so most passengers travel by road.",
    sections: [
      {
        heading: "The journey",
        paragraphs: [
          "North on the A23 and M23, west and then north around the M25, and up the M1 to the airport. Roughly ninety miles. As with Heathrow, the M25 section is the part that varies.",
        ],
      },
      {
        heading: "Why road rather than rail",
        paragraphs: [
          "Getting to Luton from Brighton by train means crossing London and changing, then a transfer at the airport end. With hold luggage, in the early morning, or with more than one person travelling, a single booked vehicle from the door is usually the simpler answer — which is why nearly every Luton booking we take is a door-to-terminal transfer.",
        ],
      },
      sharedBookingSection,
    ],
    faqs: [
      {
        question: "How far is Luton Airport from Brighton?",
        answer:
          "Around 90 miles by road, via the M23, the western M25 and the M1.",
      },
      {
        question: "Is there a direct train from Brighton to Luton Airport?",
        answer:
          "No. Rail routes require crossing London and changing, plus a transfer at the airport end, which is why most Luton passengers from Brighton travel by road.",
      },
      sharedPriceFaq,
    ],
  },
};
