import { reserveData } from "@/app/data/site";
import { hourSlotStartsBetween, normalizeReservationTime, parseTimeRange } from "@/lib/reservation-time";
import type { Reservation } from "@/lib/supabase";

type SlotTarget = Pick<Reservation, "type" | "date" | "time">;
export type ConflictCandidate = Pick<Reservation, "id" | "type" | "date" | "time" | "name">;

/** その予約が押さえる会議室の時間枠（会議室以外は空） */
function meetingSlots(r: SlotTarget): string[] {
  if (r.type !== "meeting" || !r.time) return [];
  const range = parseTimeRange(r.time);
  if (range) return hourSlotStartsBetween(range.start, range.end, reserveData.timeSlots);
  const single = normalizeReservationTime(r.time);
  return single ? [single] : [];
}

function overlapsMeeting(target: SlotTarget, other: SlotTarget): boolean {
  const targetSlots = new Set(meetingSlots(target));
  return meetingSlots(other).some((slot) => targetSlots.has(slot));
}

/**
 * 管理画面で登録・変更するときの重なり（知らせるだけで、承知の上なら保存できる）。
 * - 貸切の日は、ほかのすべての予約と重なる
 * - 会議室は、時間帯が重なる会議室の予約と重なる
 * candidates はキャンセル以外の予約（自分自身は除いて渡す）
 */
export function findConflicts<T extends ConflictCandidate>(target: SlotTarget, candidates: T[]): T[] {
  const sameDay = candidates.filter((c) => c.date === target.date);
  if (target.type === "private") return sameDay;
  return sameDay.filter((c) => c.type === "private" || overlapsMeeting(target, c));
}

/**
 * Web の予約フォームで受け付けられない重なり（予約カレンダーの空き枠と同じ基準）。
 * 会議室は個室で、ビジター等は共有スペースの利用なので、お互いに妨げない。
 * - 貸切の日は、どの種別も予約できない
 * - 貸切は、その日に会議室の予約があると予約できない（ビジター等は共有利用なので妨げない）
 * - 会議室は、時間帯が重なる会議室の予約があると予約できない
 */
export function findWebBookingConflicts<T extends ConflictCandidate>(
  target: SlotTarget,
  candidates: T[],
): T[] {
  const sameDay = candidates.filter((c) => c.date === target.date);
  return sameDay.filter((c) => {
    if (c.type === "private") return true;
    if (target.type === "private") return c.type === "meeting";
    return overlapsMeeting(target, c);
  });
}

/**
 * ほぼ同時に入った Web 予約のどちらを残すか。先に入った（created_at が早い、同時なら id が小さい）方を残し、
 * 後から入った自分と重なる先客がいれば、その先客を返す（空なら自分は残してよい）。
 */
export function earlierWebBookingConflicts<T extends ConflictCandidate & { created_at: string }>(
  mine: SlotTarget & { id: string; created_at: string },
  others: T[],
): T[] {
  const mineAt = Date.parse(mine.created_at);
  const earlier = others.filter((o) => {
    if (o.id === mine.id) return false;
    const at = Date.parse(o.created_at);
    return at < mineAt || (at === mineAt && o.id < mine.id);
  });
  return findWebBookingConflicts(mine, earlier);
}
