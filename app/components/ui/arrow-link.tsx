import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/** 下線付きの控えめなテキストリンク（「詳しく見る →」など） */
export function ArrowLink({ href, children, className }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group/arrow inline-flex items-center gap-2 pb-1 text-[12px] tracking-[0.12em] text-[#2C2C2C] border-b border-[#2C2C2C] hover:text-[#5C6B5C] hover:border-[#5C6B5C] transition-colors",
        className
      )}
    >
      {children}
      <ArrowRight
        className="w-3.5 h-3.5 transition-transform duration-300 group-hover/arrow:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}
