export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "Western Cars Brighton",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800",
    "@id": "https://www.westerncarsbrighton.co.uk",
    url: "https://www.westerncarsbrighton.co.uk",
    telephone: "+441273220220",
    email: "info@westerncarsbrighton.co.uk",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mocatta House, Trafalgar Place",
      addressLocality: "Brighton",
      postalCode: "BN1 4DU",
      addressRegion: "East Sussex",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 50.8225,
      longitude: -0.1372,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "££",
    areaServed: [
      "Brighton",
      "Hove",
      "Kemptown",
      "Portslade",
      "Shoreham-by-Sea",
      "Lewes",
      "Worthing",
      "Haywards Heath",
      "Gatwick Airport",
      "Heathrow Airport",
      "Stansted Airport",
      "Luton Airport",
      "London City Airport",
    ],
    foundingDate: "2007",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "700",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FaqJsonLd() {
  const faqs = [
    {
      question: "How do I book a taxi with Western Cars Brighton?",
      answer:
        "Book online via our web booker, call 01273 220220, email info@westerncarsbrighton.co.uk, or use our iOS/Android app.",
    },
    {
      question: "What areas do you cover?",
      answer:
        "We cover all of Brighton & Hove (BN1–BN3), Kemptown, Preston Park, Portslade, Shoreham-by-Sea, Lewes, Worthing, Haywards Heath and airport transfers to Gatwick, Heathrow, London City, Stansted and Luton.",
    },
    {
      question: "Are you available 24/7?",
      answer:
        "Yes — we operate 24 hours a day, 7 days a week, including bank holidays.",
    },
    {
      question: "How do your prices work?",
      answer:
        "Airport transfer prices are guide prices and confirmed before booking. Local metered journeys follow Brighton & Hove City Council tariffs.",
    },
    {
      question: "How do I open a corporate account?",
      answer:
        "Call us on 01273 220220 or email info@westerncarsbrighton.co.uk. We'll set up your account with priority booking and monthly billing.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
