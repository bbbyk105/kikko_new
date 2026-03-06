import { siteConfig, accessInfo } from "@/app/data/site";

export default function Access() {
  return (
    <section
      id="access"
      className="py-32 lg:py-40 bg-[#F7F6F3]"
      aria-labelledby="access-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Info */}
          <div>
            <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-6">
              ACCESS
            </p>
            <h2
              id="access-heading"
              className="font-[var(--font-cormorant)] text-3xl md:text-4xl lg:text-5xl leading-tight tracking-wide text-[#2C2C2C] mb-12"
            >
              アクセス情報
            </h2>

            {/* Details */}
            <dl className="space-y-8">
              {/* Address */}
              <div className="flex gap-8">
                <dt className="w-24 flex-shrink-0 text-sm text-[#6B6B6B]">
                  所在地
                </dt>
                <dd className="text-[#2C2C2C]">
                  <p className="text-sm text-[#6B6B6B] mb-1">
                    {siteConfig.address.postal}
                  </p>
                  <p>{siteConfig.address.full}</p>
                </dd>
              </div>

              {/* Hours */}
              <div className="flex gap-8">
                <dt className="w-24 flex-shrink-0 text-sm text-[#6B6B6B]">
                  営業時間
                </dt>
                <dd className="text-[#2C2C2C]">
                  <p>
                    {siteConfig.hours.days} {siteConfig.hours.regular}
                  </p>
                  <p className="text-sm text-[#6B6B6B] mt-1">
                    最終入館 {siteConfig.hours.lastEntry}
                  </p>
                  <p className="text-sm text-[#6B6B6B]">
                    会員は事前予約で{siteConfig.hours.extended}まで延長可能
                  </p>
                </dd>
              </div>

              {/* Phone */}
              <div className="flex gap-8">
                <dt className="w-24 flex-shrink-0 text-sm text-[#6B6B6B]">
                  電話番号
                </dt>
                <dd className="text-[#2C2C2C]">
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="hover:text-[#5C6B5C] transition-colors"
                  >
                    {siteConfig.phone}
                  </a>
                </dd>
              </div>

              {/* Access */}
              <div className="flex gap-8">
                <dt className="w-24 flex-shrink-0 text-sm text-[#6B6B6B]">
                  交通
                </dt>
                <dd className="text-[#2C2C2C] space-y-1">
                  <p>{accessInfo.station}</p>
                  <p>{accessInfo.bus}</p>
                </dd>
              </div>

              {/* Parking */}
              <div className="flex gap-8">
                <dt className="w-24 flex-shrink-0 text-sm text-[#6B6B6B]">
                  駐車場
                </dt>
                <dd className="text-[#2C2C2C]">
                  <p>{accessInfo.parking}</p>
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
