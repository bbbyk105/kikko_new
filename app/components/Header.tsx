import Link from "next/link";
import { ArrowRight, ChevronDown, UserRound } from "lucide-react";
import { siteConfig, navigation, spaceCategories, primaryActions } from "@/app/data/site";
import HeaderShell from "@/app/components/header/HeaderShell";
import NavLink from "@/app/components/header/NavLink";
import NavDropdown from "@/app/components/header/NavDropdown";
import HomeLink from "@/app/components/header/HomeLink";

/** Space の下に出すサブメニュー（利用スタイル別の詳細ページ） */
const spaceLinks = spaceCategories.map((category) => ({
  number: category.number,
  name: category.title,
  nameJa: category.titleJa,
  href: `/space/${category.id}`,
}));

const SPACE_HREF = "/space";

/**
 * ヘッダー（Server Component）。
 * ロゴとリンクはサーバーで描画し、スクロール検知・メニュー開閉は HeaderShell、
 * 現在地の表示は NavLink（どちらも Client）に任せる。
 */
export default function Header() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:text-sm focus:bg-[#2C2C2C] focus:text-[#FAFAF8]"
      >
        本文へスキップ
      </a>

      <HeaderShell mobileMenu={<MobileMenu />}>
        {/* Logo（トップページにいるときは先頭へスクロール） */}
        <HomeLink
          className="flex flex-col items-start gap-0 transition-opacity hover:opacity-70"
          aria-label={`${siteConfig.name} トップページへ`}
        >
          <span className="font-[var(--font-cormorant)] text-xl tracking-wider text-[#2C2C2C]">
            {siteConfig.nameEn}
          </span>
          <span className="text-[10px] tracking-[0.2em] text-[#6B6B6B]">{siteConfig.name}</span>
        </HomeLink>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10" aria-label="メインナビゲーション">
          <ul className="flex items-center gap-7 xl:gap-9">
            {navigation.map((item) => {
              const link = (
                <NavLink href={item.href} className="group/nav relative flex flex-col items-center py-2">
                  <span className="flex items-center gap-1 text-[13px] tracking-[0.08em] text-[#2C2C2C] transition-colors group-hover/nav:text-[#5C6B5C] group-data-[active=true]/nav:text-[#5C6B5C]">
                    {item.name}
                    {item.href === SPACE_HREF && (
                      <ChevronDown
                        className="w-3 h-3 text-[#9A9A9A] transition-transform duration-300 group-data-[open=true]/menu:rotate-180"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  <span className="mt-0.5 text-[9px] tracking-[0.18em] text-[#9A9A9A]">
                    {item.nameJa}
                  </span>
                  <span
                    className="absolute bottom-0 left-0 right-0 h-px bg-[#5C6B5C] origin-left scale-x-0 transition-transform duration-300 group-hover/nav:scale-x-100 group-data-[active=true]/nav:scale-x-100"
                    aria-hidden="true"
                  />
                </NavLink>
              );

              return item.href === SPACE_HREF ? (
                <NavDropdown key={item.href} panel={<SpaceDropdown />}>
                  {link}
                </NavDropdown>
              ) : (
                <li key={item.href}>{link}</li>
              );
            })}
          </ul>
          <div className="flex items-center gap-5">
            <NavLink
              href={primaryActions.mypage.href}
              className="group/nav flex items-center gap-1.5 py-2 text-[12px] tracking-[0.08em] text-[#6B6B6B] hover:text-[#2C2C2C] data-[active=true]:text-[#5C6B5C] transition-colors"
            >
              <UserRound className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              {primaryActions.mypage.label}
            </NavLink>
            <Link
              href={primaryActions.reserve.href}
              className="px-6 py-3 text-[13px] tracking-[0.12em] text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] transition-colors"
            >
              {primaryActions.reserve.label}
            </Link>
          </div>
        </nav>
      </HeaderShell>
    </>
  );
}

/** デスクトップの Space サブメニュー（開閉は NavDropdown が data-open で切り替える） */
function SpaceDropdown() {
  return (
    <div className="invisible opacity-0 absolute left-1/2 top-full -translate-x-1/2 translate-y-1 pt-3 transition-[opacity,translate,visibility] duration-300 group-data-[open=true]/menu:visible group-data-[open=true]/menu:opacity-100 group-data-[open=true]/menu:translate-y-0">
      <ul className="w-72 py-3 bg-[#FAFAF8] border border-[#E5E4DF] shadow-[0_16px_40px_-24px_rgba(44,44,44,0.35)]">
        {spaceLinks.map((link) => (
          <li key={link.href}>
            <NavLink
              href={link.href}
              className="group/sub flex items-baseline gap-4 px-6 py-3 transition-colors hover:bg-[#F7F6F3] data-[active=true]:bg-[#F7F6F3]"
            >
              <span className="w-5 shrink-0 font-[var(--font-cormorant)] text-base text-[#B5B4AE]" aria-hidden="true">
                {link.number}
              </span>
              <span className="flex flex-col">
                <span className="text-[13px] tracking-[0.06em] text-[#2C2C2C] group-hover/sub:text-[#5C6B5C] group-data-[active=true]/sub:text-[#5C6B5C]">
                  {link.name}
                </span>
                <span className="text-[10px] tracking-[0.12em] text-[#9A9A9A]">{link.nameJa}</span>
              </span>
            </NavLink>
          </li>
        ))}
        <li className="mt-2 pt-2 mx-6 border-t border-[#E5E4DF]">
          <Link
            href={SPACE_HREF}
            className="group/all flex items-center justify-between py-2.5 text-[11px] tracking-[0.12em] text-[#6B6B6B] hover:text-[#2C2C2C] transition-colors"
          >
            空間と利用シーンを見る
            <ArrowRight
              className="w-3 h-3 transition-transform duration-300 group-hover/all:translate-x-1"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </Link>
        </li>
      </ul>
    </div>
  );
}

/** モバイルメニューの中身 */
function MobileMenu() {
  return (
    <nav
      className="mx-auto max-w-[1280px] px-6 pt-6 pb-12 flex flex-col"
      aria-label="メインナビゲーション"
    >
      <ul className="border-b border-[#E5E4DF]">
        {navigation.map((item) => (
          <li key={item.href} className="border-t border-[#E5E4DF]">
            <NavLink href={item.href} className="group/nav flex items-baseline justify-between py-5">
              <span className="font-[var(--font-cormorant)] text-[1.625rem] leading-none tracking-[0.04em] text-[#2C2C2C] group-data-[active=true]/nav:text-[#5C6B5C]">
                {item.name}
              </span>
              <span className="text-[11px] tracking-[0.15em] text-[#9A9A9A]">{item.nameJa}</span>
            </NavLink>

            {item.href === SPACE_HREF && (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pb-5 -mt-1">
                {spaceLinks.map((link) => (
                  <li key={link.href}>
                    <NavLink
                      href={link.href}
                      className="group/sub flex items-baseline gap-2 py-1.5 text-[12px] tracking-[0.06em] text-[#6B6B6B] data-[active=true]:text-[#5C6B5C]"
                    >
                      <span className="font-[var(--font-cormorant)] text-[13px] text-[#B5B4AE]" aria-hidden="true">
                        {link.number}
                      </span>
                      {link.nameJa}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-2 gap-3 mt-10">
        <Link
          href={primaryActions.reserve.href}
          className="inline-flex items-center justify-center py-4 text-[13px] tracking-[0.12em] text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] transition-colors"
        >
          {primaryActions.reserve.label}
        </Link>
        <Link
          href={primaryActions.contact.href}
          className="inline-flex items-center justify-center py-4 text-[13px] tracking-[0.12em] text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAFAF8] transition-colors"
        >
          {primaryActions.contact.label}
        </Link>
      </div>

      <NavLink
        href={primaryActions.mypage.href}
        className="mt-3 inline-flex items-center justify-center gap-2 py-4 text-[13px] tracking-[0.08em] text-[#2C2C2C] border border-[#E5E4DF] hover:border-[#2C2C2C] transition-colors"
      >
        <UserRound className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
        マイページ（ご予約の確認・キャンセル）
      </NavLink>

      <div className="mt-10 space-y-1 text-[12px] tracking-[0.04em] text-[#9A9A9A]">
        <a
          href={`tel:${siteConfig.phone}`}
          className="font-[var(--font-cormorant)] text-2xl tracking-wide text-[#2C2C2C]"
        >
          {siteConfig.phone}
        </a>
        <p>
          {siteConfig.hours.days} {siteConfig.hours.regular}（最終入館 {siteConfig.hours.lastEntry}）
        </p>
      </div>
    </nav>
  );
}
