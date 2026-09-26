import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/app/components/section/PageHero";
import MyPage from "@/app/components/mypage/MyPage";
import ManageLoading from "@/app/components/reserve/manage/ManageLoading";
import { BulletList } from "@/app/components/ui/bullet-list";
import { primaryActions, reserveData, siteConfig } from "@/app/data/site";

export const metadata: Metadata = {
  title: "マイページ",
  description: "ご予約時のメールアドレスでログインすると、ご予約の確認とキャンセルができます。",
  robots: { index: false, follow: true },
};

export default function MyPagePage() {
  return (
    <>
      <PageHero
        title="My Page"
        titleJa="マイページ"
        description="ご予約時のメールアドレスでログインすると、ご予約の確認とキャンセルができます。"
        breadcrumbs={[{ name: "My Page", href: primaryActions.mypage.href }]}
      />

      <section className="py-12 lg:py-16 bg-[#F7F6F3]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* ログイン状態・?login= はブラウザ側で確かめる。ページを静的なままにし、Workers の CPU を使わないため */}
            <Suspense fallback={<ManageLoading />}>
              <MyPage />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-sm tracking-wider text-[#6B6B6B] mb-6 text-center">
              キャンセル・変更について
            </h2>
            <BulletList items={reserveData.manageNotes} />
            <p className="mt-12 pt-10 border-t border-[#E5E4DF] text-center text-sm text-[#6B6B6B]">
              お電話でのお問い合わせ{" "}
              <a
                href={`tel:${siteConfig.phone}`}
                className="text-[#2C2C2C] hover:text-[#5C6B5C] transition-colors"
              >
                {siteConfig.phone}
              </a>
              （{siteConfig.hours.regular}）
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
