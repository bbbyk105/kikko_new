"use client";

import { Suspense, useState, type ReactNode } from "react";
import { SearchParamReader } from "@/app/components/ui/search-param-reader";
import { parseReserveType } from "@/lib/routes";
import ReserveForm from "./ReserveForm";

/**
 * 料金プランやスペース詳細から ?type=meeting などで来たら、その種別を選んだ状態でフォームを開く。
 * ?type= はブラウザ側で読む。ページを静的なままにし、Workers の CPU を使わないため。
 */
export default function ReserveFormFromUrl({ contactInfo }: { contactInfo: ReactNode }) {
  const [type, setType] = useState<string>();
  const initialType = parseReserveType(type);

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamReader name="type" onChange={setType} />
      </Suspense>
      {/* 同じページ内で種別付きリンクを押したときも、選び直した状態から始める */}
      <ReserveForm key={initialType ?? "none"} initialType={initialType} contactInfo={contactInfo} />
    </>
  );
}
