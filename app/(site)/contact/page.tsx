import type { Metadata } from "next";
import PageHero from "@/app/components/section/PageHero";
import ContactForm from "@/app/components/contact/ContactForm";
import ContactInfo from "@/app/components/contact/ContactInfo";
import { parseInquiryType } from "@/lib/routes";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "橘香堂へのお問い合わせフォーム。ご質問、法人契約、イベント利用など、お気軽にお問い合わせください。",
  alternates: { canonical: "/contact" },
};

interface ContactPageProps {
  searchParams: Promise<{ type?: string | string[] }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  // 法人会員・住所登録・イベントなどのページから ?type= 付きで来たら、種別を選んだ状態で開く
  const initialType = parseInquiryType((await searchParams).type);

  return (
    <>
      <PageHero
        title="Contact"
        titleJa="お問い合わせ"
        description="ご質問やご相談など、お気軽にお問い合わせください。"
        breadcrumbs={[{ name: "Contact", href: "/contact" }]}
      />

      {/* Contact Form Section */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <ContactForm key={initialType ?? "none"} initialType={initialType} aside={<ContactInfo />} />
        </div>
      </section>
    </>
  );
}
