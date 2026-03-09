import { siteConfig, accessInfo } from "@/app/data/site";
import { Eyebrow, SectionHeading } from "@/app/components/ui/typography";

export default function Access() {
  return (
    <section
      id="access"
      className="py-36 lg:py-48 bg-[#F7F6F3]"
      aria-labelledby="access-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">
          {/* Info */}
          <div>
            <Eyebrow>Access</Eyebrow>
            <SectionHeading id="access-heading" size="large" className="mb-14">
              アクセス情報
            </SectionHeading>

            {/* Details */}
            <dl className="space-y-9">
              {/* Address */}
              <div className="flex gap-8">
                <dt className="w-24 flex-shrink-0 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A]">
                  所在地
                </dt>
                <dd className="text-[#2C2C2C]">
                  <p className="text-[12px] tracking-[0.05em] text-[#9A9A9A] mb-1.5">
                    {siteConfig.address.postal}
                  </p>
                  <p className="text-[14px] leading-[1.8] tracking-[0.02em]">{siteConfig.address.full}</p>
                </dd>
              </div>

              {/* Hours */}
              <div className="flex gap-8">
                <dt className="w-24 flex-shrink-0 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A]">
                  営業時間
                </dt>
                <dd className="text-[#2C2C2C]">
                  <p className="text-[14px] leading-[1.8] tracking-[0.02em]">
                    {siteConfig.hours.days} {siteConfig.hours.regular}
                  </p>
                  <p className="text-[12px] tracking-[0.03em] text-[#9A9A9A] mt-2">
                    最終入館 {siteConfig.hours.lastEntry}
                  </p>
                  <p className="text-[12px] tracking-[0.03em] text-[#9A9A9A]">
                    会員は事前予約で{siteConfig.hours.extended}まで延長可能
                  </p>
                </dd>
              </div>

              {/* Phone */}
              <div className="flex gap-8">
                <dt className="w-24 flex-shrink-0 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A]">
                  電話番号
                </dt>
                <dd className="text-[#2C2C2C]">
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="text-[14px] tracking-[0.02em] hover:text-[#5C6B5C] transition-colors"
                  >
                    {siteConfig.phone}
                  </a>
                </dd>
              </div>

              {/* Access */}
              <div className="flex gap-8">
                <dt className="w-24 flex-shrink-0 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A]">
                  交通
                </dt>
                <dd className="text-[#2C2C2C] space-y-1.5">
                  <p className="text-[14px] leading-[1.8] tracking-[0.02em]">{accessInfo.station}</p>
                  <p className="text-[14px] leading-[1.8] tracking-[0.02em]">{accessInfo.bus}</p>
                </dd>
              </div>

              {/* Parking */}
              <div className="flex gap-8">
                <dt className="w-24 flex-shrink-0 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A]">
                  駐車場
                </dt>
                <dd className="text-[#2C2C2C]">
                  <p className="text-[14px] leading-[1.8] tracking-[0.02em]">{accessInfo.parking}</p>
                </dd>
              </div>
            </dl>
          </div>

          {/* Map */}
          <div className="relative">
            <div className="relative aspect-square lg:aspect-auto lg:h-full min-h-[400px] overflow-hidden">
              <iframe
                src={siteConfig.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="橘香堂の所在地"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
