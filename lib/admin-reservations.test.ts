import {
  adminReservationSchema,
  filterReservations,
  groupByDate,
  summarize,
  toAdminReservation,
  type AdminReservation,
} from "@/lib/admin-reservations";
import type { Reservation } from "@/lib/supabase";

const jst = (iso: string) => new Date(`${iso}+09:00`);

const row = (overrides: Partial<Reservation>): Reservation => ({
  id: "3f2b6c1e-8d4a-4f7b-9c2e-1a5d7e9b0c34",
  created_at: "2026-09-26T01:23:00Z",
  type: "visitor",
  date: "2026-10-03",
  time: "10:00",
  people_count: null,
  name: "山田 太郎",
  email: "taro@example.com",
  phone: "090-1234-5678",
  message: null,
  status: "pending",
  ...overrides,
});

describe("toAdminReservation", () => {
  it("受付日時を日本時間で、種別・時間・ステータスを日本語で出す", () => {
    const r = toAdminReservation(row({ type: "meeting", time: "10:00-13:00", status: "confirmed" }));
    expect(r.createdAtLabel).toBe("2026/09/26 10:23");
    expect(r.typeLabel).toBe("会議室予約");
    expect(r.timeLabel).toBe("10:00〜13:00");
    expect(r.statusLabel).toBe("予約確定");
  });
});

describe("groupByDate", () => {
  it("日付の並びは受け取った順、同じ日の中は終日→時刻順", () => {
    const list = [
      row({ id: "a", date: "2026-10-03", time: "14:00" }),
      row({ id: "b", date: "2026-10-01", time: "09:00" }),
      row({ id: "c", date: "2026-10-03", time: "09:00-11:00", type: "meeting" }),
      row({ id: "d", date: "2026-10-03", time: null, type: "private" }),
    ].map(toAdminReservation);
    const groups = groupByDate(list);
    expect(groups.map((g) => g.date)).toEqual(["2026-10-03", "2026-10-01"]);
    expect(groups[0].items.map((r) => r.id)).toEqual(["d", "c", "a"]);
  });
});

describe("summarize", () => {
  it("今日・7日間・確認待ちを数え、過去とキャンセルは除く", () => {
    const now = jst("2026-10-01T12:00:00");
    const summary = summarize(
      [
        { date: "2026-10-01", status: "confirmed" },
        { date: "2026-10-01", status: "cancelled" },
        { date: "2026-10-07", status: "pending" },
        { date: "2026-10-08", status: "pending" },
        { date: "2026-09-30", status: "pending" },
      ],
      now,
    );
    expect(summary).toEqual({ today: 1, next7Days: 2, pending: 2 });
  });
});

describe("filterReservations", () => {
  const list: AdminReservation[] = [
    row({ id: "a1", name: "山田 太郎", email: "taro@example.com", phone: "090-1234-5678" }),
    row({ id: "b2", name: "佐藤 花子", email: "hanako@example.com", phone: null, type: "meeting", time: "10:00-11:00" }),
  ].map(toAdminReservation);

  it("名前・メール・電話番号（ハイフンなし）・受付番号で探せる", () => {
    expect(filterReservations(list, { query: "佐藤", type: "" }).map((r) => r.id)).toEqual(["b2"]);
    expect(filterReservations(list, { query: "TARO@", type: "" }).map((r) => r.id)).toEqual(["a1"]);
    expect(filterReservations(list, { query: "09012345678", type: "" }).map((r) => r.id)).toEqual(["a1"]);
    expect(filterReservations(list, { query: "b2", type: "" }).map((r) => r.id)).toEqual(["b2"]);
  });
  it("店内メモでも探せる", () => {
    const withNote = [toAdminReservation(row({ id: "n1", staff_note: "プロジェクター使用" })), ...list];
    expect(filterReservations(withNote, { query: "プロジェクター", type: "" }).map((r) => r.id)).toEqual(["n1"]);
    expect(withNote[1].staffNote).toBeNull();
  });
  it("種別で絞り込める", () => {
    expect(filterReservations(list, { query: "", type: "meeting" }).map((r) => r.id)).toEqual(["b2"]);
  });
});

describe("adminReservationSchema", () => {
  const base = {
    type: "meeting",
    date: "2026-10-03",
    time: "10:00-12:00",
    peopleCount: null,
    name: " 山田 太郎 ",
    email: "",
    phone: "",
    message: "",
    status: "confirmed",
  } as const;

  it("空欄は null に、メールアドレスなし（電話予約）も通す", () => {
    const parsed = adminReservationSchema.parse(base);
    expect(parsed.name).toBe("山田 太郎");
    expect(parsed.email).toBe("");
    expect(parsed.phone).toBeNull();
  });
  it("貸切は時間を持たない", () => {
    expect(adminReservationSchema.parse({ ...base, type: "private", time: "10:00" }).time).toBeNull();
  });
  it("会議室は開始〜終了が必要", () => {
    expect(adminReservationSchema.safeParse({ ...base, time: "10:00" }).success).toBe(false);
  });
  it("メールアドレスの形式・お名前の空欄はエラー", () => {
    expect(adminReservationSchema.safeParse({ ...base, email: "abc" }).success).toBe(false);
    expect(adminReservationSchema.safeParse({ ...base, name: " " }).success).toBe(false);
  });
});
