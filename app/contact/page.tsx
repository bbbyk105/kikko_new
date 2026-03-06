import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PageHero from "@/app/components/section/PageHero";
import ContactForm from "@/app/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ | 橘香堂 (worx mt.fuji)",
  description:
    "橘香堂へのお問い合わせフォーム。ご質問、法人契約、イベント利用など、お気軽にお問い合わせください。",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Contact"
          titleJa="お問い合わせ"
          description="ご質問やご相談など、お気軽にお問い合わせください。"
        />

        {/* Contact Form Section */}
        <section className="py-16 lg:py-24 bg-[#FAFAF8]">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
