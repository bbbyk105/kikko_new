"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig, navigation } from "@/app/data/site";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col items-start gap-0 transition-opacity hover:opacity-70"
            aria-label={`${siteConfig.name} トップページへ`}
          >
            <span className="font-[var(--font-cormorant)] text-xl tracking-wider text-[#2C2C2C]">
              {siteConfig.nameEn}
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[#6B6B6B]">
              {siteConfig.name}
            </span>
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

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-[#2C2C2C]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden py-6 border-t border-[#E5E4DF] bg-[#FAFAF8]"
          >
            <ul className="flex flex-col gap-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="block py-2 text-base tracking-wider text-[#2C2C2C] hover:text-[#5C6B5C] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link
                  href="/reserve"
                  className="inline-block px-6 py-3 text-sm tracking-wider text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ご予約
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
