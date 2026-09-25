import { siteConfig } from "@/app/data/site";

/** 予約フォーム（入力ステップ）左側の営業時間・電話番号（Server Component） */
export default function ReserveContactInfo() {
  return (
    <dl className="space-y-4 text-sm">
      <div>
        <dt className="text-[#6B6B6B] mb-1">営業時間</dt>
        <dd className="text-[#2C2C2C]">
          {siteConfig.hours.days} {siteConfig.hours.regular}
        </dd>
      </div>
      <div>
        <dt className="text-[#6B6B6B] mb-1">電話でのお問い合わせ</dt>
        <dd className="text-[#2C2C2C]">
          <a href={`tel:${siteConfig.phone}`} className="hover:text-[#5C6B5C] transition-colors">
            {siteConfig.phone}
          </a>
        </dd>
      </div>
    </dl>
  );
}
