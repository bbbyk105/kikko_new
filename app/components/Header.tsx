import Link from "next/link";
import { siteConfig, navigation } from "@/app/data/site";
import HeaderShell from "@/app/components/header/HeaderShell";

/**
 * ヘッダー（Server Component）。
 * ロゴとリンクはサーバーで描画し、スクロール検知・メニュー開閉だけ HeaderShell（Client）に任せる。
 */
export default function Header() {
  return (
    <HeaderShell
      mobileMenu={
        <ul className="flex flex-col gap-4">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="block py-2 text-base tracking-wider text-[#2C2C2C] hover:text-[#5C6B5C] transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li className="pt-4">
            <Link
              href="/reserve"
              className="inline-block px-6 py-3 text-sm tracking-wider text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] transition-colors"
            >
              ご予約
            </Link>
          </li>
        </ul>
      }
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex flex-col items-start gap-0 transition-opacity hover:opacity-70"
        aria-label={`${siteConfig.name} トップページへ`}
      >
        <span className="font-[var(--font-cormorant)] text-xl tracking-wider text-[#2C2C2C]">
          {siteConfig.nameEn}
        </span>
        <span className="text-[10px] tracking-[0.2em] text-[#6B6B6B]">{siteConfig.name}</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-10">
        <ul className="flex items-center gap-8">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="text-sm tracking-wider text-[#2C2C2C] hover:text-[#5C6B5C] transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/reserve"
          className="px-5 py-2.5 text-sm tracking-wider text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] transition-colors"
        >
          ご予約
        </Link>
      </div>
    </HeaderShell>
  );
}
