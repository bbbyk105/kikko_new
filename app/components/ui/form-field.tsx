import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 入力欄の共通スタイル。エラー時は枠を赤にする */
export function fieldClassName(invalid?: boolean, className?: string) {
  return cn(
    "w-full px-4 py-3 bg-white border text-[#2C2C2C] placeholder-[#B0B0B0] focus:outline-none focus:border-[#5C6B5C] transition-colors",
    invalid ? "border-[#B85C5C]" : "border-[#E5E4DF]",
    className,
  );
}

/** 入力欄に付けるアクセシビリティ属性（エラー文と紐づける） */
export function fieldA11yProps(id: string, error?: string) {
  return {
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : undefined,
  };
}

interface FormFieldProps {
  id: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}

/** ラベル・必須マーク・補足・エラー文をまとめた入力項目 */
export function FormField({ id, label, required, error, hint, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-[#2C2C2C] mb-2">
        {label}
        {required && (
          <>
            {" "}
            <span className="text-[#B85C5C]">*</span>
          </>
        )}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-[#8A8A8A]">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-[#B85C5C]">
          {error}
        </p>
      )}
    </div>
  );
}
