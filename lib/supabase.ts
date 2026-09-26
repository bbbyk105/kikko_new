import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * サーバー専用の Supabase クライアント（service_role / secret key で RLS をバイパス）。
 * reservations には anon 向けポリシーを置いていないため、必ずこれ経由でアクセスする。
 * env 未設定でもビルドが落ちないよう、初回利用時に生成する。
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が未設定です");
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export type Reservation = {
  id: string;
  created_at: string;
  type: string;
  date: string;
  time: string | null;
  people_count: number | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: "pending" | "confirmed" | "cancelled";
  /** 店内メモ（管理画面だけで使う。お客様向けの画面・メールには出さない）。列を追加する前の DB では undefined */
  staff_note?: string | null;
};
