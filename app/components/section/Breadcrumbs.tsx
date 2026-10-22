import Link from "next/link";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo";

export interface BreadcrumbItem {
  /** 画面に出すラベル（英語の柱が残っている箇所がある） */
  name: string;
  href: string;
  /** 検索結果のパンくずに出す日本語名。未指定なら name */
  structuredName?: string;
}

interface BreadcrumbsProps {
  /** Home より下の階層。最後の要素が現在のページ */
  items: BreadcrumbItem[];
  className?: string;
}

/** パンくずリスト（検索エンジン向けの構造化データも出す） */
export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const trail: BreadcrumbItem[] = [{ name: "Home", href: "/", structuredName: "トップ" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.structuredName ?? item.name,
      item: absoluteUrl(item.href),
    })),
  };

  return (
    <nav aria-label="パンくずリスト" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.15em] text-[#9A9A9A]">
        {trail.map((item, index) => {
          const isCurrent = index === trail.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {isCurrent ? (
                <span aria-current="page" className="text-[#6B6B6B]">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-[#2C2C2C] transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={jsonLd} />
    </nav>
  );
}
