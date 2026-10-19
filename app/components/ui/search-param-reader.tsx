"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

type SearchParamReaderProps = {
  name: string;
  onChange: (value: string | undefined) => void;
};

/**
 * URL のクエリ（?name=）の値を onChange で知らせる。画面には何も出さない。Suspense で包んで使う。
 * useSearchParams を使う部品は、作り置きのページでは包んだ Suspense の中身ごと読み込み後に描き直される
 * （中にフォームがあると、その前に入力した文字が消える）。読むのはこの部品だけにして、フォームは Suspense の外に置く。
 * 同じページの中で ?name= が変わったときも知らせる。
 */
export function SearchParamReader({ name, onChange }: SearchParamReaderProps) {
  const value = useSearchParams().get(name) ?? undefined;

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return null;
}
