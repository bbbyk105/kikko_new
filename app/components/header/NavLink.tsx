"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isActivePath } from "@/lib/routes";

interface NavLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/**
 * 現在地を知っているリンク（ここだけ Client Component）。
 * 表示中のページ（または配下のページ）なら data-active を付けるので、
 * 見た目は親側で `group-data-[active=true]/nav:` などを使って指定する。
 */
export default function NavLink({ href, className, children }: NavLinkProps) {
  const pathname = usePathname();
  const isCurrent = pathname === href;
  const isActive = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      className={className}
      aria-current={isCurrent ? "page" : isActive ? "true" : undefined}
      data-active={isActive || undefined}
    >
      {children}
    </Link>
  );
}
