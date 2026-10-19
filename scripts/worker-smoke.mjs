/* ------------------------------------------------------------------
   ビルドした Worker を手元で立ち上げ、主なページが開けるかを見る。

   2026-10-16、Next.js だけを 16.4.1 に上げた版を出したところ、OpenNext（1.17.1）が
   Next.js 16.4 の読むファイル（server/preview-props.json）を知らず、トップ・予約・
   お問い合わせ・404 が 500（error code: 1101）になった。`next build` も jest も通り、
   ビルドした Worker を動かすまで分からなかった。依存を上げたら、公開の前にこれを流す。

   使い方: npm run test:worker（opennextjs-cloudflare build のあとに流す）
   ------------------------------------------------------------------ */

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { after, before, test } from "node:test";

const PORT = Number(process.env.SMOKE_PORT ?? 8799);
const ORIGIN = `http://127.0.0.1:${PORT}`;
const READY_TIMEOUT_MS = 120_000;

// 作り置きのページ（トップ・スペースなど）と、リクエストごとに描くページ（予約・お問い合わせ）の両方
const PAGES = [
  "/",
  "/space",
  "/pricing",
  "/about",
  "/access",
  "/faq",
  "/privacy",
  "/reserve",
  "/contact",
  "/mypage",
  "/robots.txt",
  "/sitemap.xml",
];

let server;
// Worker（wrangler dev）が出したログ。落ちたときに、そのリクエストの間のログを見せる
let serverLog = "";

/** ページを開き、状態の番号と、その間に Worker が出したログを返す */
async function open(path) {
  const from = serverLog.length;
  const res = await fetch(`${ORIGIN}${path}`, { redirect: "manual" });
  await res.arrayBuffer();
  return { status: res.status, log: serverLog.slice(from).trim() };
}

before(async () => {
  server = spawn(
    "npx",
    ["opennextjs-cloudflare", "preview", "--port", String(PORT), "--ip", "127.0.0.1"],
    { detached: true, stdio: ["ignore", "pipe", "pipe"] },
  );
  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Worker が起動しませんでした:\n${serverLog}`)),
      READY_TIMEOUT_MS,
    );
    // 起動したあとも読み続ける（読まないとパイプが詰まって Worker が止まる）
    const onData = (chunk) => {
      serverLog += chunk;
      if (/Ready on http/.test(serverLog)) {
        clearTimeout(timer);
        resolve();
      }
    };
    server.stdout.on("data", onData);
    server.stderr.on("data", onData);
    server.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Worker が途中で止まりました（${code}）:\n${serverLog}`));
    });
  });
});

after(() => {
  // npx → opennextjs-cloudflare → wrangler → workerd をまとめて止める（起動に失敗して、もう止まっていることもある）
  if (server?.pid && server.exitCode === null && server.signalCode === null) {
    process.kill(-server.pid, "SIGTERM");
  }
});

for (const path of PAGES) {
  test(`${path} が開ける`, async () => {
    const { status, log } = await open(path);
    assert.equal(status, 200, `${path}: ${status}\n${log}`);
  });
}

test("無いページは 404", async () => {
  const { status, log } = await open("/this-page-does-not-exist");
  assert.equal(status, 404, `${status}\n${log}`);
});
