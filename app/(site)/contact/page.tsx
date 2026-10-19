import type { Metadata } from "next";
import PageHero from "@/app/components/section/PageHero";
import ContactFormFromUrl from "@/app/components/contact/ContactFormFromUrl";
import ContactInfo from "@/app/components/contact/ContactInfo";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "橘香堂へのお問い合わせフォーム。ご質問、法人契約、イベント利用など、お気軽にお問い合わせください。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
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
          <ContactFormFromUrl aside={<ContactInfo />} />
        </div>
      </section>
    </>
  );
}
