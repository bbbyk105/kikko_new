import { z } from "zod";

/** お問い合わせ種別（フォームの選択肢とメール本文のラベルで共用） */
export const inquiryTypeOptions = [
  { value: "general", label: "一般的なご質問" },
  { value: "membership", label: "会員登録について" },
  { value: "corporate", label: "法人契約について" },
  { value: "address", label: "住所登録について" },
  { value: "event", label: "イベント利用について" },
  { value: "other", label: "その他" },
] as const;

type InquiryType = (typeof inquiryTypeOptions)[number]["value"];

const inquiryTypeValues = inquiryTypeOptions.map((o) => o.value) as [
  InquiryType,
  ...InquiryType[],
];

/** クライアントの入力チェックとサーバーアクションで同じスキーマを使う */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "お名前を入力してください"),
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください")
    .email("正しいメールアドレスを入力してください"),
  phone: z.string().optional(),
  inquiryType: z.enum(inquiryTypeValues, {
    message: "お問い合わせ種別を選択してください",
  }),
  message: z.string().trim().min(1, "お問い合わせ内容を入力してください"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactField = keyof ContactInput;

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export function inquiryTypeLabel(value: string): string {
  return inquiryTypeOptions.find((o) => o.value === value)?.label ?? value;
}

/** 入力値を検証し、項目ごとの最初のエラーメッセージを返す */
export function validateContact(
  values: unknown,
):
  | { success: true; data: ContactInput }
  | { success: false; errors: ContactFieldErrors } {
  const parsed = contactSchema.safeParse(values);
  if (parsed.success) return { success: true, data: parsed.data };

  const errors: ContactFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as ContactField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return { success: false, errors };
}
