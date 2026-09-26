"use client";

import { useState, type FormEvent } from "react";
import { saveReservation, type AdminSaveResult } from "@/app/actions/admin-reservations";
import { reserveData } from "@/app/data/site";
import { todayJst, type AdminReservation, type AdminReservationInput } from "@/lib/admin-reservations";
import { normalizeReservationTime, parseTimeRange } from "@/lib/reservation-time";
import AdminDialog from "./AdminDialog";
import { adminButton, adminInput } from "./ui";

interface ReservationFormDialogProps {
  /** 変更するときの元の予約（なければ新規登録） */
  reservation?: AdminReservation;
  onClose: () => void;
  onDone: (message: string) => void;
}

type FormState = {
  type: string;
  date: string;
  /** 会議室以外の時刻（空なら指定なし） */
  time: string;
  start: string;
  end: string;
  peopleCount: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "confirmed" | "pending";
};

function initialState(r?: AdminReservation): FormState {
  const range = parseTimeRange(r?.time);
  return {
    type: r?.type ?? "meeting",
    date: r?.date ?? todayJst(),
    time: range ? "" : (normalizeReservationTime(r?.time ?? null) ?? ""),
    start: range?.start ?? "10:00",
    end: range?.end ?? "11:00",
    peopleCount: r?.peopleCount ? String(r.peopleCount) : "",
    name: r?.name ?? "",
    email: r?.email ?? "",
    phone: r?.phone ?? "",
    message: r?.message ?? "",
    // 電話で受けた予約はその場で確定することが多いので、新規は「確定」を初期値にする
    status: r?.status === "pending" ? "pending" : "confirmed",
  };
}

function toInput(form: FormState): AdminReservationInput {
  const time =
    form.type === "private" ? null : form.type === "meeting" ? `${form.start}-${form.end}` : form.time || null;
  return {
    type: form.type as AdminReservationInput["type"],
    date: form.date,
    time,
    peopleCount: form.peopleCount ? Number.parseInt(form.peopleCount, 10) || null : null,
    name: form.name,
    email: form.email,
    phone: form.phone,
    message: form.message,
    status: form.status,
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block mb-1 text-xs text-[#6B6B6B]">{label}</span>
      {children}
    </label>
  );
}

/** 電話予約などの登録と、日時・内容の変更 */
export default function ReservationFormDialog({ reservation, onClose, onDone }: ReservationFormDialogProps) {
  const isEdit = Boolean(reservation);
  const [form, setForm] = useState(() => initialState(reservation));
  // 実際に送るのはメールアドレスが入っているときだけ（notify && hasEmail）
  const [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<string[] | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setConflicts(null);
  };
  const hasEmail = Boolean(form.email.trim());

  const save = async (force: boolean) => {
    setBusy(true);
    setError(null);
    let result: AdminSaveResult;
    try {
      result = await saveReservation(toInput(form), {
        id: reservation?.id,
        notify: notify && hasEmail,
        force,
      });
    } catch {
      result = { ok: false, reason: "error", error: "保存に失敗しました。もう一度お試しください。" };
    }
    setBusy(false);

    if (result.ok) {
      const sent = result.notified ? "（お客様にメールを送りました）" : "";
      const overlap =
        "conflictsAfterSave" in result
          ? `。ただし、同時に入った予約と重なっています: ${result.conflictsAfterSave.join("、")}${
              notify && hasEmail ? "（重なっているため、お客様へのメールは送っていません）" : ""
            }`
          : "";
      onDone(`${result.reservation.name} 様の予約を${isEdit ? "変更" : "登録"}しました${sent}${overlap}`);
    } else if (result.reason === "conflict") {
      setConflicts(result.conflicts.map((c) => c.label));
    } else {
      setError("error" in result ? result.error : "権限がありません。ページを読み込み直してください。");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 電話予約のために空欄は許しているが、登録済みのメールアドレスを消すとお知らせが送れなくなるので確かめる
    if (
      reservation?.email &&
      !form.email.trim() &&
      !window.confirm("メールアドレスを消すと、今後お客様にメールでお知らせできなくなります。保存しますか？")
    ) {
      return;
    }
    void save(false);
  };

  const endOptions = reserveData.meetingEndHourOptions.filter((end) => end > form.start);

  return (
    <AdminDialog title={isEdit ? "予約内容の変更" : "予約の登録（電話予約など）"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <Field label="利用種別">
            <select value={form.type} onChange={(e) => set("type", e.target.value)} className={adminInput}>
              {reserveData.types.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="利用日">
            <input type="date" required value={form.date} onChange={(e) => set("date", e.target.value)} className={adminInput} />
          </Field>
        </div>

        {form.type === "private" ? (
          <p className="text-sm text-[#6B6B6B]">終日貸切（9:00〜18:00）</p>
        ) : form.type === "meeting" ? (
          <div className="grid grid-cols-2 gap-4">
            <Field label="開始">
              <select
                value={form.start}
                onChange={(e) => {
                  const start = e.target.value;
                  set("start", start);
                  if (form.end <= start) set("end", reserveData.meetingEndHourOptions.find((end) => end > start) ?? form.end);
                }}
                className={adminInput}
              >
                {reserveData.timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="終了">
              <select value={form.end} onChange={(e) => set("end", e.target.value)} className={adminInput}>
                {endOptions.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        ) : (
          <Field label="時間">
            <select value={form.time} onChange={(e) => set("time", e.target.value)} className={adminInput}>
              <option value="">指定なし</option>
              {reserveData.timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </Field>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field label="お名前（必須）">
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={adminInput} />
          </Field>
          <Field label="人数">
            <input
              type="number"
              min={1}
              inputMode="numeric"
              value={form.peopleCount}
              onChange={(e) => set("peopleCount", e.target.value)}
              className={adminInput}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="電話番号">
            <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={adminInput} />
          </Field>
          <Field label="メールアドレス">
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={adminInput} />
          </Field>
        </div>
        <Field label="メモ・ご要望">
          <textarea
            rows={3}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            className={`${adminInput} resize-none`}
          />
        </Field>

        {!isEdit && (
          <Field label="ステータス">
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value as FormState["status"])}
              className={adminInput}
            >
              <option value="confirmed">予約確定</option>
              <option value="pending">確認中</option>
            </select>
          </Field>
        )}

        <label className={`flex items-center gap-2 text-sm ${hasEmail ? "" : "text-[#9A9A9A]"}`}>
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

        {conflicts && (
          <div role="alert" className="p-4 text-sm bg-[#FBF5E8] border border-[#E8D9B5] space-y-3">
            <p className="font-medium text-[#8A6A2F]">同じ日の予約と重なっています</p>
            <ul className="list-disc pl-5 text-[#6B6B6B]">
              {conflicts.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
            <button type="button" onClick={() => save(true)} disabled={busy} className={adminButton.secondary}>
              重なりを承知で保存する
            </button>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} disabled={busy} className={adminButton.secondary}>
            やめる
          </button>
          <button type="submit" disabled={busy || !form.name.trim() || !form.date} className={adminButton.primary}>
            {busy ? "保存中..." : isEdit ? "変更を保存する" : "登録する"}
          </button>
        </div>
      </form>
    </AdminDialog>
  );
}
