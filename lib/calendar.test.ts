import { buildMonthGrid, toMonthKey } from "@/lib/calendar";
import { toggleOpenItems } from "@/lib/accordion";

describe("buildMonthGrid", () => {
  it("前後の週を含む日曜始まりのグリッドを作る", () => {
    // 2026年9月: 1日は火曜、30日は水曜
    const grid = buildMonthGrid("2026-09");
    expect(grid.rangeStart).toBe("2026-08-30");
    expect(grid.rangeEnd).toBe("2026-10-03");
    expect(grid.days).toHaveLength(35);
    expect(grid.days[0].getDay()).toBe(0);
    expect(toMonthKey(grid.monthAnchor)).toBe("2026-09");
  });
});

describe("toggleOpenItems", () => {
  it("single は1つだけ開き、同じものを押すと閉じる", () => {
    expect(toggleOpenItems(["a"], "b", "single")).toEqual(["b"]);
    expect(toggleOpenItems(["a"], "a", "single")).toEqual([]);
  });
  it("multiple は追加・削除する", () => {
    expect(toggleOpenItems(["a"], "b", "multiple")).toEqual(["a", "b"]);
    expect(toggleOpenItems(["a", "b"], "a", "multiple")).toEqual(["b"]);
  });
});
