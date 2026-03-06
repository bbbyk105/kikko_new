import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PageHero from "@/app/components/section/PageHero";
import BottomCTA from "@/app/components/section/BottomCTA";
import SpaceTypes from "@/app/components/space/SpaceTypes";
import SpaceGallery from "@/app/components/space/SpaceGallery";
import SpaceSpecs from "@/app/components/space/SpaceSpecs";
import { spacePageData, spaceCategories, images } from "@/app/data/site";

export const metadata: Metadata = {
  title: "空間と利用シーン | 橘香堂 (worx mt.fuji)",
  description:
    "橘香堂の空間紹介。コワーキング、会議、セミナー、イベントなど多様な用途に対応する静かで上質なワークスペース。",
};

export default function SpacePage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          title={spacePageData.intro.title}
          titleJa={spacePageData.intro.titleJa}
          description={spacePageData.intro.description}
        />

        {/* Hero Visual */}
        <section className="pb-20 lg:pb-28">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="relative aspect-[16/7] overflow-hidden">
              {/* 差し替え箇所: /public/images/space-hero.jpg に実際の写真を配置 */}
              <Image
                src={images.spaceHero}
                alt="橘香堂の開放的なワークスペース"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-[#2C2C2C]/10" />
            </div>
          </div>
        </section>

        {/* Space Types */}
        <SpaceTypes categories={spaceCategories} />

        {/* Gallery */}
        <SpaceGallery images={spacePageData.gallery} />

        {/* Specs & Use Cases */}
        <SpaceSpecs specs={spacePageData.specs} useCases={spacePageData.useCases} />

        {/* Bottom CTA */}
        <BottomCTA
          title="まずは、空間を実際にご覧ください。"
          description="見学は随時受け付けております。お気軽にお問い合わせください。"
          primaryButton={{ text: "ご予約", href: "/reserve" }}
        />
      </main>
      <Footer />
    </>
  );
}
