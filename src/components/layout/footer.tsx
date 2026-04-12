import Link from 'next/link'
import Image from 'next/image'
import { BRAND } from '@/lib/constants'

const footerLinks = {
  shop: [
    { label: 'Ankara Prints', href: '/products?category=ankara' },
    { label: 'Casual Wear', href: '/products?category=casual' },
    { label: 'Accessories', href: '/products?category=accessories' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
  ],
  help: [
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Shipping & Returns', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Our Story', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-asa-charcoal text-white border-t-2 border-asa-gold">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/">
              <Image
                src="/images/sible-logo.webp"
                alt="Sible Couture"
                width={400}
                height={92}
                className="h-11 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-3 text-sm text-gray-400 max-w-xs leading-relaxed">
              {BRAND.tagline}. Celebrating African heritage through modern fashion.
            </p>
            <div className="flex gap-4 mt-5">
              <a href={BRAND.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-asa-gold transition-colors text-sm">
                Instagram
              </a>
              <a href={BRAND.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-asa-gold transition-colors text-sm">
                Facebook
              </a>
              <a href={BRAND.social.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-asa-gold transition-colors text-sm">
                TikTok
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">
              <span className="text-asa-gold">—</span> Shop
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-asa-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">
              <span className="text-asa-gold">—</span> Help
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-asa-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">
              <span className="text-asa-gold">—</span> Stay Connected
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form className="flex" action="#">
              <div className="flex w-full rounded-full overflow-hidden border border-white/20 focus-within:border-asa-gold transition-colors">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-transparent text-sm placeholder:text-gray-500 focus:outline-none min-w-0"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-asa-gold text-asa-charcoal font-medium text-sm hover:bg-asa-gold/90 transition-colors whitespace-nowrap"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Sible Couture. All rights reserved.
          </p>
          <div className="flex gap-3 text-xs text-gray-500">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
            <span>Apple Pay</span>
            <span>Google Pay</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
