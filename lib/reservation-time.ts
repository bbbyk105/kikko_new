import { isSameDay, startOfDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { reserveData } from "@/app/data/site";

/** DB / 表示用の時刻を HH:mm に揃える */
export function normalizeReservationTime(time: string | null): string | null {
  if (!time?.trim()) return null;
  const m = time.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const h = Number.parseInt(m[1], 10);
  const min = m[2];
  if (Number.isNaN(h)) return null;
  return `${String(h).padStart(2, "0")}:${min}`;
}

export function timeToMinutes(time: string): number {
  const n = normalizeReservationTime(time);
  if (!n) return NaN;
  const [h, m] = n.split(":").map(Number);
  return h * 60 + m;
}

/**
 * 開始〜終了（終了は含まない）の間に含まれる「時」スロット開始時刻。
 * hourlySlots は昇順の HH:mm（例: 9:00〜17:00 の各時）
 */
export function hourSlotStartsBetween(
  start: string,
  end: string,
  hourlySlots: readonly string[],
): string[] {
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  if (Number.isNaN(startMin) || Number.isNaN(endMin) || endMin <= startMin) {
    return [];
  }
  const out: string[] = [];
  for (const slot of hourlySlots) {
    const sm = timeToMinutes(slot);
    if (Number.isNaN(sm)) continue;
    const slotEnd = sm + 60;
    if (sm < endMin && slotEnd > startMin) {
      out.push(slot);
    }
  }
  return out;
}

/**
 * 予約の time 文字列が占有する時間帯スロット（時単位）を返す。
 * - "09:00" → その1時間
 * - "10:00-13:00" → 10,11,12 時台
 */
export function occupiedHourSlotsFromReservationTime(
  time: string | null,
  hourlySlots: readonly string[],
): string[] {
  if (!time?.trim()) return [];
  const trimmed = time.trim();
  const rangeMatch = trimmed.match(
    /^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/,
  );
  if (rangeMatch) {
    const start = normalizeReservationTime(rangeMatch[1]);
    const end = normalizeReservationTime(rangeMatch[2]);
    if (!start || !end) return [];
    return hourSlotStartsBetween(start, end, hourlySlots);
  }
  const single = normalizeReservationTime(trimmed);
  if (!single) return [];
  return [single];
}

/** 会議室の利用時間帯が既存の占有と重ならないか */
export function meetingRangeIsFree(
  start: string,
  end: string,
  hourlySlots: readonly string[],
  bookedSlots: Set<string>,
): boolean {
  const needed = hourSlotStartsBetween(start, end, hourlySlots);
  return needed.length > 0 && needed.every((s) => !bookedSlots.has(s));
}

/**
 * 選択日が「今日」のとき、スロット開始時刻がすでに過ぎていれば true（予約不可）。
 * 当日以外は常に false。
 */
export function isSlotPastForSelectedDay(
  selectedDay: Date,
  slotHHmm: string,
  now: Date = new Date(),
): boolean {
  if (!isSameDay(startOfDay(selectedDay), startOfDay(now))) return false;
  const slotMin = timeToMinutes(slotHHmm);
  if (Number.isNaN(slotMin)) return true;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin >= slotMin;
}

/** 会議室: 空きかつ当日なら開始済みの時間帯を含まない */
export function meetingRangeIsFreeAndNotPast(
  selectedDay: Date,
  start: string,
  end: string,
  hourlySlots: readonly string[],
  bookedSlots: Set<string>,
  now: Date = new Date(),
): boolean {
  if (!meetingRangeIsFree(start, end, hourlySlots, bookedSlots)) return false;
  const needed = hourSlotStartsBetween(start, end, hourlySlots);
  return needed.every((s) => !isSlotPastForSelectedDay(selectedDay, s, now));
}

const JST = "Asia/Tokyo";

/**
 * サーバー用: 当日（JST）で、予約時刻のいずれかがすでに開始済みなら true（不正な予約）
 */
export function isReservationTimeInPastForDateJst(
  dateStr: string,
  timeRaw: string | null,
  now: Date = new Date(),
): boolean {
  if (!timeRaw?.trim()) return false;
  const todayStr = formatInTimeZone(now, JST, "yyyy-MM-dd");
  if (dateStr !== todayStr) return false;

  const nowMin =
    Number(formatInTimeZone(now, JST, "H")) * 60 +
    Number(formatInTimeZone(now, JST, "m"));

  const trimmed = timeRaw.trim();
  const rangeMatch = trimmed.match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);
  if (rangeMatch) {
    const start = normalizeReservationTime(rangeMatch[1]);
    const end = normalizeReservationTime(rangeMatch[2]);
    if (!start || !end) return true;
    const needed = hourSlotStartsBetween(start, end, reserveData.timeSlots);
    return needed.some((s) => nowMin >= timeToMinutes(s));
  }
  const single = normalizeReservationTime(trimmed);
  if (!single) return false;
  return nowMin >= timeToMinutes(single);
}

/** 会議室: 当日で最初に取れる開始〜終了（空き・過去なし） */
export function findFirstAvailableMeetingRange(
  selectedDay: Date,
  hourlySlots: readonly string[],
  meetingEndHourOptions: readonly string[],
  bookedSlots: Set<string>,
  now: Date = new Date(),
): { start: string; end: string } | null {
  for (const start of hourlySlots) {
    if (isSlotPastForSelectedDay(selectedDay, start, now)) continue;
    for (const end of meetingEndHourOptions) {
      if (timeToMinutes(end) <= timeToMinutes(start)) continue;
      if (
        meetingRangeIsFreeAndNotPast(
          selectedDay,
          start,
          end,
          hourlySlots,
          bookedSlots,
          now,
        )
      ) {
        return { start, end };
      }
    }
  }
  return null;
}
