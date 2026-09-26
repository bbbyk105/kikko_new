import {
  cancelDeadlineLabelOf,
  cancelDeadlineOf,
  cancelStateOf,
  reservationTimeLabel,
  toManagedReservation,
} from "@/lib/reservation-manage";

// 日本時間の日時を Date にする（テストの実行環境のタイムゾーンに左右されないように）
const jst = (iso: string) => new Date(`${iso}+09:00`);

describe("cancelDeadlineOf", () => {
  it("利用日の前日 17:00（日本時間）", () => {
    expect(cancelDeadlineOf("2026-10-03")).toEqual(jst("2026-10-02T17:00:00"));
  });
  it("月・年をまたぐ", () => {
    expect(cancelDeadlineOf("2026-11-01")).toEqual(jst("2026-10-31T17:00:00"));
    expect(cancelDeadlineOf("2027-01-01")).toEqual(jst("2026-12-31T17:00:00"));
  });
  it("表示用のラベル", () => {
    expect(cancelDeadlineLabelOf("2026-10-03")).toBe("10月2日(金) 17:00");
  });
});

describe("cancelStateOf", () => {
  const reservation = { date: "2026-10-03", status: "pending" as const };

  it("前日 17:00 より前ならキャンセルできる", () => {
    expect(cancelStateOf(reservation, jst("2026-10-01T12:00:00"))).toBe("cancellable");
    expect(cancelStateOf(reservation, jst("2026-10-02T16:59:59"))).toBe("cancellable");
  });

  it("前日 17:00 以降〜当日は締切済み", () => {
    expect(cancelStateOf(reservation, jst("2026-10-02T17:00:00"))).toBe("closed");
    expect(cancelStateOf(reservation, jst("2026-10-03T23:59:00"))).toBe("closed");
  });

  it("利用日を過ぎたら past", () => {
    expect(cancelStateOf(reservation, jst("2026-10-04T00:00:00"))).toBe("past");
  });

  it("確定済みの予約も同じ締切でキャンセルできる", () => {
    const confirmed = { ...reservation, status: "confirmed" as const };
    expect(cancelStateOf(confirmed, jst("2026-10-02T16:00:00"))).toBe("cancellable");
  });

  it("キャンセル済みは日付に関係なく cancelled", () => {
    const cancelled = { ...reservation, status: "cancelled" as const };
    expect(cancelStateOf(cancelled, jst("2026-10-01T12:00:00"))).toBe("cancelled");
    expect(cancelStateOf(cancelled, jst("2026-10-05T12:00:00"))).toBe("cancelled");
  });
});

describe("reservationTimeLabel", () => {
  it("貸切は終日の表記", () => {
    expect(reservationTimeLabel("private", null)).toBe("終日貸切（9:00〜18:00）");
  });
  it("会議室の時間帯は「〜」でつなぐ", () => {
    expect(reservationTimeLabel("meeting", "10:00-13:00")).toBe("10:00〜13:00");
  });
  it("単一の時刻・未指定", () => {
    expect(reservationTimeLabel("visitor", "9:00")).toBe("09:00");
    expect(reservationTimeLabel("event", null)).toBe("時間指定なし");
  });
});

describe("toManagedReservation", () => {
  it("表示用に整形する", () => {
    const view = toManagedReservation(
      {
        id: "3f2b6c1e-8d4a-4f7b-9c2e-1a5d7e9b0c34",
        name: "山田 太郎",
        type: "meeting",
        date: "2026-10-03",
        time: "10:00-13:00",
        people_count: null,
        status: "confirmed",
      },
      jst("2026-10-01T12:00:00"),
    );
    expect(view).toEqual({
      id: "3f2b6c1e-8d4a-4f7b-9c2e-1a5d7e9b0c34",
      name: "山田 太郎",
      typeLabel: "会議室予約",
      dateLabel: "2026年10月3日(土)",
      timeLabel: "10:00〜13:00",
      peopleCount: null,
      status: "confirmed",
      statusLabel: "予約確定",
      cancelState: "cancellable",
      cancelDeadlineLabel: "10月2日(金) 17:00",
    });
  });
});
