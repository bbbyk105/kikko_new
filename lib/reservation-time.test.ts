import {
  availableSlotsForDay,
  findFirstAvailableMeetingRange,
  isDayBookable,
  isSlotPastForSelectedDay,
  meetingEndOptionsAfter,
  meetingRangeIsFreeAndNotPast,
  normalizeReservationTime,
  occupiedHourSlotsFromReservationTime,
  parseTimeRange,
  pickMeetingEnd,
  toSlotSet,
} from "@/lib/reservation-time";

const SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const END_OPTIONS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

// ローカル時刻で日付を作る（isSlotPastForSelectedDay はローカル時刻で判定する）
const day = (y: number, m: number, d: number, h = 0, min = 0) => new Date(y, m - 1, d, h, min);

describe("normalizeReservationTime", () => {
  it("HH:mm に揃える", () => {
    expect(normalizeReservationTime("9:00")).toBe("09:00");
    expect(normalizeReservationTime(" 10:30 ")).toBe("10:30");
  });
  it("空・不正な値は null", () => {
    expect(normalizeReservationTime(null)).toBeNull();
    expect(normalizeReservationTime("")).toBeNull();
    expect(normalizeReservationTime("abc")).toBeNull();
  });
});

describe("parseTimeRange", () => {
  it("開始-終了を分解して正規化する", () => {
    expect(parseTimeRange("9:00-13:00")).toEqual({ start: "09:00", end: "13:00" });
    expect(parseTimeRange("10:00 - 12:00")).toEqual({ start: "10:00", end: "12:00" });
  });
  it("範囲でなければ null", () => {
    expect(parseTimeRange("10:00")).toBeNull();
    expect(parseTimeRange(undefined)).toBeNull();
  });
});

describe("occupiedHourSlotsFromReservationTime", () => {
  it("単一時刻はその1時間", () => {
    expect(occupiedHourSlotsFromReservationTime("9:00", SLOTS)).toEqual(["09:00"]);
  });
  it("範囲は終了を含まない各時", () => {
    expect(occupiedHourSlotsFromReservationTime("10:00-13:00", SLOTS)).toEqual([
      "10:00",
      "11:00",
      "12:00",
    ]);
  });
  it("空は占有なし", () => {
    expect(occupiedHourSlotsFromReservationTime(null, SLOTS)).toEqual([]);
  });
});

describe("toSlotSet", () => {
  it("表記ゆれを正規化し、空値を除く", () => {
    expect([...toSlotSet(["9:00", "10:00", null, ""])]).toEqual(["09:00", "10:00"]);
    expect(toSlotSet(undefined).size).toBe(0);
  });
});

describe("isSlotPastForSelectedDay", () => {
  const now = day(2026, 9, 25, 10, 30);
  it("当日で開始済みなら true", () => {
    expect(isSlotPastForSelectedDay(day(2026, 9, 25), "10:00", now)).toBe(true);
  });
  it("当日でまだなら false", () => {
    expect(isSlotPastForSelectedDay(day(2026, 9, 25), "11:00", now)).toBe(false);
  });
  it("当日以外は常に false", () => {
    expect(isSlotPastForSelectedDay(day(2026, 9, 26), "09:00", now)).toBe(false);
  });
});

describe("availableSlotsForDay", () => {
  it("予約済みを除く", () => {
    const booked = toSlotSet(["10:00", "13:00"]);
    const slots = availableSlotsForDay(day(2026, 10, 1), SLOTS, booked, day(2026, 9, 25, 12));
    expect(slots).not.toContain("10:00");
    expect(slots).not.toContain("13:00");
    expect(slots).toHaveLength(SLOTS.length - 2);
  });
  it("当日は開始済みの枠を除く", () => {
    const slots = availableSlotsForDay(day(2026, 9, 25), SLOTS, new Set(), day(2026, 9, 25, 15, 10));
    expect(slots).toEqual(["16:00", "17:00"]);
  });
});

describe("isDayBookable", () => {
  const base = {
    privateDates: new Set(["2026-10-02"]),
    bookedTimesByDate: { "2026-10-01": ["10:00"] } as Record<string, string[]>,
    timeSlots: SLOTS,
    now: day(2026, 9, 25, 9),
  };
  it("貸切日はどのモードでも不可", () => {
    expect(isDayBookable(day(2026, 10, 2), { ...base, mode: "visitor" })).toBe(false);
    expect(isDayBookable(day(2026, 10, 2), { ...base, mode: "private" })).toBe(false);
  });
  it("貸切は他の予約がある日は不可", () => {
    expect(isDayBookable(day(2026, 10, 1), { ...base, mode: "private" })).toBe(false);
    expect(isDayBookable(day(2026, 10, 3), { ...base, mode: "private" })).toBe(true);
  });
  it("ビジター・会議室は空き枠があれば可", () => {
    expect(isDayBookable(day(2026, 10, 1), { ...base, mode: "visitor" })).toBe(true);
    expect(isDayBookable(day(2026, 10, 1), { ...base, mode: "meeting" })).toBe(true);
  });
  it("全枠埋まっていれば不可", () => {
    const full = { ...base, bookedTimesByDate: { "2026-10-01": SLOTS } };
    expect(isDayBookable(day(2026, 10, 1), { ...full, mode: "visitor" })).toBe(false);
  });
});

describe("会議室の時間帯", () => {
  it("meetingEndOptionsAfter は開始より後だけ", () => {
    expect(meetingEndOptionsAfter("16:00", END_OPTIONS)).toEqual(["17:00", "18:00"]);
  });
  it("pickMeetingEnd は今の終了が使えればそのまま、使えなければ最初の候補", () => {
    expect(pickMeetingEnd("10:00", "13:00", END_OPTIONS)).toBe("13:00");
    expect(pickMeetingEnd("14:00", "13:00", END_OPTIONS)).toBe("15:00");
  });
  it("meetingRangeIsFreeAndNotPast は重なりと開始済みを弾く", () => {
    const booked = toSlotSet(["11:00"]);
    const future = day(2026, 10, 1);
    const now = day(2026, 9, 25);
    expect(meetingRangeIsFreeAndNotPast(future, "09:00", "11:00", SLOTS, booked, now)).toBe(true);
    expect(meetingRangeIsFreeAndNotPast(future, "10:00", "12:00", SLOTS, booked, now)).toBe(false);
    expect(
      meetingRangeIsFreeAndNotPast(day(2026, 9, 25), "09:00", "11:00", SLOTS, new Set(), day(2026, 9, 25, 9, 30)),
    ).toBe(false);
  });
  it("findFirstAvailableMeetingRange は最初に取れる時間帯を返す", () => {
    const booked = toSlotSet(["09:00"]);
    expect(
      findFirstAvailableMeetingRange(day(2026, 10, 1), SLOTS, END_OPTIONS, booked, day(2026, 9, 25)),
    ).toEqual({ start: "10:00", end: "11:00" });
  });
});
