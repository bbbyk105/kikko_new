/** Turnstile の siteverify の応答（使う項目だけ） */
export type SiteverifyResponse = {
  success?: boolean;
  action?: string;
  "error-codes"?: string[];
};

/** 検証に通ったか。ウィジェットに付けた action（フォームの種類）が違うトークンの流用も弾く */
export function isHumanVerified(response: SiteverifyResponse, expectedAction: string): boolean {
  if (response.success !== true) return false;
  // テスト用の鍵は action を返さない（空）ので、返ってきたときだけ比べる
  return !response.action || response.action === expectedAction;
}
