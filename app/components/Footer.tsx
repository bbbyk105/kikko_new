import Link from "next/link";
import { siteConfig, navigation, spaceCategories, primaryActions } from "@/app/data/site";
import { BlockLabel } from "@/app/components/ui/typography";

const menuLinks = [{ name: "Home", href: "/" }, ...navigation];

const spaceLinks = spaceCategories.map((category) => ({
  name: category.titleJa,
  href: `/space/${category.id}`,
}));

const linkClass = "text-[13px] tracking-[0.03em] text-[#9A9A9A] hover:text-[#FAFAF8] transition-colors";

export default function Footer() {
  return (
    <footer className="py-20 lg:py-24 bg-[#2C2C2C] text-[#FAFAF8]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-14 lg:gap-10 mb-20">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-block mb-8">
              <span className="font-[var(--font-cormorant)] text-[1.625rem] tracking-[0.08em]">
                {siteConfig.nameEn}
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-[#6B6B6B] mt-2">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-[13px] text-[#7A7A7A] leading-[2] tracking-[0.02em] max-w-sm mb-10">
              {siteConfig.tagline}
              <br />
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={primaryActions.reserve.href}
                className="inline-flex items-center justify-center px-7 py-3 text-[12px] tracking-[0.12em] text-[#2C2C2C] bg-[#FAFAF8] hover:bg-[#E5E4DF] transition-colors"
              >
                {primaryActions.reserve.label}
              </Link>
              <Link
                href={primaryActions.contact.href}
                className="inline-flex items-center justify-center px-7 py-3 text-[12px] tracking-[0.12em] text-[#FAFAF8] border border-[#6B6B6B] hover:border-[#FAFAF8] transition-colors"
              >
                {primaryActions.contact.label}
              </Link>
            </div>
          </div>

          {/* Menu */}
          <nav aria-label="フッターナビゲーション" className="lg:col-span-2">
            <BlockLabel theme="dark" className="mb-5">
              Menu
            </BlockLabel>
            <ul className="space-y-3.5">
              {menuLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={primaryActions.reserve.href} className={linkClass}>
                  Reserve
                </Link>
              </li>
            </ul>
          </nav>

          {/* Space */}
          <nav aria-label="利用スタイル" className="lg:col-span-3">
            <BlockLabel theme="dark" className="mb-5">
              Space
            </BlockLabel>
            <ul className="space-y-3.5">
              {spaceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <BlockLabel theme="dark" className="mb-5">
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
        <div className="pt-10 border-t border-[#404040] flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-[11px] tracking-[0.05em] text-[#5A5A5A]">
            © {new Date().getFullYear()} {siteConfig.name} ({siteConfig.nameEn}). All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href={primaryActions.mypage.href}
              className="text-[11px] tracking-[0.05em] text-[#7A7A7A] hover:text-[#FAFAF8] transition-colors"
            >
              マイページ（ご予約の確認・キャンセル）
            </Link>
            <Link
              href="/privacy"
              className="text-[11px] tracking-[0.05em] text-[#7A7A7A] hover:text-[#FAFAF8] transition-colors"
            >
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
