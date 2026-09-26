import { parseWebReservation } from "@/lib/validation/reservation";

// 日本時間 2026-10-01 10:00
const now = new Date("2026-10-01T01:00:00Z");

const valid = {
  type: "visitor",
  date: "2026-10-05",
  time: "10:00",
  peopleCount: null,
  name: " 山田 太郎 ",
  email: " taro@example.com ",
  phone: "",
  message: " よろしくお願いします ",
};

function errorOf(input: unknown): string | undefined {
  const result = parseWebReservation(input, now);
  return result.ok ? undefined : result.error;
}

describe("parseWebReservation", () => {
  it("正しい入力は前後の空白を除き、空の電話番号は null にする", () => {
    const result = parseWebReservation(valid, now);
    expect(result).toEqual({
      ok: true,
      value: {
        type: "visitor",
        date: "2026-10-05",
        time: "10:00",
        peopleCount: null,
        name: "山田 太郎",
        email: "taro@example.com",
        phone: null,
        message: "よろしくお願いします",
      },
    });
  });

  it("種別・日付の形がおかしければ選び直しを促す", () => {
    expect(errorOf({ ...valid, type: "vip" })).toBe("予約内容が正しくありません。もう一度お選びください。");
    expect(errorOf({ ...valid, date: "2026/10/05" })).toBe("予約内容が正しくありません。もう一度お選びください。");
    expect(errorOf({ ...valid, date: "2026-02-31" })).toBe("予約内容が正しくありません。もう一度お選びください。");
  });

  it("お名前・メール・お問い合わせ内容は必須", () => {
    expect(errorOf({ ...valid, name: " " })).toBe("お名前を入力してください");
    expect(errorOf({ ...valid, email: "taro@" })).toBe("正しいメールアドレスを入力してください");
    expect(errorOf({ ...valid, message: "" })).toBe("お問い合わせ内容を入力してください");
  });

  it("文字数の上限を超えたら受け付けない", () => {
    expect(errorOf({ ...valid, message: "あ".repeat(2001) })).toBe(
      "お問い合わせ内容は2000文字以内で入力してください",
    );
  });

  it("人数は1〜150名（施設の定員）の整数", () => {
    expect(errorOf({ ...valid, type: "private", peopleCount: 0 })).toBe("人数は1名以上で入力してください");
    expect(errorOf({ ...valid, type: "private", peopleCount: 151 })).toBe("人数は150名以下で入力してください");
    expect(errorOf({ ...valid, type: "private", peopleCount: 150 })).toBeUndefined();
    expect(errorOf({ ...valid, type: "private", peopleCount: 1.5 })).toBe("予約内容が正しくありません。もう一度お選びください。");
  });

  describe("利用日（日本時間の今日〜60日先）", () => {
    it("今日は受け付け、昨日は受け付けない", () => {
      expect(errorOf({ ...valid, date: "2026-10-01", time: "11:00" })).toBeUndefined();
      expect(errorOf({ ...valid, date: "2026-09-30" })).toBe("過ぎた日付は予約できません。別の日をお選びください。");
    });
    it("60日先までは受け付け、61日先は受け付けない", () => {
      expect(errorOf({ ...valid, date: "2026-11-30" })).toBeUndefined();
      expect(errorOf({ ...valid, date: "2026-12-01" })).toBe("ご予約は60日先まで承ります。別の日をお選びください。");
    });
    it("日本時間で日付が変わった直後は、日本時間の今日で判定する", () => {
      // 日本時間 2026-10-02 00:30（UTC ではまだ 10/01）
      const result = parseWebReservation({ ...valid, date: "2026-10-01" }, new Date("2026-10-01T15:30:00Z"));
      expect(result.ok).toBe(false);
    });
  });

  describe("時間の指定", () => {
    const INVALID_TIME = "日時の選び方が正しくありません。もう一度お選びください。";

    it("ビジター等は時間枠の開始時刻だけ受け付け、表記をそろえる", () => {
      expect(parseWebReservation({ ...valid, time: "9:00" }, now)).toMatchObject({ ok: true, value: { time: "09:00" } });
      expect(errorOf({ ...valid, time: "08:00" })).toBe(INVALID_TIME);
      expect(errorOf({ ...valid, time: "abc" })).toBe(INVALID_TIME);
      expect(errorOf({ ...valid, time: null })).toBe(INVALID_TIME);
    });

    it("会議室は開始〜終了が必要で、終了は開始より後", () => {
      const meeting = { ...valid, type: "meeting" };
      expect(parseWebReservation({ ...meeting, time: "10:00-13:00" }, now)).toMatchObject({
        ok: true,
        value: { time: "10:00-13:00" },
      });
      expect(errorOf({ ...meeting, time: "10:00" })).toBe(INVALID_TIME);
      expect(errorOf({ ...meeting, time: "13:00-10:00" })).toBe(INVALID_TIME);
      expect(errorOf({ ...meeting, time: "17:00-19:00" })).toBe(INVALID_TIME);
    });

    it("貸切は終日なので、時間が届いても持たない", () => {
      expect(parseWebReservation({ ...valid, type: "private", time: "10:00" }, now)).toMatchObject({
        ok: true,
        value: { time: null },
      });
    });
  });
});
