"use client";

import { Suspense, useState, type ReactNode } from "react";
import { SearchParamReader } from "@/app/components/ui/search-param-reader";
import { parseInquiryType } from "@/lib/routes";
import ContactForm from "./ContactForm";

/**
 * 法人会員・住所登録・イベントなどのページから ?type= 付きで来たら、種別を選んだ状態でフォームを開く。
 * ?type= はブラウザ側で読む。ページを静的なままにし、Workers の CPU を使わないため。
 */
export default function ContactFormFromUrl({ aside }: { aside: ReactNode }) {
  const [type, setType] = useState<string>();
  const initialType = parseInquiryType(type);

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamReader name="type" onChange={setType} />
      </Suspense>
      <ContactForm key={initialType ?? "none"} initialType={initialType} aside={aside} />
    </>
  );
}
