"use client";

import type { MouseEvent, ReactNode } from "react";
import { useScrolled } from "@/app/hooks/use-scrolled";
import { useDisclosure } from "@/app/hooks/use-disclosure";

interface HeaderShellProps {
  /** ロゴとデスクトップナビ（Server Component で描画済み） */
  children: ReactNode;
  /** モバイルメニューの中身（Server Component で描画済み） */
  mobileMenu: ReactNode;
}

/**
 * ヘッダーのうち状態を持つ部分だけを受け持つ Client Component。
 * - スクロールしたら背景を付ける
 * - モバイルメニューの開閉（メニュー内のリンクを押したら閉じる）
 */
export default function HeaderShell({ children, mobileMenu }: HeaderShellProps) {
  const isScrolled = useScrolled(50);
  const menu = useDisclosure();

  // リンクは Server Component 側で描画しているので、クリックはイベント委譲で拾って閉じる
  const closeOnLinkClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) menu.close();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAFAF8]/95 backdrop-blur-sm shadow-[0_1px_0_0_#E5E4DF]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20" aria-label="メインナビゲーション">
          {children}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-[#2C2C2C]"
            onClick={menu.toggle}
            aria-expanded={menu.isOpen}
            aria-controls="mobile-menu"
            aria-label={menu.isOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {menu.isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {menu.isOpen && (
          <div
            id="mobile-menu"
            className="md:hidden py-6 border-t border-[#E5E4DF] bg-[#FAFAF8]"
            onClick={closeOnLinkClick}
          >
            {mobileMenu}
          </div>
        )}
      </div>
    </header>
  );
}
