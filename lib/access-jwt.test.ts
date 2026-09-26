import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from "jose";
import {
  normalizeTeamDomain,
  parseAllowedEmails,
  verifyAccessToken,
  type AccessConfig,
} from "@/lib/access-jwt";

const config: AccessConfig = {
  teamDomain: "https://kikko.cloudflareaccess.com",
  audience: "aud-tag",
  allowedEmails: ["owner@example.com"],
};

async function setup() {
  const { privateKey, publicKey } = await generateKeyPair("RS256");
  const jwk = { ...(await exportJWK(publicKey)), kid: "k1", alg: "RS256" };
  const keys = createLocalJWKSet({ keys: [jwk] });
  const sign = (claims: Record<string, unknown>, options: { iss?: string; aud?: string; exp?: string } = {}) =>
    new SignJWT(claims)
      .setProtectedHeader({ alg: "RS256", kid: "k1" })
      .setIssuer(options.iss ?? config.teamDomain)
      .setAudience(options.aud ?? config.audience)
      .setIssuedAt()
      .setExpirationTime(options.exp ?? "10m")
      .sign(privateKey);
  return { keys, sign };
}

describe("verifyAccessToken", () => {
  it("正しい署名・発行元・AUD で、許可されたメールアドレスなら返す（小文字にそろえる）", async () => {
    const { keys, sign } = await setup();
    const token = await sign({ email: "Owner@Example.com" });
    await expect(verifyAccessToken(token, config, keys)).resolves.toBe("owner@example.com");
  });

  it("許可されていないメールアドレスは null", async () => {
    const { keys, sign } = await setup();
    const token = await sign({ email: "someone@example.com" });
    await expect(verifyAccessToken(token, config, keys)).resolves.toBeNull();
  });

  it("別の AUD・発行元・期限切れ・改ざん・別の鍵は null", async () => {
    const { keys, sign } = await setup();
    const other = await setup();
    await expect(verifyAccessToken(await sign({ email: "owner@example.com" }, { aud: "other" }), config, keys)).resolves.toBeNull();
    await expect(
      verifyAccessToken(await sign({ email: "owner@example.com" }, { iss: "https://evil.cloudflareaccess.com" }), config, keys),
    ).resolves.toBeNull();
    await expect(verifyAccessToken(await sign({ email: "owner@example.com" }, { exp: "-1m" }), config, keys)).resolves.toBeNull();

    const token = await sign({ email: "owner@example.com" });
    const [header, , signature] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ email: "owner@example.com", aud: config.audience, iss: config.teamDomain, exp: 9999999999 })).toString("base64url");
    await expect(verifyAccessToken(`${header}.${forged}.${signature}`, config, keys)).resolves.toBeNull();
    await expect(verifyAccessToken(await other.sign({ email: "owner@example.com" }), config, keys)).resolves.toBeNull();
    await expect(verifyAccessToken("not-a-jwt", config, keys)).resolves.toBeNull();
  });

  it("署名なし（alg: none）は null", async () => {
    const { keys } = await setup();
    const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
    const unsigned = `${encode({ alg: "none", kid: "k1" })}.${encode({ email: "owner@example.com", aud: config.audience, iss: config.teamDomain, exp: 9999999999 })}.`;
    await expect(verifyAccessToken(unsigned, config, keys)).resolves.toBeNull();
  });
});

describe("normalizeTeamDomain / parseAllowedEmails", () => {
  it("チームドメインを https:// 付き・末尾スラッシュなしにそろえる", () => {
    expect(normalizeTeamDomain("kikko.cloudflareaccess.com")).toBe("https://kikko.cloudflareaccess.com");
    expect(normalizeTeamDomain("https://kikko.cloudflareaccess.com/")).toBe("https://kikko.cloudflareaccess.com");
  });
  it("カンマ区切りのメールアドレスを小文字の配列にする", () => {
    expect(parseAllowedEmails(" A@example.com, b@example.com ,")).toEqual(["a@example.com", "b@example.com"]);
    expect(parseAllowedEmails(undefined)).toEqual([]);
  });
});
