import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { submitContactInquiry } from "@/app/actions/contact";
import {
  validateContact,
  type ContactField,
  type ContactFieldErrors,
} from "@/lib/validation/contact";

export type ContactFormValues = Record<ContactField, string>;

const EMPTY_VALUES: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  inquiryType: "",
  message: "",
};

/**
 * お問い合わせフォームの入力・検証・送信の状態。
 * initialInquiryType を渡すと、種別を選んだ状態で始める（送信後のリセットでは空に戻す）。
 */
export function useContactForm(
  initialInquiryType: string | undefined,
  human: { token: string | null; reset: () => void },
) {
  const [values, setValues] = useState<ContactFormValues>({
    ...EMPTY_VALUES,
    inquiryType: initialInquiryType ?? "",
  });
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const name = e.target.name as ContactField;
      const { value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      // 入力し直した項目のエラーだけ消す
      setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const result = validateContact({ ...values, phone: values.phone.trim() || undefined });
      if (!result.success) {
        setErrors(result.errors);
        return;
      }

      setErrors({});
      setIsSubmitting(true);
      setSubmitError(null);

      const res = await submitContactInquiry(result.data, human.token);
      setIsSubmitting(false);
      // ボット対策のトークンは1回しか使えないので、次の送信に備えて取り直す
      human.reset();

      if (!res.success) {
        setSubmitError(res.error);
        return;
      }
      setIsSubmitted(true);
    },
    [values, human],
  );

  const reset = useCallback(() => {
    setIsSubmitted(false);
    setValues(EMPTY_VALUES);
  }, []);

  return {
    values,
    errors,
    submitError,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit,
    reset,
  };
}
