import Link from "next/link";
import { siteConfig, navigation } from "@/app/data/site";

const footerNavigation = [
  ...navigation,
  { name: "Reserve", href: "/reserve" },
];

export default function Footer() {
  return (
    <footer className="py-16 lg:py-20 bg-[#2C2C2C] text-[#FAFAF8]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="font-[var(--font-cormorant)] text-2xl tracking-wider">
                {siteConfig.nameEn}
              </span>
              <span className="block text-xs tracking-[0.2em] text-[#8A8A8A] mt-1">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm text-[#8A8A8A] leading-relaxed max-w-sm">
              {siteConfig.tagline}
              <br />
              {siteConfig.description}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="フッターナビゲーション">
            <h3 className="text-xs tracking-[0.2em] text-[#8A8A8A] mb-4">
              MENU
            </h3>
            <ul className="space-y-3">
              {footerNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#B0B0B0] hover:text-[#FAFAF8] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs tracking-[0.2em] text-[#8A8A8A] mb-4">
              CONTACT
            </h3>
            <address className="not-italic space-y-3 text-sm text-[#B0B0B0]">
              <p>
                <span className="block text-[#8A8A8A] text-xs mb-1">住所</span>
                {siteConfig.address.postal}
                <br />
                {siteConfig.address.full}
              </p>
              <p>
                <span className="block text-[#8A8A8A] text-xs mb-1">
                  電話番号
                </span>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="hover:text-[#FAFAF8] transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </p>
              <p>
                <span className="block text-[#8A8A8A] text-xs mb-1">
                  営業時間
                </span>
                {siteConfig.hours.days} {siteConfig.hours.regular}
              </p>
            </address>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#404040]">
          <p className="text-xs text-[#6B6B6B] text-center">
            © {new Date().getFullYear()} {siteConfig.name} ({siteConfig.nameEn}
            ). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
