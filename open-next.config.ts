import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// ISR（revalidate）は使っていないので、ビルド時に作ったページを静的アセットから返す読み取り専用キャッシュにする。
// 未設定だと事前生成ページもリクエストごとに描画し直し、Workers の CPU 上限（Error 1102）を超える。
// キャッシュは `opennextjs-cloudflare deploy` の実行時に投入される（`wrangler deploy` 単体では入らない）。
export default defineCloudflareConfig({
	incrementalCache: staticAssetsIncrementalCache,
	// キャッシュにあるページは Next.js のサーバー処理を通さずに返す（PPR 不使用なので有効化できる）
	enableCacheInterception: true,
});
