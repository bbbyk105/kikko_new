/* ------------------------------------------------------------------
   Worker の入口。OpenNext が作る `.open-next/worker.js` をそのまま包み、
   定期実行（scheduled）だけを足す。
   https://opennext.js.org/cloudflare/howtos/custom-worker

   `.open-next/` はビルド（`npm run deploy` の中の opennextjs-cloudflare build）で
   作られ、git には無い。無いときの型は worker/open-next.d.ts。
   ------------------------------------------------------------------ */

import openNext from "../.open-next/worker.js";

import { pingDatabase, type KeepAliveEnv } from "./keep-alive";

const worker = {
  fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    return openNext.fetch(request, env, ctx);
  },

  /** `wrangler.jsonc` の triggers.crons（一日一回）。Supabase を眠らせない。 */
  async scheduled(_controller: unknown, env: KeepAliveEnv): Promise<void> {
    try {
      const status = await pingDatabase(env);
      console.info(
        status === null
          ? "[keep-alive] NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が無いので何もしない"
          : `[keep-alive] Supabase ${status}`,
      );
    } catch (error) {
      console.error("[keep-alive] Supabase を読めませんでした", error);
      throw error;
    }
  },
};

export default worker;

// OpenNext の Durable Object。今は使っていないが、.open-next/worker.js が export しているものは入口を替えても出し続ける
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "../.open-next/worker.js";
