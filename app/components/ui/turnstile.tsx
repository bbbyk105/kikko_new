"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile-site-key";

type TurnstileApi = {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptLoading: Promise<void> | null = null;

/** Turnstile のスクリプトは、ボット対策が必要なフォームを開いたときに一度だけ読む */
function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptLoading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoading = null;
      reject(new Error("Turnstile の読み込みに失敗しました"));
    };
    document.head.appendChild(script);
  });
  return scriptLoading;
}

/**
 * ボット対策のトークン。トークンは1回の送信でしか使えないので、送信のたびに reset() で取り直す。
 * ready はサイトキー未設定（ボット対策なし）なら常に true。
 */
export function useTurnstile() {
  const [token, setToken] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const reset = useCallback(() => {
    setToken(null);
    setFailed(false);
    setResetKey((key) => key + 1);
  }, []);

  return {
    token,
    ready: !TURNSTILE_SITE_KEY || Boolean(token),
    failed,
    reset,
    widgetProps: { resetKey, onToken: setToken, onFail: () => setFailed(true) },
  };
}

interface TurnstileProps {
  /** フォームの種類（サーバー側の検証と合わせる） */
  action: "reserve" | "contact" | "login";
  resetKey: number;
  onToken: (token: string | null) => void;
  onFail: () => void;
}

/** Cloudflare Turnstile のウィジェット。普段は見えず、怪しいときだけ確認のチェックが出る */
export function Turnstile({ action, resetKey, onToken, onFail }: TurnstileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const handlers = useRef({ onToken, onFail });

  useEffect(() => {
    handlers.current = { onToken, onFail };
  }, [onToken, onFail]);

  useEffect(() => {
    const element = ref.current;
    if (!TURNSTILE_SITE_KEY || !element) return;
    let widgetId: string | undefined;
    let cancelled = false;

    loadTurnstile()
      .then(() => {
        if (cancelled || !window.turnstile) return;
        widgetId = window.turnstile.render(element, {
          sitekey: TURNSTILE_SITE_KEY,
          action,
          appearance: "interaction-only",
          // サイトは白基調なので、閲覧側のダークモード設定に関係なく明るい表示にする
          theme: "light",
          language: "ja",
          callback: (token: string) => handlers.current.onToken(token),
          "expired-callback": () => handlers.current.onToken(null),
          "error-callback": () => {
            handlers.current.onToken(null);
            handlers.current.onFail();
          },
        });
      })
      .catch(() => handlers.current.onFail());

    return () => {
      cancelled = true;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [action, resetKey]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={ref} />;
}

/** セキュリティ確認を読み込めなかったときの案内 */
export function TurnstileFailedNotice() {
  return (
    <p role="alert" className="text-sm text-[#B85C5C]">
      セキュリティ確認を読み込めませんでした。ページを再読み込みしてから、もう一度お試しください。
    </p>
  );
}
