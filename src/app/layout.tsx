import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { LocalBusinessJsonLd, FaqJsonLd } from "@/components/Seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Western Cars Brighton & Hove | 24/7 Taxis & Airport Transfers | Gatwick, Heathrow",
    template: "%s | Western Cars Brighton",
  },
  description:
    "Licensed private hire taxis in Brighton & Hove since 2007. 24/7 airport transfers to Gatwick, Heathrow, Stansted & Luton. Local journeys, corporate accounts & wheelchair-accessible Cabs. Call 01273 220220.",
  keywords: [
    "taxi Brighton",
    "Brighton airport taxi",
    "Gatwick taxi from Brighton",
    "Heathrow transfer Brighton",
    "private hire Brighton",
    "24/7 taxi Brighton",
    "wheelchair accessible taxi Brighton",
    "corporate taxi Brighton",
    "Western Cars Brighton",
    "",
  ],
  applicationName: "Western Cars Brighton",

  authors: [{ name: "Western Cars Brighton" }],
  creator: "Western Cars Brighton",
  publisher: "Western Cars Private Hire Limited",
  metadataBase: new URL("https://www.westerncarsbrighton.co.uk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.westerncarsbrighton.co.uk",
    siteName: "Western Cars Brighton",
    title: "Brighton Taxi & Airport Transfers | Western Cars",
    description:
      "Reliable private hire Cabs across Brighton & Hove. Airport transfers, local journeys & corporate accounts.Call 01273 220 220 for a quote or to book your taxi.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200",
        width: 1200,
        height: 630,
        alt: "Western Cars Brighton – Premium taxi fleet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Western Cars Brighton | 24/7 Taxis & Airport Transfers",
    description: "Licensed private hire since 2007. Call 01273 220220.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      {
        rel: "icon",
        url: "/favicon.ico",
      },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",

  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
    // Other services, if needed:
    // yandex: "YOUR_YANDEX_VERIFICATION_CODE",
    // yahoo: "YOUR_YAHOO_VERIFICATION_CODE",
    // other: {
    //   "msvalidate.01": "YOUR_BING_VERIFICATION_CODE",
    // },
  },

  category: "Transportation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <LocalBusinessJsonLd />
        <FaqJsonLd />
        <meta name="geo.region" content="GB-ESX" />
        <meta name="geo.placename" content="Brighton" />
        <meta name="geo.position" content="50.8225;-0.1372" />
        <meta name="ICBM" content="50.8225, -0.1372" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
