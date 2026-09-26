import { format, isSameDay, startOfDay } from "date-fns";
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

/** "10:00-13:00" 形式を HH:mm の開始・終了に分解する。形式が違えば null */
export function parseTimeRange(
  time: string | null | undefined,
): { start: string; end: string } | null {
  const m = time?.trim().match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);
  if (!m) return null;
  const start = normalizeReservationTime(m[1]);
  const end = normalizeReservationTime(m[2]);
  return start && end ? { start, end } : null;
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
  const range = parseTimeRange(time);
  if (range) {
    return hourSlotStartsBetween(range.start, range.end, hourlySlots);
  }
  const single = normalizeReservationTime(time);
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

/** 今日から何日先まで Web の予約を受け付けるか（その日を含む） */
export const BOOKING_WINDOW_DAYS = 60;

/** 日本時間の今日（yyyy-MM-dd） */
export function todayJst(now: Date = new Date()): string {
  return formatInTimeZone(now, JST, "yyyy-MM-dd");
}

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

  const range = parseTimeRange(timeRaw);
  if (range) {
    const needed = hourSlotStartsBetween(range.start, range.end, reserveData.timeSlots);
    return needed.some((s) => nowMin >= timeToMinutes(s));
  }
  const single = normalizeReservationTime(timeRaw);
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

/** 予約済み時刻の一覧を HH:mm の Set にする（表記ゆれ・空値は除く） */
export function toSlotSet(times: readonly (string | null)[] | undefined): Set<string> {
  const out = new Set<string>();
  for (const t of times ?? []) {
    const n = normalizeReservationTime(t);
    if (n) out.add(n);
  }
  return out;
}

/** その日に予約できる時間枠（予約済みと、当日なら開始済みを除く）。返り値は timeSlots の表記のまま */
export function availableSlotsForDay(
  day: Date,
  timeSlots: readonly string[],
  booked: Set<string>,
  now: Date = new Date(),
): string[] {
  return timeSlots.filter((slot) => {
    const n = normalizeReservationTime(slot);
    if (!n || booked.has(n)) return false;
    return !isSlotPastForSelectedDay(day, n, now);
  });
}

export type BookingMode = "visitor" | "meeting" | "private";

/**
 * カレンダーでその日を選べるか（表示期間外かどうかは呼び出し側で判定）。
 * - 貸切日は全モードで不可
 * - 貸切: 他の予約が一切ない日のみ
 * - 会議室: 空いている時間枠が1つ以上ある日
 * - ビジター等: 会議室は個室で、ビジター等は共有スペースなので、会議室の予約では枠を減らさない
 */
export function isDayBookable(
  day: Date,
  {
    mode,
    privateDates,
    bookedTimesByDate,
    timeSlots,
    now = new Date(),
  }: {
    mode: BookingMode;
    privateDates: Set<string>;
    bookedTimesByDate: Record<string, string[]>;
    timeSlots: readonly string[];
    now?: Date;
  },
): boolean {
  const key = format(day, "yyyy-MM-dd");
  if (privateDates.has(key)) return false;
  const times = bookedTimesByDate[key];
  if (mode === "private") return !times || times.length === 0;
  const booked = mode === "meeting" ? toSlotSet(times) : new Set<string>();
  return availableSlotsForDay(day, timeSlots, booked, now).length > 0;
}

/** 開始時刻より後の終了時刻候補 */
export function meetingEndOptionsAfter(
  start: string,
  endOptions: readonly string[],
): string[] {
  return endOptions.filter((opt) => timeToMinutes(opt) > timeToMinutes(start));
}

/** 開始時刻を変えたときの終了時刻。今の終了がまだ使えればそのまま、使えなければ最初の候補 */
export function pickMeetingEnd(
  start: string,
  currentEnd: string,
  endOptions: readonly string[],
): string {
  const ends = meetingEndOptionsAfter(start, endOptions);
  return ends.includes(currentEnd) ? currentEnd : (ends[0] ?? currentEnd);
}
