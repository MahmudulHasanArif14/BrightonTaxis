import type { Faq } from "@/components/Seo";
import { BUSINESS } from "./business";

/**
 * The questions this site answers.
 *
 * Two rules hold here. First, every answer leads with the answer -- an answer
 * engine quoting the first sentence should get something true and complete.
 * Second, nothing is promised that the business has not told us it does: there
 * are no waiting times, no fixed fares, no meet-and-greet procedures and no
 * guarantees in this file, because none of those have been confirmed.
 *
 * Each array is rendered on exactly one page and handed to FaqJsonLd from that
 * same page, so the markup always matches visible text.
 */

export const HOME_FAQS: Faq[] = [
  {
    question: "How do I book a taxi with Western Cars Brighton?",
    answer: `Book online via our web booker, call ${BUSINESS.telephone}, email ${BUSINESS.email}, or use our iOS/Android app.`,
  },
  {
    question: "Are you available 24/7?",
    answer:
      "Yes — we operate 24 hours a day, 7 days a week, including bank holidays.",
  },
  {
    question: "Which airports do you cover?",
    answer:
      "We run transfers from Brighton and Hove to Gatwick, Heathrow, London City, Stansted and Luton. Transfers are pre-booked so the car is allocated before the day of travel.",
  },
  {
    question: "Can I book a wheelchair-accessible vehicle?",
    answer:
      "Yes. Wheelchair-accessible vehicles are available and should be requested when you book, so the right vehicle is allocated to your journey rather than being found at short notice.",
  },
  {
    question: "Do you take bookings for groups?",
    answer:
      "Yes. Tell us the number of passengers and the amount of luggage when you book and we will allocate a vehicle that fits, or more than one vehicle where that works better.",
  },
  {
    question: "How do your prices work?",
    answer:
      "Our published airport transfer prices are guide prices and may vary depending on your pickup address, destination, date, time and journey requirements — contact us to confirm your fare before booking. Local metered journeys follow Brighton & Hove City Council tariffs.",
  },
  {
    question: "How do I open a corporate account?",
    answer: `Call us on ${BUSINESS.telephone} or email ${BUSINESS.email}. We'll set up your account with priority booking and monthly billing.`,
  },
  {
    question: "What areas do you cover?",
    answer:
      "We cover all of Brighton & Hove — Brighton city centre (BN1), Kemptown (BN2), Hove (BN3), Preston Park, Portslade and Shoreham-by-Sea — plus the rest of East & West Sussex and airport transfers to Gatwick, Heathrow, London City, Stansted and Luton.",
  },
];

export const AIRPORT_FAQS: Faq[] = [
  {
    question: "How far in advance should I book an airport transfer?",
    answer:
      "As soon as you know the flight. Booking ahead is what lets us allocate a vehicle for the time you need, which matters most for the early-morning departures that make up a lot of airport travel from Brighton.",
  },
  {
    question: "What do you need to know when I book a transfer?",
    answer:
      "The pickup address, the airport and terminal if you know it, the flight number, the date and time, how many passengers, and how much luggage. The flight number is the detail most worth giving us.",
  },
  {
    question: "How is the price of an airport transfer confirmed?",
    answer: `Airport transfer prices are confirmed with you before the booking is accepted — by phone on ${BUSINESS.telephone}, or as part of the online booking. This site does not publish fixed airport fares.`,
  },
  {
    question: "Can you collect me from the airport on the way back?",
    answer:
      "Yes. Return journeys are booked the same way as outbound ones. Give us the inbound flight number so the pickup can be planned around the flight rather than the scheduled landing time alone.",
  },
  {
    question: "What happens if my flight is delayed?",
    answer: `Let us know as soon as you can, on ${BUSINESS.telephone}. The booking line is staffed ${BUSINESS.phoneHours}, so a change at an awkward hour still reaches a person.`,
  },
];

export const CORPORATE_FAQS: Faq[] = [
  {
    question: "How does a corporate account work?",
    answer:
      "Journeys are booked against your company account rather than paid for in the car, so staff and visitors travel without handling payment. We agree how your team books and how the account is billed when the account is set up.",
  },
  {
    question: "Can we book travel for clients and visitors?",
    answer:
      "Yes. Bookings can be made by someone other than the passenger — a PA, an office manager or a reception desk — using the account.",
  },
  {
    question: "How do we set an account up?",
    answer: `Call ${BUSINESS.telephone} or email ${BUSINESS.email}. We will talk through how your team travels and what billing arrangement suits.`,
  },
];

export const ACCESSIBLE_FAQS: Faq[] = [
  {
    question: "How do I book a wheelchair-accessible taxi?",
    answer: `Book in advance and say that you need a wheelchair-accessible vehicle. Calling ${BUSINESS.telephone} is the most reliable way, because it lets us check what will fit before the booking is confirmed.`,
  },
  {
    question: "What should I tell you when booking an accessible journey?",
    answer:
      "The type of wheelchair or mobility equipment, whether the passenger will travel in the chair or transfer to a seat, and how many other people are travelling. These are the details that decide which vehicle is suitable.",
  },
  {
    question: "Is an accessible vehicle always available?",
    answer:
      "Accessible vehicles are a limited part of any private hire fleet, so they should be booked ahead rather than requested at short notice. Call us and we will tell you honestly what is available for the time you need.",
  },
];

export const CONTACT_FAQS: Faq[] = [
  {
    question: "What is the quickest way to reach Western Cars Brighton?",
    answer: `Call ${BUSINESS.telephone}. The booking line is staffed ${BUSINESS.phoneHours} and is the right route for anything time-sensitive, including a change to a booking you have already made.`,
  },
  {
    question: "Can I email instead?",
    answer: `Yes — ${BUSINESS.email}. Email suits account enquiries, quotes for a journey some way off, and anything with details worth writing down. For a journey today, phone us.`,
  },
  {
    question: "Where are you based?",
    answer: `${BUSINESS.address.street}, ${BUSINESS.address.locality}, ${BUSINESS.address.postalCode}. This is the company's registered office address; journeys are booked by phone or online rather than in person.`,
  },
];
