import {
  cancellationAdminMail,
  cancellationCustomerMail,
  loginLinkMail,
  manageLinkLines,
  reservationReceivedCustomerMail,
  storeNoticeMail,
} from "@/lib/email/reservation-mail";
import type { ManagedReservation } from "@/lib/reservation-manage";

const reservation: ManagedReservation = {
  id: "3f2b6c1e-8d4a-4f7b-9c2e-1a5d7e9b0c34",
  name: "山田 太郎",
  typeLabel: "貸切利用",
  dateLabel: "2026年10月3日(土)",
  timeLabel: "終日貸切（9:00〜18:00）",
  peopleCount: 30,
  status: "pending",
  statusLabel: "確認中",
  cancelState: "cancellable",
  cancelDeadlineLabel: "10月2日(金) 17:00",
};

const LINKS = {
  manageUrl: "https://worxmtfuji.com/reserve/manage?id=abc&t=xyz",
  mypageUrl: "https://worxmtfuji.com/mypage",
};

describe("manageLinkLines", () => {
  it("予約確認リンク・キャンセル締切・マイページを載せる", () => {
    const text = manageLinkLines(LINKS, reservation.cancelDeadlineLabel).join("\n");
    expect(text).toContain(LINKS.manageUrl);
    expect(text).toContain("10月2日(金) 17:00 まで");
    expect(text).toContain(LINKS.mypageUrl);
  });
});

describe("reservationReceivedCustomerMail", () => {
  const input = {
    type: "meeting",
    date: "2026-10-03",
    time: "10:00-13:00",
    peopleCount: null,
    name: "山田 太郎",
    email: "taro@example.com",
    phone: null,
    message: "プロジェクターを使いたいです",
  };

  it("利用種別を日本語で出し、確認・キャンセルのリンクと締切を載せる", () => {
    const { text } = reservationReceivedCustomerMail(input, reservation.id, LINKS);
    expect(text).toContain("利用種別: 会議室予約");
    expect(text).toContain(LINKS.manageUrl);
    expect(text).toContain("10月2日(金) 17:00 まで");
    expect(text).not.toContain("人数");
  });

  it("リンクを発行できないときは案内ごと出さない", () => {
    const { text } = reservationReceivedCustomerMail(input, reservation.id, null);
    expect(text).not.toContain("ご予約の確認・キャンセル");
    expect(text).toContain("TEL 0545-67-7400");
  });

  it("署名は正式名称", () => {
    const { text } = reservationReceivedCustomerMail(input, reservation.id, null);
    expect(text).toContain("worx mt.fuji 橘香堂（近藤薬局）\n静岡県富士市吉原2丁目8番21-2号");
  });
});

describe("cancellationCustomerMail", () => {
  it("予約内容と人数を載せる", () => {
    const { subject, text } = cancellationCustomerMail(reservation);
    expect(subject).toContain("キャンセル");
    expect(text).toContain("山田 太郎 様");
    expect(text).toContain("利用日: 2026年10月3日(土)");
    expect(text).toContain("人数: 30名");
  });
  it("人数がなければ人数の行を出さない", () => {
    const { text } = cancellationCustomerMail({ ...reservation, peopleCount: null });
    expect(text).not.toContain("人数");
  });
});

describe("cancellationAdminMail", () => {
  it("連絡先とキャンセル日時（日本時間）を載せる", () => {
    const { subject, text } = cancellationAdminMail(
      reservation,
      { email: "taro@example.com", phone: null },
      new Date("2026-10-01T03:00:00Z"),
    );
    expect(subject).toContain("山田 太郎 様");
    expect(text).toContain("メール: taro@example.com");
    expect(text).toContain("電話番号: （未入力）");
    expect(text).toContain("2026/10/1 12:00:00");
  });
});

describe("loginLinkMail", () => {
  it("リンクと有効期限を載せる", () => {
    const { subject, text } = loginLinkMail("https://worxmtfuji.com/mypage?login=abc", 30);
    expect(subject).toContain("ログイン");
    expect(text).toContain("https://worxmtfuji.com/mypage?login=abc");
    expect(text).toContain("有効期限は30分");
  });
});

describe("storeNoticeMail", () => {
  it("確定のお知らせにはステータスと確認・キャンセルのリンクを載せる", () => {
    const { subject, text } = storeNoticeMail(
      "confirmed",
      { ...reservation, status: "confirmed", statusLabel: "予約確定" },
      LINKS,
    );
    expect(subject).toContain("ご予約が確定しました");
    expect(text).toContain("ステータス: 予約確定");
    expect(text).toContain(LINKS.manageUrl);
  });

  it("店側のキャンセルにはリンクを載せない", () => {
    const { subject, text } = storeNoticeMail(
      "cancelled",
      { ...reservation, status: "cancelled", statusLabel: "キャンセル済み", cancelState: "cancelled" },
      LINKS,
    );
    expect(subject).toContain("キャンセル");
    expect(text).not.toContain(LINKS.manageUrl);
    expect(text).not.toContain("ステータス");
  });

  it("Web キャンセルの締切を過ぎた予約の変更にはキャンセル案内を載せない", () => {
    const { text } = storeNoticeMail("changed", { ...reservation, cancelState: "closed" }, LINKS);
    expect(text).toContain("変更いたしました");
    expect(text).not.toContain(LINKS.manageUrl);
  });
});
