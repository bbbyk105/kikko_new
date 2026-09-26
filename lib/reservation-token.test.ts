import { signReservationId, verifyReservationToken } from "@/lib/reservation-token";

const SECRET = "test-secret";
const ID = "3f2b6c1e-8d4a-4f7b-9c2e-1a5d7e9b0c34";
const OTHER_ID = "3f2b6c1e-8d4a-4f7b-9c2e-1a5d7e9b0c35";

describe("verifyReservationToken", () => {
  it("同じ秘密鍵で署名した id と t は通る", () => {
    const token = signReservationId(ID, SECRET);
    expect(verifyReservationToken(ID, token, SECRET)).toBe(true);
  });

  it("URL にそのまま載せられる文字だけで作る", () => {
    expect(signReservationId(ID, SECRET)).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("別の予約の署名・書き換えた署名・別の秘密鍵は通らない", () => {
    const token = signReservationId(ID, SECRET);
    expect(verifyReservationToken(OTHER_ID, token, SECRET)).toBe(false);
    expect(verifyReservationToken(ID, `${token.slice(0, -1)}A`, SECRET)).toBe(false);
    expect(verifyReservationToken(ID, token.slice(0, -1), SECRET)).toBe(false);
    expect(verifyReservationToken(ID, token, "other-secret")).toBe(false);
  });

  it("id が UUID でない・署名や秘密鍵が空なら通らない", () => {
    expect(verifyReservationToken("1", signReservationId("1", SECRET), SECRET)).toBe(false);
    expect(verifyReservationToken(ID, "", SECRET)).toBe(false);
    expect(verifyReservationToken(ID, signReservationId(ID, ""), "")).toBe(false);
  });
});
