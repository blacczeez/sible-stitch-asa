import Link from 'next/link'
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
    <footer className="bg-asa-charcoal text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-3xl font-serif font-bold text-asa-gold">
              ÀṢÀ
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              {BRAND.tagline}. Celebrating African heritage through modern fashion.
            </p>
            <div className="flex gap-4 mt-4">
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
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Connected</h3>
            <p className="text-sm text-gray-400 mb-3">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form className="flex gap-2" action="#">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-asa-gold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-asa-gold text-asa-charcoal font-medium rounded-md text-sm hover:bg-asa-gold/90 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ÀṢÀ Fashion. All rights reserved.
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
