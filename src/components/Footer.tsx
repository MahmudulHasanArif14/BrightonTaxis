import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" data-scroll-section className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl font-display">
                  W
                </span>
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight font-display leading-none">
                  Western Cars
                </span>
                <span className="block text-green-400 text-xs font-medium -mt-0.5">
                  Brighton
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Licensed private hire operator serving Brighton &amp; Hove 24/7
              since 2007. Airport transfers, corporate travel and
              wheelchair-accessible taxis.
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="tel:01273220220"
                className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                <Phone size={16} />
                01273 220220
              </a>
              <a
                href="mailto:info@westerncarsbrighton.co.uk"
                className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                <Mail size={16} />
                info@westerncarsbrighton.co.uk
              </a>
              <p className="flex items-start gap-2 text-gray-400">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                Mocatta House, Trafalgar Place
                <br />
                Brighton, BN1 4DU
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/#services" className="hover:text-green-400 transition-colors">
                  Airport Transfers
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-green-400 transition-colors">
                  Local Journeys
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-green-400 transition-colors">
                  Corporate Accounts
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-green-400 transition-colors">
                  Event Hire
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-green-400 transition-colors">
                  Accessible Taxis
                </Link>
              </li>
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="font-semibold text-white mb-4">Areas We Serve</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Brighton (BN1)</li>
              <li>Hove (BN3)</li>
              <li>Kemptown &amp; Marina (BN2)</li>
              <li>Portslade &amp; Shoreham</li>
              <li>Lewes &amp; Worthing</li>
              <li>Gatwick &amp; Heathrow</li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="https://westerncars.webbooker.icabbi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                >
                  Book Online
                </a>
              </li>
              <li>
                <a href="tel:01273220220" className="hover:text-green-400 transition-colors">
                  Call Us 24/7
                </a>
              </li>
              <li>
                <Link href="/#fleet" className="hover:text-green-400 transition-colors">
                  Our Fleet
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              {/* An internal link to the blog from every page. A page that is
                  only reachable from a sitemap is a page crawlers reach last
                  and users never reach at all. */}
              <li>
                <Link href="/blog" className="hover:text-green-400 transition-colors">
                  Travel Advice &amp; Guides
                </Link>
              </li>
            </ul>
            <p className="mt-6 text-xs text-gray-500">
              Open 24 hours, 7 days a week
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Western Cars Private Hire Limited.
            Registered in England &amp; Wales, Company No. 09243357.
          </p>
          <p>Licensed Private Hire Operator — Brighton &amp; Hove</p>
        </div>
      </div>
    </footer>
  );
}
