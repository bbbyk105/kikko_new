import { siteConfig, primaryActions } from "@/app/data/site";
import { ArrowLink } from "@/app/components/ui/arrow-link";

/** お問い合わせページ左側の案内と連絡先（Server Component） */
export default function ContactInfo() {
  return (
    <div>
      <h2 className="font-[var(--font-cormorant)] text-2xl lg:text-3xl text-[#2C2C2C] mb-6">
        ご質問・ご相談
      </h2>
      <p className="text-[#6B6B6B] leading-relaxed mb-12">
        会員登録、法人契約、イベント利用など、
        <br className="hidden lg:block" />
        お気軽にお問い合わせください。
        <br />
        担当者より折り返しご連絡いたします。
      </p>

      {/* Contact Info */}
      <div className="space-y-6 pt-8 border-t border-[#E5E4DF]">
        <div>
          <p className="text-xs tracking-wider text-[#8A8A8A] mb-2">電話でのお問い合わせ</p>
          <a
            href={`tel:${siteConfig.phone}`}
            className="font-[var(--font-cormorant)] text-2xl text-[#2C2C2C] hover:text-[#5C6B5C] transition-colors"
          >
            {siteConfig.phone}
          </a>
          <p className="text-sm text-[#8A8A8A] mt-1">
            {siteConfig.hours.days} {siteConfig.hours.regular}
          </p>
        </div>
        <div>
          <p className="text-xs tracking-wider text-[#8A8A8A] mb-2">所在地</p>
          <p className="text-[#2C2C2C]">
            {siteConfig.address.postal}
            <br />
            {siteConfig.address.full}
          </p>
        </div>
      </div>

      {/* 予約したい方をフォームへ案内する */}
      <div className="mt-12 p-8 bg-[#F7F6F3]">
        <p className="text-xs tracking-wider text-[#8A8A8A] mb-3">ご予約をご希望の方</p>
        <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">
          ビジター利用・会議室・貸切のご予約は、空き状況を見ながら予約フォームからお申し込みいただけます。
        </p>
        <ArrowLink href={primaryActions.reserve.href}>予約フォームへ</ArrowLink>
      </div>
    </div>
  );
}
