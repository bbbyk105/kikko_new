import { Resend } from "resend";

export type ResendSendParams = {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
};

export type ResendSendResult =
  | { ok: true; id: string }
  | {
      ok: false;
      reason: "missing_api_key" | "api_error";
      message?: string;
    };

/**
 * Resend でメール送信。RESEND_API_KEY が無い場合は missing_api_key を返す。
 */
export async function sendResendEmail(
  params: ResendSendParams,
): Promise<ResendSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: "missing_api_key" };
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: params.from,
    to: params.to,
    subject: params.subject,
    text: params.text,
    replyTo: params.replyTo,
    tags: params.tags,
  });

  if (error) {
    console.error("Resend error:", error);
    return {
      ok: false,
      reason: "api_error",
      message: error.message,
    };
  }

  return { ok: true, id: data.id };
}
