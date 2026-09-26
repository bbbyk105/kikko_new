"use server";

import { z } from "zod";
import { authenticateAdmin } from "@/lib/admin-auth";
import {
  adminReservationSchema,
  findConflicts,
  summarize,
  toAdminReservation,
  todayJst,
  type AdminReservation,
  type AdminReservationInput,
  type AdminSummary,
  type AdminView,
  type ConflictCandidate,
} from "@/lib/admin-reservations";
import { customerReplyTo, notificationFrom } from "@/lib/email/config";
import { sendResendEmail } from "@/lib/email/resend";
import { storeNoticeMail, type StoreNoticeKind } from "@/lib/email/reservation-mail";
import { reservationTimeLabel, toManagedReservation } from "@/lib/reservation-manage";
import { reserveTypeLabel } from "@/lib/reserve-flow";
import { customerLinksFor } from "@/lib/reservation-service";
import { getSupabase, type Reservation } from "@/lib/supabase";

type Unauthorized = { ok: false; reason: "not_configured" | "unauthorized" };

export type AdminDashboardResult =
  | { ok: true; adminEmail: string; summary: AdminSummary; reservations: AdminReservation[] }
  | Unauthorized
  | { ok: false; reason: "error" };

export type AdminMutationResult =
  | { ok: true; reservation: AdminReservation; notified: boolean }
  | Unauthorized
  | { ok: false; reason: "error" | "invalid"; error: string };

export type AdminSaveResult =
  | AdminMutationResult
  /** 保存はできたが、同時に保存された予約と重なっている（保存の直後に確認した結果） */
  | { ok: true; reservation: AdminReservation; notified: boolean; conflictsAfterSave: string[] }
  /** 同じ日の予約と重なる（force で保存し直せる） */
  | { ok: false; reason: "conflict"; conflicts: { label: string }[] };

const viewSchema = z.enum(["upcoming", "pending", "past", "cancelled", "all"]);
const idSchema = z.string().uuid();
const ERROR = "処理に失敗しました。しばらく経ってからもう一度お試しください。";

/** 予約の一覧と件数 */
export async function getAdminDashboard(view: AdminView): Promise<AdminDashboardResult> {
  const auth = await authenticateAdmin();
  if (!auth.ok) return auth;
  const parsedView = viewSchema.safeParse(view);
  if (!parsedView.success) return { ok: false, reason: "error" };

  try {
    const today = todayJst();
    const supabase = getSupabase();
    let query = supabase.from("reservations").select("*");
    switch (parsedView.data) {
      case "upcoming":
        query = query.gte("date", today).neq("status", "cancelled").order("date").limit(300);
        break;
      case "pending":
        query = query.gte("date", today).eq("status", "pending").order("date").limit(300);
        break;
      case "past":
        query = query.lt("date", today).neq("status", "cancelled").order("date", { ascending: false }).limit(200);
        break;
      case "cancelled":
        query = query.eq("status", "cancelled").order("date", { ascending: false }).limit(200);
        break;
      case "all":
        query = query.order("date", { ascending: false }).limit(300);
        break;
    }

    const [list, upcoming] = await Promise.all([
      query,
      supabase.from("reservations").select("date, status").gte("date", today).neq("status", "cancelled"),
    ]);
    if (list.error) throw list.error;
    if (upcoming.error) throw upcoming.error;

    return {
      ok: true,
      adminEmail: auth.email,
      summary: summarize((upcoming.data ?? []) as Pick<Reservation, "date" | "status">[]),
      reservations: ((list.data ?? []) as Reservation[]).map(toAdminReservation),
    };
  } catch (err) {
    console.error("getAdminDashboard:", err);
    return { ok: false, reason: "error" };
  }
}

/** お客様へのお知らせメール。メールアドレスがない（電話予約など）ときは送らない */
async function notifyCustomer(kind: StoreNoticeKind, row: Reservation): Promise<boolean> {
  const from = notificationFrom();
  if (!from || !row.email) return false;
  const links = await customerLinksFor(row.id);
  const result = await sendResendEmail({
    from,
    to: row.email,
    ...storeNoticeMail(kind, toManagedReservation(row), links),
    replyTo: customerReplyTo(),
    tags: [
      { name: "type", value: `reservation-${kind}` },
      { name: "recipient", value: "customer" },
    ],
  });
  if (!result.ok) {
    console.error("Failed to send store notice email:", kind, result.reason, result.message);
  }
  return result.ok;
}

/**
 * 確定（確認中の予約だけ）・キャンセル（締切に関係なく店側でできる）。
 * キャンセル済みを戻す操作は、ほかの予約と重なるおそれがあるので用意しない（必要なら登録し直す）。
 */
