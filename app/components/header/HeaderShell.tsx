"use client";

import { useEffect, type MouseEvent, type ReactNode } from "react";
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
 * - スクロールしたら背景を付ける（メニューを開いている間も背景あり）
 * - モバイルメニューの開閉（リンクを押す・Esc で閉じる。開いている間は背面をスクロールさせない）
 */
export default function HeaderShell({ children, mobileMenu }: HeaderShellProps) {
  const isScrolled = useScrolled(50);
  const menu = useDisclosure();
  const { isOpen, close } = menu;
  const isSolid = isScrolled || isOpen;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    // 開いたまま PC 幅に広げたら閉じる（パネルは lg で非表示なのにスクロールだけ止まるのを防ぐ）
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = (e: MediaQueryListEvent) => {
      if (e.matches) close();
    };
    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [isOpen, close]);

  // リンクは Server Component 側で描画しているので、クリックはイベント委譲で拾って閉じる
  const closeOnLinkClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) close();
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-300 ${
          isSolid ? "bg-[#FAFAF8]/95 shadow-[0_1px_0_0_#E5E4DF]" : "bg-transparent"
        } ${isScrolled && !isOpen ? "backdrop-blur-sm" : ""}`}
      >
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {children}

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden -mr-2 p-2 text-[#2C2C2C]"
              onClick={menu.toggle}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu（header の backdrop-filter の影響を受けないよう header の外に置く） */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto overscroll-contain bg-[#FAFAF8] animate-fade-in"
          onClick={closeOnLinkClick}
        >
          {mobileMenu}
        </div>
      )}
    </>
  );
}
