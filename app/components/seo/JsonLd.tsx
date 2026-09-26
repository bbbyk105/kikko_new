/** 構造化データ（JSON-LD）。metadata では <meta> になり認識されないので、本文中に script で出す */
export function JsonLd({ data }: { data: object }) {
  // 文字列中の「</script>」で script が閉じないよう < をエスケープする
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
