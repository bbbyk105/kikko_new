import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { ArrowLink } from "@/app/components/ui/arrow-link";
import { navigation, primaryActions } from "@/app/data/site";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { index: false },
};

/**
 * 404 ページ。
 * (site) レイアウトの外（ルート）で描画されるので、ヘッダー・フッターをここで置く。
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="pt-40 pb-28 lg:pt-48 lg:pb-40">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
              <div className="lg:col-span-7">
                <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-4 animate-fade-up">
                  404 — NOT FOUND
                </p>
                <h1 className="font-[var(--font-cormorant)] text-3xl md:text-4xl lg:text-5xl leading-tight tracking-wide text-[#2C2C2C] mb-6 animate-fade-up animation-delay-100">
                  お探しのページが見つかりませんでした。
                </h1>
                <p className="text-[#6B6B6B] leading-relaxed mb-12 animate-fade-up animation-delay-200">
                  ページが移動したか、URL が変わった可能性があります。
                  <br className="hidden sm:block" />
                  下のメニューから、お探しの情報をご覧ください。
                </p>
                {/* 横並びでは長いほうの文字幅に合わせて2つを同じ幅にする */}
                <div className="grid gap-4 sm:w-fit sm:grid-flow-col sm:auto-cols-fr animate-fade-up animation-delay-300">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-10 py-4 text-[13px] tracking-[0.12em] text-[#FAFAF8] bg-[#2C2C2C] border border-transparent hover:bg-[#3D3D3D] transition-colors"
                  >
                    トップページへ
                  </Link>
                  <Link
                    href={primaryActions.reserve.href}
                    className="inline-flex items-center justify-center px-10 py-4 text-[13px] tracking-[0.12em] text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAFAF8] transition-colors"
                  >
                    {primaryActions.reserve.label}
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block lg:col-span-5 text-right" aria-hidden="true">
                <span className="font-[var(--font-cormorant)] text-[10rem] leading-none tracking-tight text-[#E8E7E2]">
                  404
                </span>
              </div>
            </div>

            <nav aria-label="主なページ" className="mt-24 pt-12 border-t border-[#E5E4DF]">
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-6">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <ArrowLink href={item.href}>{item.nameJa}</ArrowLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
