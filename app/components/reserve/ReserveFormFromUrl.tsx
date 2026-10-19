"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { parseReserveType } from "@/lib/routes";
import ReserveForm from "./ReserveForm";

/**
 * 料金プランやスペース詳細から ?type=meeting などで来たら、その種別を選んだ状態でフォームを開く。
 * ?type= はブラウザ側で読む。ページを静的なままにし、Workers の CPU を使わないため。
 */
export default function ReserveFormFromUrl({ contactInfo }: { contactInfo: ReactNode }) {
  const initialType = parseReserveType(useSearchParams().get("type") ?? undefined);

  // 同じページ内で種別付きリンクを押したときも、選び直した状態から始める
  return <ReserveForm key={initialType ?? "none"} initialType={initialType} contactInfo={contactInfo} />;
}
