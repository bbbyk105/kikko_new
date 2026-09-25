import {
  buildReservationInput,
  canNavigateToStep,
  formatSelectedTime,
  isDateTimeReady,
  previousStep,
  reserveTypeLabel,
  stepNumberOf,
  stepOfNumber,
  PRIVATE_TIME_LABEL,
} from "@/lib/reserve-flow";

describe("ステップ番号", () => {
  it("step と番号を相互に変換する", () => {
    expect(stepNumberOf("type")).toBe(1);
    expect(stepNumberOf("confirm")).toBe(4);
    expect(stepNumberOf("complete")).toBe(1);
    expect(stepOfNumber(3)).toBe("form");
    expect(stepOfNumber(9)).toBeUndefined();
  });
  it("previousStep は1つ前、先頭は null", () => {
    expect(previousStep("confirm")).toBe("form");
    expect(previousStep("calendar")).toBe("type");
    expect(previousStep("type")).toBeNull();
  });
});

describe("isDateTimeReady", () => {
  const date = new Date(2026, 9, 1);
  it("日付がなければ false", () => {
    expect(isDateTimeReady({ date: undefined, time: "10:00", mode: "visitor" })).toBe(false);
  });
  it("貸切は日付だけでよい", () => {
    expect(isDateTimeReady({ date, time: undefined, mode: "private" })).toBe(true);
  });
  it("会議室は開始〜終了が必要", () => {
    expect(isDateTimeReady({ date, time: "10:00", mode: "meeting" })).toBe(false);
    expect(isDateTimeReady({ date, time: "10:00-12:00", mode: "meeting" })).toBe(true);
  });
  it("ビジター等は時刻が必要", () => {
    expect(isDateTimeReady({ date, time: undefined, mode: "visitor" })).toBe(false);
    expect(isDateTimeReady({ date, time: "10:00", mode: "visitor" })).toBe(true);
  });
});

describe("canNavigateToStep", () => {
  const ready = { hasType: true, dateTimeReady: true };
  it("今のステップには移動しない", () => {
    expect(canNavigateToStep(2, { step: "calendar", ...ready })).toBe(false);
  });
  it("1 へは先に進んでいれば戻れる", () => {
    expect(canNavigateToStep(1, { step: "form", ...ready })).toBe(true);
  });
  it("2 は種別の選択が必要", () => {
    expect(canNavigateToStep(2, { step: "type", hasType: false, dateTimeReady: false })).toBe(false);
    expect(canNavigateToStep(2, { step: "type", hasType: true, dateTimeReady: false })).toBe(true);
  });
  it("3 は日時の選択が必要", () => {
    expect(canNavigateToStep(3, { step: "calendar", hasType: true, dateTimeReady: false })).toBe(false);
    expect(canNavigateToStep(3, { step: "calendar", ...ready })).toBe(true);
  });
  it("4 は入力ステップからのみ", () => {
    expect(canNavigateToStep(4, { step: "calendar", ...ready })).toBe(false);
    expect(canNavigateToStep(4, { step: "form", ...ready })).toBe(true);
  });
});

describe("表示用の値", () => {
  it("reserveTypeLabel は種別の表示名、不明なら空", () => {
    expect(reserveTypeLabel("meeting")).toBe("会議室予約");
    expect(reserveTypeLabel("unknown")).toBe("");
  });
  it("formatSelectedTime は貸切なら終日表記", () => {
    expect(formatSelectedTime("private", undefined)).toBe(PRIVATE_TIME_LABEL);
    expect(formatSelectedTime("visitor", "10:00")).toBe("10:00");
  });
});

describe("buildReservationInput", () => {
  const data = {
    type: "private",
    name: "山田",
    email: "a@example.com",
    phone: "",
    numberOfPeople: "30名",
    message: "",
  };
  it("貸切は time を null にし、人数は数値化する", () => {
    expect(
      buildReservationInput(data, { date: new Date(2026, 9, 1), time: "10:00", mode: "private" }),
    ).toEqual({
      type: "private",
      date: "2026-10-01",
      time: null,
      peopleCount: 30,
      name: "山田",
      email: "a@example.com",
      phone: null,
      message: null,
    });
  });
  it("人数が数字でなければ null", () => {
    const input = buildReservationInput(
      { ...data, type: "event", numberOfPeople: "未定" },
      { date: new Date(2026, 9, 1), time: "10:00", mode: "visitor" },
    );
    expect(input.peopleCount).toBeNull();
    expect(input.time).toBe("10:00");
  });
});
