import { cn } from "@/lib/utils";

interface BulletListProps {
  items: string[];
  className?: string;
}

/** 「•」付きの注記リスト。行頭記号は1行目のベースラインに揃える */
export function BulletList({ items, className }: BulletListProps) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-baseline gap-3 text-sm text-[#6B6B6B]">
          <span className="text-[#5C6B5C]" aria-hidden="true">
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
