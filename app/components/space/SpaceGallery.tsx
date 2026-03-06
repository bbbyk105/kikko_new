import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
  size: "large" | "small" | "tall" | "wide";
}

interface SpaceGalleryProps {
  images: GalleryImage[];
}

export default function SpaceGallery({ images }: SpaceGalleryProps) {
  return (
    <section className="py-20 lg:py-28 bg-[#F7F6F3]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-4">
            GALLERY
          </p>
          <h2 className="font-[var(--font-cormorant)] text-3xl md:text-4xl leading-tight tracking-wide text-[#2C2C2C]">
            空間のディテール
          </h2>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {images.map((image, index) => {
            const gridClasses = {
              large: "col-span-2 row-span-2",
              small: "col-span-1 row-span-1",
              tall: "col-span-1 row-span-2",
              wide: "col-span-2 row-span-1",
            };

            return (
              <div
                key={index}
                className={`relative overflow-hidden ${gridClasses[image.size]}`}
              >
                <div
                  className={`relative w-full ${
                    image.size === "tall"
                      ? "aspect-[3/4]"
                      : image.size === "large"
                      ? "aspect-square"
                      : image.size === "wide"
                      ? "aspect-[2/1]"
                      : "aspect-square"
                  }`}
                >
                  {/* 差し替え箇所: 実際の施設写真に差し替えてください */}
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
