import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * エディトリアル・タイポグラフィシステム
 * 
 * ブティックホテル / 建築事務所 / 空間ブランドサイトのような
 * 静かで上質なタイポグラフィを実現するためのコンポーネント群
 * 
 * 設計原則:
 * - 余白と文字の関係性で高級感を出す
 * - 過剰に主張しない、抑制されたタイポグラフィ
 * - 階層を明確にしつつ、全体として調和する
 */

// ============================================
// Eyebrow - 静かな前置き
// ============================================
interface EyebrowProps {
  children: ReactNode;
  theme?: "light" | "dark";
  className?: string;
}

export function Eyebrow({ children, theme = "light", className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "eyebrow-text",
        theme === "dark" ? "text-[#6B6B6B]" : "text-[#9A9A9A]",
        className
      )}
    >
      {children}
    </p>
  );
}

// ============================================
// Display Heading - Hero用の主見出し
// ============================================
interface DisplayHeadingProps {
  children: ReactNode;
  as?: "h1" | "h2";
  id?: string;
  theme?: "light" | "dark";
  className?: string;
}

export function DisplayHeading({
  children,
  as: Tag = "h1",
  id,
  theme = "light",
  className,
}: DisplayHeadingProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "display-heading",
        theme === "dark" ? "text-[#FAFAF8]" : "text-[#2C2C2C]",
        className
      )}
    >
      {children}
    </Tag>
  );
}

// ============================================
// Section Heading - セクション見出し
// ============================================
interface SectionHeadingProps {
  children: ReactNode;
  as?: "h2" | "h3";
  id?: string;
  theme?: "light" | "dark";
  size?: "default" | "large" | "compact";
  className?: string;
}

export function SectionHeading({
  children,
  as: Tag = "h2",
  id,
  theme = "light",
  size = "default",
  className,
}: SectionHeadingProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "section-heading",
        size === "large" && "section-heading-large",
        size === "compact" && "section-heading-compact",
        theme === "dark" ? "text-[#FAFAF8]" : "text-[#2C2C2C]",
        className
      )}
    >
      {children}
    </Tag>
  );
}

// ============================================
// Lead Text - 見出し補足・導入文
// ============================================
interface LeadTextProps {
  children: ReactNode;
  theme?: "light" | "dark";
  maxWidth?: "narrow" | "default" | "wide";
  className?: string;
}

export function LeadText({
  children,
  theme = "light",
  maxWidth = "default",
  className,
}: LeadTextProps) {
  const widthClass = {
    narrow: "max-w-sm",
    default: "max-w-md",
    wide: "max-w-lg",
  }[maxWidth];

  return (
    <p
      className={cn(
        "lead-text",
        widthClass,
        theme === "dark" ? "text-[#A0A0A0]" : "text-[#6B6B6B]",
        className
      )}
    >
      {children}
    </p>
  );
}

// ============================================
// Card Title - カード・アイテムタイトル
// ============================================
interface CardTitleProps {
  children: ReactNode;
  as?: "h3" | "h4";
  theme?: "light" | "dark";
  className?: string;
}

export function CardTitle({
  children,
  as: Tag = "h3",
  theme = "light",
  className,
}: CardTitleProps) {
  return (
    <Tag
      className={cn(
        "card-title",
        theme === "dark" ? "text-[#FAFAF8]" : "text-[#2C2C2C]",
        className
      )}
    >
      {children}
    </Tag>
  );
}

// ============================================
// Section Header Block - 統合コンポーネント
// ============================================
interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  size?: "default" | "large" | "compact";
  titleId?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "light",
  size = "default",
  titleId,
  className,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <header
      className={cn(
        "section-header",
        isCenter && "section-header-center",
        className
      )}
    >
      {eyebrow && (
        <Eyebrow theme={theme}>{eyebrow}</Eyebrow>
      )}

      <SectionHeading
        id={titleId}
        theme={theme}
        size={size}
      >
        {title}
      </SectionHeading>

      {description && (
        <LeadText
          theme={theme}
          maxWidth={isCenter ? "wide" : "default"}
          className={isCenter ? "mx-auto" : ""}
        >
          {description}
        </LeadText>
      )}
    </header>
  );
}

// ============================================
// Hero Header Block - Hero専用統合
// ============================================
interface HeroHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  theme?: "light" | "dark";
  titleId?: string;
  className?: string;
}

export function HeroHeader({
  eyebrow,
  title,
  description,
  theme = "light",
  titleId,
  className,
}: HeroHeaderProps) {
  return (
    <header className={cn("hero-header", className)}>
      {eyebrow && (
        <Eyebrow theme={theme} className="hero-eyebrow">
          {eyebrow}
        </Eyebrow>
      )}

      <DisplayHeading id={titleId} theme={theme}>
        {title}
      </DisplayHeading>

      {description && (
        <LeadText theme={theme} maxWidth="default" className="hero-lead">
          {description}
        </LeadText>
      )}
    </header>
  );
}

// ============================================
// Block Label - Contact/Footer内の小見出し
// ============================================
interface BlockLabelProps {
  children: ReactNode;
  as?: "h3" | "h4" | "p";
  theme?: "light" | "dark";
  className?: string;
}

export function BlockLabel({
  children,
  as: Tag = "p",
  theme = "light",
  className,
}: BlockLabelProps) {
  return (
    <Tag
      className={cn(
        "block-label",
        theme === "dark" ? "text-[#6B6B6B]" : "text-[#9A9A9A]",
        className
      )}
    >
      {children}
    </Tag>
  );
}

// ============================================
// Decorative Number - 装飾的な番号
// ============================================
interface DecorativeNumberProps {
  children: ReactNode;
  theme?: "light" | "dark";
  size?: "default" | "large";
  className?: string;
}

export function DecorativeNumber({
  children,
  theme = "light",
  size = "default",
  className,
}: DecorativeNumberProps) {
  return (
    <span
      className={cn(
        "decorative-number",
        size === "large" && "decorative-number-large",
        theme === "dark" ? "text-[#404040]" : "text-[#E8E7E2]",
        className
      )}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
