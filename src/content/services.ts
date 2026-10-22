import type { Faq } from "@/components/Seo";
import { BUSINESS } from "@/lib/business";
import { ACCESSIBLE_FAQS, CORPORATE_FAQS } from "@/lib/faqs";

/**
 * The body copy for each service page.
 *
 * These are written one at a time, not generated from a template with the
 * service name swapped in. A set of pages that differ only in a noun is a
 * doorway page, and search engines have been treating it as one for years.
 *
 * Airport transfers are not in this record: they have their own section at
 * /airport-transfers, and giving them a second home under /services would set
 * two of this site's own pages against each other for the same query.
 *
 * Everything here describes how the service works — what to tell us, what we
 * do with it, what is decided in advance. Nothing here states a fare, a
 * waiting time, a fleet size or a vehicle count, because none of those has
 * been confirmed by the business. Where a page would benefit from a fact of
 * that kind, there is an entry in docs/CONTENT_NOTES.md instead.
 */

export type ServiceSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ServiceContent = {
  title: string;
  /** Used as the <title> and the h1 — kept the same so they do not drift. */
  heading: string;
  description: string;
  intro: string;
  sections: ServiceSection[];
  faqs: Faq[];
  related: { label: string; href: string }[];
};

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  "local-journeys": {
    title: "Local Taxis in Brighton & Hove",
    heading: "Local taxis across Brighton & Hove",
    description:
      "Pre-booked private hire for everyday journeys across Brighton, Hove, Kemptown, Portslade and the surrounding Sussex towns. Book online or call 01273 220220.",
    intro:
      "The everyday journeys: to the station, across to Hove, up to the hospital, back from dinner. Booked in advance rather than flagged down, which is what private hire means.",
    sections: [
      {
        heading: "Private hire, not a hackney carriage",
        paragraphs: [
          "Western Cars Brighton is a private hire operator. That has one practical consequence worth knowing: our cars must be booked through the office rather than hailed in the street or picked up from a rank. In exchange, you know in advance that a car is coming and roughly what it will cost.",
          "Bookings can be made minutes ahead or weeks ahead. For anything with a deadline attached — a train, a hospital appointment, a wedding — book ahead rather than on the day.",
        ],
      },
      {
        heading: "Where we go",
        paragraphs: [
          "Across Brighton and Hove, including Kemptown and Brighton Marina, Preston Park, Fiveways, Hanover, Hollingbury and Portslade. Beyond the city we cover Shoreham-by-Sea, Lewes, Worthing and Haywards Heath, and we will quote for journeys further afield.",
          "The full list is on the areas we cover page.",
        ],
      },
      {
        heading: "Journeys worth booking early",
        paragraphs: [
          "Some evenings in Brighton are busier than others, and the ones that catch people out are predictable: match nights at the Amex, the end of a conference at the Brighton Centre, Pride weekend, the last trains at a weekend, and any evening with weather. If you are travelling on one of those, a booking made in the afternoon is worth more than a phone call at eleven.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I book a local journey for right now?",
        answer: `Yes — call ${BUSINESS.telephone} and we will tell you what we can do for the time you need. As a private hire operator our cars have to be booked through the office rather than hailed in the street.`,
      },
      {
        question: "How far ahead can I book?",
        answer:
          "As far ahead as you like. Bookings for a specific date and time, such as a train connection or an early appointment, are better placed in advance than on the day.",
      },
      {
        question: "Do you cover journeys outside Brighton and Hove?",
        answer:
          "Yes. We regularly run to Shoreham-by-Sea, Lewes, Worthing and Haywards Heath, and we will quote for longer journeys across the UK.",
      },
    ],
    related: [
      { label: "Areas we cover", href: "/service-areas" },
      { label: "How booking works", href: "/how-to-book" },
      { label: "Airport transfers", href: "/airport-transfers" },
    ],
  },

  "corporate-accounts": {
    title: "Corporate Taxi Accounts in Brighton",
    heading: "Corporate taxi accounts",
    description:
      "Business travel on account with Western Cars Brighton: bookings made centrally, journeys billed to the company rather than paid in the car. Call 01273 220220.",
    intro:
      "An account moves the payment out of the car. Staff, clients and visitors travel, and the journeys are billed to the company instead of being paid for — and expensed — one at a time.",
    sections: [
      {
        heading: "What an account changes",
        paragraphs: [
          "Three things, mainly. Bookings can be made by somebody other than the passenger, so a PA or a reception desk can arrange a car for a visitor. Nobody has to pay at the end of the journey. And the travel arrives as one billed account rather than as a month of individual receipts.",
        ],
      },
      {
        heading: "Who it suits",
        paragraphs: [
          "Offices that move people around regularly: client collections from the station, visitors in from Gatwick, staff getting to a meeting across town, the end of a late shift. If your company is already reimbursing taxi fares on expenses, an account is usually the tidier arrangement.",
        ],
      },
      {
        heading: "Setting one up",
        paragraphs: [
          `Call ${BUSINESS.telephone} or email ${BUSINESS.email} and tell us roughly how your organisation travels — who books, who travels, and how often. We will go through how bookings would be placed and how the account would be billed before anything is set up.`,
        ],
      },
    ],
    faqs: CORPORATE_FAQS,
    related: [
      { label: "Executive travel", href: "/services/executive-travel" },
      { label: "Airport transfers", href: "/airport-transfers" },
      { label: "Contact us", href: "/contact" },
    ],
  },

  "executive-travel": {
    title: "Executive Travel from Brighton",
    heading: "Executive travel",
    description:
      "A higher-specification car for client collections, meetings and longer business journeys from Brighton and Hove. Booked in advance. Call 01273 220220.",
    intro:
      "For the journeys where the car is part of the impression: collecting a client, carrying a visitor in from the airport, or a long run to a meeting where arriving unfrazzled matters.",
    sections: [
      {
        heading: "What makes it different",
        paragraphs: [
          "A higher-specification vehicle and a journey planned around the appointment rather than the traffic. Executive bookings are made in advance, which is what lets us allocate the right car and the right driver rather than whatever is nearest.",
        ],
      },
      {
        heading: "Common uses",
        paragraphs: [
          "Collecting a client from Gatwick or Heathrow and bringing them to a Brighton office. Taking a team to a meeting in London or along the south coast. Carrying a speaker between a hotel and a conference venue. Anything where the car waiting outside at the right moment is the point.",
        ],
      },
      {
        heading: "Booking executive travel",
        paragraphs: [
          `Call ${BUSINESS.telephone} and say it is an executive booking, or set it up through a corporate account so the billing is handled centrally. Tell us the appointment time rather than the pickup time if that is what actually matters — we can work backwards.`,
        ],
      },
    ],
    faqs: [
      {
        question: "What counts as an executive booking?",
        answer:
          "A booking where a higher-specification vehicle has been requested, arranged in advance. Tell us when you book — it is not something that can be upgraded to when the car arrives.",
      },
      {
        question: "Can executive journeys go on a corporate account?",
        answer:
          "Yes. Executive travel is one of the things accounts are most often used for, because the passenger is frequently a client rather than the person paying.",
      },
      {
        question: "Can you collect a client from the airport?",
        answer:
          "Yes. Give us the flight number when you book so the collection can be planned around the flight, and tell us who the car is meeting.",
      },
    ],
    related: [
      { label: "Corporate accounts", href: "/services/corporate-accounts" },
      { label: "Airport transfers", href: "/airport-transfers" },
      { label: "Contact us", href: "/contact" },
    ],
  },

  "group-travel": {
    title: "Group & Multi-Seater Taxis in Brighton",
    heading: "Group and multi-seater travel",
    description:
      "Larger vehicles for groups, families and luggage-heavy airport runs from Brighton and Hove. Tell us the numbers when you book. Call 01273 220220.",
    intro:
      "When there are more of you than fit in a saloon, or the luggage outnumbers the passengers. The whole job here is getting the vehicle size right before the car sets off.",
    sections: [
      {
        heading: "Tell us the numbers, not the vehicle",
        paragraphs: [
          "The most useful thing you can give us is passengers and bags, not a vehicle type. A group of five with hand luggage and a group of five flying for a fortnight need different cars, and we would rather work that out at the booking than on your doorstep.",
          "Where one vehicle will not do it, more than one is often the better answer — say so when you book and we will price it that way.",
        ],
      },
      {
        heading: "What groups use us for",
        paragraphs: [
          "Family airport runs, where the cases are the deciding factor. Groups heading to an event at the Amex or the Brighton Centre. Wedding guests moving between a venue and a hotel. Work teams travelling to the same place at the same time.",
        ],
      },
      {
        heading: "Booking for a group",
        paragraphs: [
          `Book online, or call ${BUSINESS.telephone} if there is anything unusual about the party — instruments, sports equipment, a pushchair, a mix of pickup points. Group bookings benefit more than most from being placed early.`,
        ],
      },
    ],
    faqs: [
      {
        question: "How many people can travel in one vehicle?",
        answer:
          "It depends on the vehicle allocated and how much luggage is travelling. Tell us the number of passengers and bags when you book and we will confirm what fits before the booking is accepted.",
      },
      {
        question: "Can you collect a group from more than one address?",
        answer:
          "Tell us when you book. Multiple pickups can usually be arranged, but they change the route and the timing, so they need to be agreed in advance rather than added on the day.",
      },
      {
        question: "Do you carry child seats?",
        answer:
          "Ask when you book. Tell us the age of the child so the right kind of seat can be arranged rather than assumed.",
      },
    ],
    related: [
      { label: "Airport transfers", href: "/airport-transfers" },
      { label: "Accessible transport", href: "/services/accessible-transport" },
      { label: "How booking works", href: "/how-to-book" },
    ],
  },

  "event-hire": {
    title: "Event & Special Occasion Taxi Hire in Brighton",
    heading: "Event and special occasion taxi hire",
    description:
      "Weddings, Amex Stadium match days, Brighton festivals and nights out, with group vehicles available. Fares confirmed before you travel. Call 01273 220220.",
    intro:
      "Weddings, Amex Stadium match days, Brighton festivals and nights out. Group vehicles available, and the fare confirmed before you travel.",
    sections: [
      {
        heading: "The occasions we are asked for most",
        paragraphs: [
          "Weddings and civil partnerships, where the timing matters more than anything else and multi-vehicle convoys are common. Match days at the Amex, which empty the city into one place and then back out of it in half an hour. Pride and the festival season. And the ordinary big night out, where the part worth arranging in advance is the journey home.",
        ],
        bullets: [
          "Weddings and civil partnerships, including multi-vehicle convoys",
          "Amex Stadium match-day transfers for groups of any size",
          "Brighton Pride and the festival season",
          "Six, seven and eight-seater vehicles for groups travelling together",
        ],
      },
      {
        heading: "Why these bookings go in early",
        paragraphs: [
          "Event travel concentrates demand into a few hours, and those hours are known weeks ahead. A fixture list, a festival weekend and a wedding date are all published long before the day. Two to four weeks ahead is the sensible window, and more than that for a weekend in peak season.",
          "Booking early also settles the part that is hardest to fix on the day: how many vehicles, of what size, from where. A group of nine is two cars and a conversation, not one phone call at midnight.",
        ],
      },
      {
        heading: "What to tell us",
        paragraphs: [
          "The date, the times in both directions, the number of travelling, and the pickup points — which for a wedding or a match day are often more than one. If the return is open-ended, say so, and we will arrange it as a separate booking rather than guess at a time.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you cover Amex Stadium match days?",
        answer:
          "Yes — pre-book match-day transfers for groups of any size. Book early on fixture days.",
      },
      {
        question: "Can you handle wedding parties?",
        answer:
          "Yes. We offer multi-vehicle convoys, and decorated cars on request.",
      },
      {
        question: "How far in advance should I book?",
        answer:
          "For events we recommend two to four weeks ahead, especially for weekends and peak season.",
      },
    ],
    related: [
      { label: "Group & multi-seater travel", href: "/services/group-travel" },
      { label: "Our fleet", href: "/fleet" },
      { label: "How booking works", href: "/how-to-book" },
    ],
  },

  "accessible-transport": {
    title: "Wheelchair-Accessible Taxis in Brighton & Hove",
    heading: "Wheelchair-accessible transport",
    description:
      "Wheelchair-accessible vehicles across Brighton and Hove, arranged in advance so the right vehicle is allocated. Call 01273 220220 to book.",
    intro:
      "Wheelchair-accessible vehicles, booked ahead. Accessible cars are a limited part of any private hire fleet, so the honest advice is the same every time: book early and tell us the details.",
    sections: [
      {
        heading: "Why these journeys are booked in advance",
        paragraphs: [
          "An accessible vehicle is not interchangeable with the rest of the fleet, and there are fewer of them. Booking ahead is what lets us allocate one to your journey rather than hoping one is free at the moment you call.",
          "If you need an accessible vehicle at short notice, call the booking line and we will tell you plainly what is available rather than accepting a booking we cannot cover.",
        ],
      },
      {
        heading: "What we need to know",
        paragraphs: [
          "These details decide which vehicle is suitable, so they are worth giving in full:",
        ],
        bullets: [
          "The type of wheelchair or mobility equipment — manual, powered, or a scooter.",
          "Whether the passenger will travel seated in the chair or transfer to a vehicle seat.",
          "Whether a ramp is needed, and anything about the pickup point we should know.",
          "How many other people are travelling, and how much luggage.",
        ],
      },
      {
        heading: "Travelling to an airport",
        paragraphs: [
          "Accessible airport transfers are booked the same way, with the same details, plus the flight number. Give as much notice as you can: an accessible vehicle for a five o'clock departure is the hardest combination to arrange at short notice.",
        ],
      },
    ],
    faqs: ACCESSIBLE_FAQS,
    related: [
      { label: "Group and multi-seater travel", href: "/services/group-travel" },
      { label: "Airport transfers", href: "/airport-transfers" },
      { label: "Contact us", href: "/contact" },
    ],
  },
};
