import Link from "next/link";
import { siteConfig, navigation } from "@/app/data/site";
import { BlockLabel } from "@/app/components/ui/typography";

const footerNavigation = [
  ...navigation,
  { name: "Reserve", href: "/reserve" },
];

export default function Footer() {
  return (
    <footer className="py-20 lg:py-24 bg-[#2C2C2C] text-[#FAFAF8]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-10 mb-20">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-8">
              <span className="font-[var(--font-cormorant)] text-[1.625rem] tracking-[0.08em]">
                {siteConfig.nameEn}
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-[#6B6B6B] mt-2">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-[13px] text-[#7A7A7A] leading-[2] tracking-[0.02em] max-w-sm">
              {siteConfig.tagline}
              <br />
              {siteConfig.description}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="フッターナビゲーション">
            <BlockLabel as="h3" theme="dark" className="mb-5">
              Menu
            </BlockLabel>
            <ul className="space-y-3.5">
              {footerNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[13px] tracking-[0.03em] text-[#9A9A9A] hover:text-[#FAFAF8] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div>
            <BlockLabel as="h3" theme="dark" className="mb-5">
              Contact
            </BlockLabel>
            <address className="not-italic space-y-5 text-[13px] text-[#9A9A9A]">
              <p>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B] mb-2">住所</span>
                <span className="leading-[1.9] tracking-[0.02em]">
                  {siteConfig.address.postal}
                  <br />
                  {siteConfig.address.full}
                </span>
              </p>
              <p>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B] mb-2">
                  電話番号
                </span>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="tracking-[0.02em] hover:text-[#FAFAF8] transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </p>
              <p>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B] mb-2">
                  営業時間
                </span>
                <span className="tracking-[0.02em]">
                  {siteConfig.hours.days} {siteConfig.hours.regular}
                </span>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 border-t border-[#404040]">
          <p className="text-[11px] tracking-[0.05em] text-[#5A5A5A] text-center">
            © {new Date().getFullYear()} {siteConfig.name} ({siteConfig.nameEn}
            ). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
