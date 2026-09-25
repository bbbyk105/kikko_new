import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  theme?: "light" | "dark";
  /** 外部サイト（Google マップなど）を新しいタブで開く */
  external?: boolean;
  className?: string;
}

/** 下線付きの控えめなテキストリンク（「詳しく見る →」など） */
export function ArrowLink({ href, children, theme = "light", external = false, className }: ArrowLinkProps) {
  const classes = cn(
    "group/arrow inline-flex items-center gap-2 pb-1 text-[12px] tracking-[0.12em] border-b transition-colors",
    theme === "dark"
      ? "text-[#FAFAF8] border-[#6B6B6B] hover:border-[#FAFAF8]"
      : "text-[#2C2C2C] border-[#2C2C2C] hover:text-[#5C6B5C] hover:border-[#5C6B5C]",
    className
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        <ArrowUpRight
          className="w-3.5 h-3.5 transition-transform duration-300 group-hover/arrow:-translate-y-0.5 group-hover/arrow:translate-x-0.5"
          aria-hidden="true"
        />
        <span className="sr-only">（新しいタブで開きます）</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      <ArrowRight
        className="w-3.5 h-3.5 transition-transform duration-300 group-hover/arrow:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}
