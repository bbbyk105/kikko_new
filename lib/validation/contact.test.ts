import { inquiryTypeLabel, validateContact } from "@/lib/validation/contact";

const valid = {
  name: " 山田 太郎 ",
  email: " taro@example.com ",
  phone: undefined,
  inquiryType: "general",
  message: " 見学したいです ",
};

describe("validateContact", () => {
  it("正しい入力は前後の空白を除いて通す", () => {
    const result = validateContact(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("山田 太郎");
      expect(result.data.email).toBe("taro@example.com");
      expect(result.data.message).toBe("見学したいです");
    }
  });

  it("未入力の項目ごとにメッセージを返す", () => {
    const result = validateContact({ name: "", email: "", inquiryType: "", message: " " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toEqual({
        name: "お名前を入力してください",
        email: "メールアドレスを入力してください",
        inquiryType: "お問い合わせ種別を選択してください",
        message: "お問い合わせ内容を入力してください",
      });
    }
  });

  it("メールの形式が不正なら形式エラー", () => {
    const result = validateContact({ ...valid, email: "taro@" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.email).toBe("正しいメールアドレスを入力してください");
    }
  });
});

describe("inquiryTypeLabel", () => {
  it("種別の表示名、不明な値はそのまま", () => {
    expect(inquiryTypeLabel("corporate")).toBe("法人契約について");
    expect(inquiryTypeLabel("xxx")).toBe("xxx");
  });
});
