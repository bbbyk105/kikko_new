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
// Worker が応答しないとき、CI の制限時間まで待たずに落とす
const FETCH_TIMEOUT_MS = 30_000;

// 開けるかを見るページ
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

/** html の at 文字目が、React が読み込み後にブラウザで描き直す境界（<!--$!--> と対になる <!--/$--> の間）の中にあるか */
function insideRedraw(html, at) {
  // 開いている境界ごとに、描き直す境界（$!）かどうか
  const boundaries = [];
  for (const m of html.matchAll(/<!--(\$[!?]?|\/\$)-->/g)) {
    if (m.index > at) break;
    if (m[1] === "/$") boundaries.pop();
    else boundaries.push(m[1] === "$!");
  }
  return boundaries.includes(true);
}

/** ページを開き、状態の番号・作り置きから返したか・本文・その間に Worker が出したログを返す */
async function open(path) {
  const from = serverLog.length;
  const res = await fetch(`${ORIGIN}${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  const body = await res.text();
  return {
    status: res.status,
    cache: res.headers.get("x-opennext-cache"),
    body,
    log: serverLog.slice(from).trim(),
  };
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

// 作り置きのページは Next.js のサーバー処理を通さずに返す（Workers Free の CPU 10ms に収めるため）。
// 予約・お問い合わせも ?type= をブラウザ側で読み、作り置きのままにしている
const CACHED_PAGES = [
  "/",
  "/space",
  "/pricing",
  "/mypage",
  "/reserve",
  "/reserve?type=meeting",
  "/contact",
  "/contact?type=corporate",
];

for (const path of CACHED_PAGES) {
  test(`${path} は作り置きから返す`, async () => {
    const { cache } = await open(path);
    assert.equal(cache, "HIT", `${path}: x-opennext-cache=${cache}`);
  });
}

// フォームは作り置きの HTML のまま使う。ブラウザで描き直す境界（<!--$!-->）の中に入ると、
// 読み込みが終わったときに描き直され、その前に入力した文字が消える。
// /mypage はログインの状態をブラウザで読むので、この境界があってよい
const FORM_PAGES = [
  { path: "/contact", form: "<form" },
  { path: "/reserve", form: "次へ進む" },
];

for (const { path, form } of FORM_PAGES) {
  test(`${path} のフォームは読み込み後に描き直さない`, async () => {
    const { body } = await open(path);
    const at = body.indexOf(form);
    // フォームが HTML に無いせいで通ってしまわないように
    assert.ok(at >= 0, `${path}: フォームが HTML に無い`);
    assert.ok(!insideRedraw(body, at), `${path}: フォームがブラウザで描き直す境界の中にある`);
  });
}

test("無いページは 404", async () => {
  const { status, log } = await open("/this-page-does-not-exist");
  assert.equal(status, 404, `${status}\n${log}`);
});
