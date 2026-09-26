import {
  earlierWebBookingConflicts,
  findConflicts,
  findWebBookingConflicts,
} from "@/lib/reservation-conflicts";

const candidates = [
  { id: "m1", type: "meeting", date: "2026-10-03", time: "10:00-12:00", name: "A" },
  { id: "v1", type: "visitor", date: "2026-10-03", time: "10:00", name: "B" },
  { id: "m2", type: "meeting", date: "2026-10-04", time: "10:00-12:00", name: "C" },
];
const withPrivate = [...candidates, { id: "p1", type: "private", date: "2026-10-04", time: null, name: "D" }];

describe("findConflicts（管理画面）", () => {
  it("会議室は時間帯が重なる会議室の予約だけ", () => {
    expect(findConflicts({ type: "meeting", date: "2026-10-03", time: "11:00-13:00" }, candidates).map((c) => c.id)).toEqual(["m1"]);
    expect(findConflicts({ type: "meeting", date: "2026-10-03", time: "12:00-13:00" }, candidates)).toEqual([]);
  });
  it("貸切は同じ日のすべての予約と重なる", () => {
    expect(findConflicts({ type: "private", date: "2026-10-03", time: null }, candidates).map((c) => c.id)).toEqual(["m1", "v1"]);
  });
  it("貸切の日にはほかの予約を入れられない", () => {
    expect(findConflicts({ type: "visitor", date: "2026-10-04", time: "09:00" }, withPrivate).map((c) => c.id)).toEqual(["p1"]);
  });
});

describe("findWebBookingConflicts（Web の予約フォーム）", () => {
  it("会議室は時間帯が重なる会議室の予約があると受け付けない", () => {
    expect(findWebBookingConflicts({ type: "meeting", date: "2026-10-03", time: "11:00-13:00" }, candidates).map((c) => c.id)).toEqual(["m1"]);
    expect(findWebBookingConflicts({ type: "meeting", date: "2026-10-03", time: "12:00-13:00" }, candidates)).toEqual([]);
  });
  it("貸切は会議室の予約がある日だけ受け付けない（ビジターは妨げない。カレンダーと同じ）", () => {
    expect(findWebBookingConflicts({ type: "private", date: "2026-10-03", time: null }, candidates).map((c) => c.id)).toEqual(["m1"]);
    const visitorsOnly = candidates.filter((c) => c.type === "visitor");
    expect(findWebBookingConflicts({ type: "private", date: "2026-10-03", time: null }, visitorsOnly)).toEqual([]);
  });
  it("貸切の日はどの種別も受け付けない", () => {
    expect(findWebBookingConflicts({ type: "visitor", date: "2026-10-04", time: "09:00" }, withPrivate).map((c) => c.id)).toEqual(["p1"]);
    expect(findWebBookingConflicts({ type: "private", date: "2026-10-04", time: null }, withPrivate).map((c) => c.id)).toEqual(["m2", "p1"]);
  });
  it("ビジターは、ビジター同士とも同じ時間の会議室（個室）とも重ならない", () => {
    expect(findWebBookingConflicts({ type: "visitor", date: "2026-10-03", time: "10:00" }, candidates)).toEqual([]);
  });
});

describe("earlierWebBookingConflicts（ほぼ同時の予約）", () => {
  const mine = { id: "b", type: "meeting", date: "2026-10-03", time: "10:00-11:00", created_at: "2026-09-26T01:00:00.500Z" };

  it("先に入った重なる予約があれば、後から入った自分は取り消す対象", () => {
    const others = [{ id: "a", type: "meeting", date: "2026-10-03", time: "10:00-12:00", name: "先客", created_at: "2026-09-26T01:00:00.100Z" }];
    expect(earlierWebBookingConflicts(mine, others).map((c) => c.id)).toEqual(["a"]);
  });
  it("自分より後に入った予約とは比べない（そちらが取り消す）", () => {
    const others = [{ id: "c", type: "meeting", date: "2026-10-03", time: "10:00-12:00", name: "後客", created_at: "2026-09-26T01:00:00.900Z" }];
    expect(earlierWebBookingConflicts(mine, others)).toEqual([]);
  });
  it("まったく同時なら id の小さい方を残す", () => {
    const same = [{ id: "a", type: "meeting", date: "2026-10-03", time: "10:00-11:00", name: "同時", created_at: mine.created_at }];
    expect(earlierWebBookingConflicts(mine, same).map((c) => c.id)).toEqual(["a"]);
    expect(earlierWebBookingConflicts({ ...mine, id: "0" }, same)).toEqual([]);
  });
  it("自分自身は比べない", () => {
    expect(earlierWebBookingConflicts(mine, [{ ...mine, name: "自分" }])).toEqual([]);
  });
});
