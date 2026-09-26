"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, RotateCw } from "lucide-react";
import { reserveData } from "@/app/data/site";
import { useAdminDashboard } from "@/app/hooks/use-admin-dashboard";
import { ADMIN_VIEWS, filterReservations, type AdminView } from "@/lib/admin-reservations";
import { cn } from "@/lib/utils";
import AdminReservationList from "./AdminReservationList";
import ReservationDetailDialog from "./ReservationDetailDialog";
import ReservationFormDialog from "./ReservationFormDialog";
import { adminButton, adminInput } from "./ui";

/** Cloudflare Access のログアウト */
const ACCESS_LOGOUT_PATH = "/cdn-cgi/access/logout";

type FormTarget = { mode: "create" } | { mode: "edit"; id: string };

/** 予約管理ダッシュボード（データはすべてサーバーアクション経由。ページ自体は静的） */
export default function AdminDashboard() {
  const [view, setView] = useState<AdminView>("upcoming");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formTarget, setFormTarget] = useState<FormTarget | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { data, loading, reload } = useAdminDashboard(view);

  const reservations = useMemo(
    () => (data?.ok ? filterReservations(data.reservations, { query, type }) : []),
    [data, query, type],
  );

  if (!data) {
    return <p className="py-24 text-center text-sm text-[#8A8A8A]">読み込み中...</p>;
  }

  if (!data.ok) {
    const message =
      data.reason === "not_configured"
        ? "管理画面の認証設定（CF_ACCESS_TEAM_DOMAIN・CF_ACCESS_AUD・ADMIN_EMAILS）が完了していません。"
        : data.reason === "unauthorized"
          ? "このページを見る権限がありません。許可されたメールアドレスでログインし直してください。"
          : "予約の読み込みに失敗しました。";
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-6">
        <p className="text-sm text-[#6B6B6B]">{message}</p>
        <div className="flex justify-center gap-3">
          {data.reason === "error" && (
            <button type="button" onClick={reload} className={adminButton.secondary}>
              再読み込み
            </button>
          )}
          {data.reason === "unauthorized" && (
            <a href={ACCESS_LOGOUT_PATH} className={adminButton.secondary}>
              ログインし直す
            </a>
          )}
        </div>
      </div>
    );
  }

  const selected = data.reservations.find((r) => r.id === selectedId) ?? null;
  const editing =
    formTarget?.mode === "edit" ? (data.reservations.find((r) => r.id === formTarget.id) ?? null) : null;

  const handleDone = (message: string) => {
    setSelectedId(null);
    setFormTarget(null);
    setNotice(message);
    reload();
  };

  const summaryCards: { label: string; value: number; view: AdminView }[] = [
    { label: "今日", value: data.summary.today, view: "upcoming" },
    { label: "今後7日間", value: data.summary.next7Days, view: "upcoming" },
    { label: "確認待ち", value: data.summary.pending, view: "pending" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl tracking-[0.08em]">予約管理</h1>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            {data.adminEmail} ・{" "}
            <Link href="/" className="underline underline-offset-2">
              サイトを見る
            </Link>{" "}
            ・{" "}
            <a href={ACCESS_LOGOUT_PATH} className="underline underline-offset-2">
              ログアウト
            </a>
          </p>
        </div>
        <button type="button" onClick={() => setFormTarget({ mode: "create" })} className={adminButton.primary}>
          <Plus className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
          予約を登録
        </button>
      </header>

      {notice && (
        <div role="status" className="flex items-start justify-between gap-4 p-4 text-sm bg-[#EEF2EE] border border-[#C9D3C9]">
          <p>{notice}</p>
          <button type="button" onClick={() => setNotice(null)} className="text-[#6B6B6B] underline underline-offset-2">
            閉じる
          </button>
        </div>
      )}

      <ul className="grid grid-cols-3 gap-3">
        {summaryCards.map((card) => (
          <li key={card.label}>
            <button
              type="button"
              onClick={() => setView(card.view)}
              className={cn(
                "w-full p-4 text-left bg-white border border-[#E5E4DF] hover:border-[#2C2C2C] transition-colors",
                card.label === "確認待ち" && card.value > 0 && "border-[#E8D9B5] bg-[#FBF5E8]",
              )}
            >
              <span className="block text-xs text-[#6B6B6B]">{card.label}</span>
              <span className="block mt-1 text-2xl tabular-nums">
                {card.value}
                <span className="ml-1 text-xs text-[#8A8A8A]">件</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="space-y-4">
        <div role="tablist" aria-label="表示する予約" className="flex flex-wrap gap-1 border-b border-[#E5E4DF]">
          {ADMIN_VIEWS.map((v) => (
            <button
              key={v.value}
              type="button"
              role="tab"
              aria-selected={view === v.value}
              onClick={() => setView(v.value)}
              className={cn(
                "px-4 py-2 -mb-px text-sm border-b-2 transition-colors",
                view === v.value
                  ? "border-[#2C2C2C] text-[#2C2C2C]"
                  : "border-transparent text-[#8A8A8A] hover:text-[#2C2C2C]",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="お名前・メール・電話番号で検索"
            aria-label="予約を検索"
            className={cn(adminInput, "flex-1 min-w-[12rem]")}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="利用種別で絞り込む"
            className={cn(adminInput, "w-auto")}
          >
            <option value="">すべての種別</option>
            {reserveData.types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            aria-label="最新の状態に更新"
            className="p-2 text-[#6B6B6B] hover:text-[#2C2C2C] disabled:opacity-40"
          >
            <RotateCw className={cn("w-4 h-4", loading && "animate-spin")} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className={cn(loading && "opacity-60 transition-opacity")}>
        <AdminReservationList reservations={reservations} onSelect={setSelectedId} />
      </div>

      {selected && (
        <ReservationDetailDialog
          key={selected.id}
          reservation={selected}
          onClose={() => setSelectedId(null)}
          onEdit={() => {
            setSelectedId(null);
            setFormTarget({ mode: "edit", id: selected.id });
          }}
          onDone={handleDone}
          onRefresh={reload}
        />
      )}

      {formTarget && (formTarget.mode === "create" || editing) && (
        <ReservationFormDialog
          key={formTarget.mode === "edit" ? formTarget.id : "create"}
          reservation={editing ?? undefined}
          onClose={() => setFormTarget(null)}
          onDone={handleDone}
        />
      )}
    </div>
  );
}
