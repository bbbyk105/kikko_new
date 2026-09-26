"use client";

import { useState } from "react";
import {
  updateReservationStatus,
  updateStaffNote,
  type AdminMutationResult,
} from "@/app/actions/admin-reservations";
import type { AdminReservation } from "@/lib/admin-reservations";
import { cn } from "@/lib/utils";
import AdminDialog from "./AdminDialog";
import { adminButton, STATUS_BADGE } from "./ui";

interface ReservationDetailDialogProps {
  reservation: AdminReservation;
  onClose: () => void;
  onEdit: () => void;
  /** 確定・キャンセルが終わったとき（一覧の読み直しとお知らせ表示） */
  onDone: (message: string) => void;
  /** 店内メモを保存したとき（ダイアログは開いたまま一覧だけ読み直す） */
  onRefresh: () => void;
}

/** 予約の詳細と、確定・キャンセル・変更の操作 */
export default function ReservationDetailDialog({
  reservation: r,
  onClose,
  onEdit,
  onDone,
  onRefresh,
}: ReservationDetailDialogProps) {
  const hasEmail = Boolean(r.email);
  const [notify, setNotify] = useState(hasEmail);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState(r.staffNote ?? "");
  const [noteState, setNoteState] = useState<{ saving: boolean; message: string | null; error: boolean }>({
    saving: false,
    message: null,
    error: false,
  });
  const noteChanged = note.trim() !== (r.staffNote ?? "").trim();

  const saveNote = async () => {
    setNoteState({ saving: true, message: null, error: false });
    let result: AdminMutationResult;
    try {
      result = await updateStaffNote(r.id, note);
    } catch {
      result = { ok: false, reason: "error", error: "保存に失敗しました。もう一度お試しください。" };
    }
    if (result.ok) {
      setNoteState({ saving: false, message: "メモを保存しました", error: false });
      onRefresh();
    } else {
      const message = "error" in result ? result.error : "権限がありません。ページを読み込み直してください。";
      setNoteState({ saving: false, message, error: true });
    }
  };

  const run = async (status: "confirmed" | "cancelled") => {
    setBusy(true);
    setError(null);
    let result: AdminMutationResult;
    try {
      result = await updateReservationStatus(r.id, status, notify && hasEmail);
    } catch {
      result = { ok: false, reason: "error", error: "処理に失敗しました。もう一度お試しください。" };
    }
    setBusy(false);
    if (result.ok) {
      const action = status === "confirmed" ? "確定しました" : "キャンセルしました";
      onDone(`${r.name} 様の予約を${action}${result.notified ? "（お客様にメールを送りました）" : ""}`);
    } else {
      setError("error" in result ? result.error : "権限がありません。ページを読み込み直してください。");
    }
  };

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "利用日", value: r.dateLabel },
    { label: "時間", value: r.timeLabel },
    { label: "利用種別", value: r.typeLabel },
    ...(r.peopleCount ? [{ label: "人数", value: `${r.peopleCount}名` }] : []),
    { label: "お名前", value: `${r.name} 様` },
    {
      label: "電話番号",
      value: r.phone ? (
        <a href={`tel:${r.phone}`} className="underline underline-offset-2">
          {r.phone}
        </a>
      ) : (
        "—"
      ),
    },
    {
      label: "メール",
      value: r.email ? (
        <a href={`mailto:${r.email}`} className="underline underline-offset-2 break-all">
          {r.email}
        </a>
      ) : (
        "—"
      ),
    },
    { label: "メッセージ", value: r.message || "—" },
    { label: "受付日時", value: r.createdAtLabel },
    { label: "受付番号", value: <span className="break-all text-xs">{r.id}</span> },
  ];

  return (
    <AdminDialog title="予約の詳細" onClose={onClose}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-lg">
          {r.name} 様
        </p>
        <span className={cn("px-2 py-0.5 text-xs border", STATUS_BADGE[r.status])}>{r.statusLabel}</span>
      </div>

      <dl className="border-t border-[#E5E4DF] text-sm">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[6rem_1fr] gap-3 py-2.5 border-b border-[#E5E4DF]">
            <dt className="text-[#8A8A8A]">{row.label}</dt>
            <dd className="whitespace-pre-wrap">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <label htmlFor="staff-note" className="block mb-1 text-sm">
          店内メモ <span className="text-xs text-[#8A8A8A]">（お客様には表示されません）</span>
        </label>
        <textarea
          id="staff-note"
          rows={3}
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setNoteState({ saving: false, message: null, error: false });
          }}
          placeholder="例: プロジェクター使用・駐車場の案内済み"
          className="w-full px-3 py-2 text-sm bg-white border border-[#E5E4DF] focus:outline-none focus:border-[#5C6B5C] resize-none"
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={saveNote}
            disabled={noteState.saving || !noteChanged}
            className={adminButton.secondary}
          >
            {noteState.saving ? "保存中..." : "メモを保存"}
          </button>
          {noteState.message && (
            <p
              role={noteState.error ? "alert" : "status"}
              className={cn("text-sm", noteState.error ? "text-[#B85C5C]" : "text-[#5C6B5C]")}
            >
              {noteState.message}
            </p>
          )}
        </div>
      </div>

      {r.status !== "cancelled" && (
        <div className="mt-6 space-y-4">
          <label className={cn("flex items-center gap-2 text-sm", !hasEmail && "text-[#9A9A9A]")}>
            <input
              type="checkbox"
              checked={notify && hasEmail}
              disabled={!hasEmail}
              onChange={(e) => setNotify(e.target.checked)}
              className="w-4 h-4 accent-[#2C2C2C]"
            />
            お客様にメールで知らせる{!hasEmail && "（メールアドレスなし）"}
          </label>

          {error && (
            <p role="alert" className="p-3 text-sm text-[#B85C5C] bg-[#FDF2F2] border border-[#B85C5C]">
              {error}
            </p>
          )}

          {confirmingCancel ? (
            <div className="p-4 border border-[#B85C5C] space-y-3">
              <p className="text-sm">この予約をキャンセルしますか？（元に戻せません）</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setConfirmingCancel(false)} disabled={busy} className={adminButton.secondary}>
                  戻る
                </button>
                <button type="button" onClick={() => run("cancelled")} disabled={busy} className={adminButton.danger}>
                  {busy ? "処理中..." : "キャンセルする"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {r.status === "pending" && (
                <button type="button" onClick={() => run("confirmed")} disabled={busy} className={adminButton.primary}>
                  {busy ? "処理中..." : "予約を確定する"}
                </button>
              )}
              <button type="button" onClick={onEdit} disabled={busy} className={adminButton.secondary}>
                内容を変更する
              </button>
              <button
                type="button"
                onClick={() => setConfirmingCancel(true)}
                disabled={busy}
                className="px-2 text-sm text-[#B85C5C] underline underline-offset-2 disabled:opacity-40"
              >
                キャンセルする
              </button>
            </div>
          )}
        </div>
      )}
    </AdminDialog>
  );
}
