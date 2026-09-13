import Link from "next/link";
import {
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiMail,
  FiArrowRight,
} from "react-icons/fi";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Lawyers", href: "/lawyers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund" },
  { label: "FAQ", href: "/faq" },
];

const socials = [
  { icon: FiFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FiTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FiLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FiInstagram, href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white px-5 md:px-18">
      <div className="container-page py-16">

        {/* ───── Top Grid ───── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* ── Brand Column ── */}
          <div className="lg:col-span-4">
            <Link href="/">
              <h2 className="font-heading text-2xl font-bold leading-none">
                <span className="text-white">Legal</span>
                <span className="text-secondary">Ease</span>
              </h2>
            </Link>
            <p className="mt-5 text-sm text-white/70 leading-relaxed max-w-sm font-sans">
              Connect with trusted legal experts. Browse, hire, and consult
              verified lawyers online — securely and transparently.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 text-white/80 hover:bg-secondary hover:text-primary hover:border-secondary transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="lg:col-span-2">
            <h3 className="font-heading text-base font-semibold text-white">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-secondary transition font-sans"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Legal Links ── */}
          <div className="lg:col-span-2">
            <h3 className="font-heading text-base font-semibold text-white">
              Legal
            </h3>
            <ul className="mt-5 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-secondary transition font-sans"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Newsletter ── */}
          <div className="lg:col-span-4">
            <h3 className="font-heading text-base font-semibold text-white">
              Stay Updated
            </h3>
            <p className="mt-5 text-sm text-white/70 leading-relaxed font-sans">
              Get legal tips and updates on new lawyers — straight to your
              inbox.
            </p>

            <form
             
              className="mt-5 flex items-center bg-white/10 border border-white/20 rounded-lg overflow-hidden focus-within:border-secondary transition"
            >
              <div className="pl-3 text-white/60">
                <FiMail size={16} />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none font-sans"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="bg-secondary hover:brightness-95 text-primary px-4 py-3 transition"
              >
                <FiArrowRight size={16} />
              </button>
            </form>

            <p className="mt-3 text-xs text-white/50 font-sans">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>

        </div>

        {/* ───── Divider ───── */}
        <div className="mt-14 pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-xs text-white/60 font-sans">
            © {new Date().getFullYear()} LegalEase. All rights reserved.
          </p>

          <p className="text-xs text-white/60 font-sans">
            Built with <span className="text-secondary">♥</span> for legal
            seekers worldwide.
          </p>

        </div>

      </div>
    </footer>
  );
}