export async function updateReservationStatus(
  id: string,
  status: "confirmed" | "cancelled",
  notify: boolean,
): Promise<AdminMutationResult> {
  const auth = await authenticateAdmin();
  if (!auth.ok) return auth;
  if (!idSchema.safeParse(id).success || !["confirmed", "cancelled"].includes(status)) {
    return { ok: false, reason: "invalid", error: "操作が正しくありません。" };
  }

  try {
    // 変えられる状態の行だけを更新する（二重送信でメールが重複しないように）
    const { data, error } = await getSupabase()
      .from("reservations")
      .update({ status })
      .eq("id", id)
      .in("status", status === "confirmed" ? ["pending"] : ["pending", "confirmed"])
      .select("*");
    if (error) throw error;

    let row = (data?.[0] ?? null) as Reservation | null;
    const changed = row !== null;
    if (!row) {
      const current = await getSupabase().from("reservations").select("*").eq("id", id).maybeSingle();
      if (current.error) throw current.error;
      row = current.data as Reservation | null;
      if (!row) return { ok: false, reason: "invalid", error: "予約が見つかりません。" };
      // お客様が同時にキャンセルしたなど、変えられない状態になっていた
      if (row.status !== status) {
        return {
          ok: false,
          reason: "invalid",
          error: `この予約はすでに「${toAdminReservation(row).statusLabel}」のため変更できません。画面を更新してください。`,
        };
      }
    }

    console.info(`[admin] ${auth.email} set reservation ${id} to ${status}`);
    const notified = changed && notify ? await notifyCustomer(status, row) : false;
    return { ok: true, reservation: toAdminReservation(row), notified };
  } catch (err) {
    console.error("updateReservationStatus:", err);
    return { ok: false, reason: "error", error: ERROR };
  }
}

/** 同じ日の予約（キャンセル以外・自分以外）のうち、重なるものの表示用ラベル */
async function conflictLabels(
  value: { type: string; date: string; time: string | null },
  excludeId: string | undefined,
): Promise<string[]> {
  const { data, error } = await getSupabase()
    .from("reservations")
    .select("id, type, date, time, name")
    .eq("date", value.date)
    .neq("status", "cancelled");
  if (error) throw error;
  const others = ((data ?? []) as ConflictCandidate[]).filter((c) => c.id !== excludeId);
  return findConflicts(value, others).map(
    (c) => `${reserveTypeLabel(c.type) || c.type} ${reservationTimeLabel(c.type, c.time)} ${c.name} 様`,
  );
}

/** 電話予約などの登録（id なし）と、日時・内容の変更（id あり） */
export async function saveReservation(
  input: AdminReservationInput,
  options: { id?: string; notify: boolean; force: boolean },
): Promise<AdminSaveResult> {
  const auth = await authenticateAdmin();
  if (!auth.ok) return auth;

  const parsed = adminReservationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, reason: "invalid", error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。" };
  }
  if (options.id && !idSchema.safeParse(options.id).success) {
    return { ok: false, reason: "invalid", error: "予約が見つかりません。" };
  }
  const value = parsed.data;

  try {
    const supabase = getSupabase();

    if (!options.force) {
      const conflicts = await conflictLabels(value, options.id);
      if (conflicts.length > 0) {
        return { ok: false, reason: "conflict", conflicts: conflicts.map((label) => ({ label })) };
      }
    }

    const fields = {
      type: value.type,
      date: value.date,
      time: value.time,
      people_count: value.peopleCount,
      name: value.name,
      email: value.email,
      phone: value.phone,
      message: value.message,
    };

    const { data, error } = options.id
      ? await supabase.from("reservations").update(fields).eq("id", options.id).select("*").maybeSingle()
      : await supabase
          .from("reservations")
          .insert({ ...fields, status: value.status })
          .select("*")
          .single();
    if (error) throw error;
    const row = data as Reservation | null;
    if (!row) return { ok: false, reason: "invalid", error: "予約が見つかりません。" };

    console.info(`[admin] ${auth.email} ${options.id ? "updated" : "created"} reservation ${row.id}`);
    const kind: StoreNoticeKind = options.id ? "changed" : row.status === "confirmed" ? "confirmed" : "created";
    const notified = options.notify ? await notifyCustomer(kind, row) : false;

    // 確認から保存までの間に、別の画面（Web 予約・もう一人の管理者）で重なる予約が入っていないか確かめ直す
    if (!options.force) {
      const conflictsAfterSave = await conflictLabels(value, row.id);
      if (conflictsAfterSave.length > 0) {
        return { ok: true, reservation: toAdminReservation(row), notified, conflictsAfterSave };
      }
    }
    return { ok: true, reservation: toAdminReservation(row), notified };
  } catch (err) {
    console.error("saveReservation:", err);
    return { ok: false, reason: "error", error: ERROR };
  }
}
