"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

interface HomeLinkProps {
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
}

/**
 * トップページへのリンク（ヘッダーのロゴ用）。
 * すでにトップページにいるときは同じ URL への遷移になりスクロールしないので、
 * 遷移せずにページ先頭へ戻す。
 */
export default function HomeLink({ className, "aria-label": ariaLabel, children }: HomeLinkProps) {
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    // Cmd/Ctrl クリックなどで新しいタブに開く操作は邪魔しない
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <Link href="/" className={className} aria-label={ariaLabel} onClick={handleClick}>
      {children}
    </Link>
  );
}
