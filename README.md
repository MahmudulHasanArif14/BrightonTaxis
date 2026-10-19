# Western Cars Brighton – Modern Taxi Website

Full Next.js 15 + Tailwind CSS + GSAP + Locomotive Scroll recreation of a premium car/taxi website for **Western Cars Brighton**.

## Features

- Pixel-inspired design matching the provided Antixor mockup (adapted for taxi/private hire)
- Smooth Locomotive Scroll + GSAP ScrollTrigger animations
- SEO optimized (Open Graph, Twitter Cards, robots)
- GEO targeting (Brighton / East Sussex schema)
- AEO ready (FAQPage JSON-LD + clear answer-style content)
- LocalBusiness / TaxiService structured data
- Fully responsive
- Online high-quality Unsplash images

## Company Details Used

- **Name**: Western Cars Brighton
- **Phone**: 01273 220220
- **Email**: info@westerncarsbrighton.co.uk
- **Address**: Mocatta House, Trafalgar Place, Brighton, BN1 4DU
- **Established**: 2007
- **Services**: Airport transfers (Gatwick, Heathrow…), local journeys, corporate, events, accessible taxis
- **Booking**: https://westerncars.webbooker.icabbi.com

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger
- Locomotive Scroll
- Lucide React icons
- Framer Motion (available)

## Project Structure

```
src/
  app/
    layout.tsx      # SEO + fonts + JSON-LD
    page.tsx        # Main page composition
    globals.css     # Tailwind + locomotive styles
  components/
    Header.tsx
    Hero.tsx
    Fleet.tsx
    WhyUs.tsx
    Popular.tsx
    Services.tsx
    Testimonials.tsx
    CTA.tsx
    Footer.tsx
    SmoothScroll.tsx
    Seo.tsx
```

## License

For demonstration / client project use.
