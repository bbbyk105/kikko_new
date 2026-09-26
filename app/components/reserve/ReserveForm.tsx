"use client";

import { useCallback, useState, type ReactNode } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { reserveData } from "@/app/data/site";
import { createReservation } from "@/app/actions/reservation";
import type { CustomerProfile } from "@/app/actions/customer";
import { useCustomerPrefill } from "@/app/hooks/use-customer-prefill";
import { useReserveSteps } from "@/app/hooks/use-reserve-steps";
import {
  bookingModeOf,
  buildReservationInput,
  formatSelectedTime,
  isDateTimeReady,
  reserveTypeLabel,
} from "@/lib/reserve-flow";
import type { BookingMode } from "@/lib/reservation-time";
import type { ReserveType } from "@/lib/routes";
import { FormField, fieldA11yProps, fieldClassName } from "@/app/components/ui/form-field";
import { Turnstile, TurnstileFailedNotice, useTurnstile } from "@/app/components/ui/turnstile";
import ReserveCalendar from "./ReserveCalendar";
import ReserveSummary from "./ReserveSummary";
import ReserveComplete from "./ReserveComplete";
import ReserveStepIndicator from "./ReserveStepIndicator";
import ReserveTypeStep from "./ReserveTypeStep";
import { primaryButtonClass, secondaryButtonClass } from "./buttons";

const reserveSchema = z.object({
  name: z.string().min(1, "お名前を入力してください"),
  email: z.string().email("正しいメールアドレスを入力してください"),
  phone: z.string().optional(),
  type: z.string().min(1, "利用種別を選択してください"),
  numberOfPeople: z.string().optional(),
  message: z.string().min(1, "お問い合わせ内容を入力してください"),
});

type ReserveFormData = z.infer<typeof reserveSchema>;

const CALENDAR_COPY: Record<BookingMode, { title: string; description: string }> = {
  private: {
    title: "ご希望の日付を選択",
    description: "貸切利用の日付をお選びください（9:00〜18:00の終日利用）",
  },
  meeting: {
    title: "ご希望の日時を選択（会議室）",
    description:
      "カレンダーで日付を選び、利用時間帯（開始〜終了）を指定してください。例: 10:00〜13:00",
  },
  visitor: {
    title: "ご希望の日時を選択",
    description: "カレンダーから日付を選び、時間帯をお選びください",
  },
};

interface ReserveFormProps {
  /** 入力ステップ左側の営業時間・電話番号（Server Component で描画して渡す） */
  contactInfo: ReactNode;
  /** 料金プランなどから ?type= 付きで来たときの利用種別（日時選択から始める） */
  initialType?: ReserveType;
}

export default function ReserveForm({ contactInfo, initialType }: ReserveFormProps) {
  const [selectedType, setSelectedType] = useState<string>(initialType ?? "");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const human = useTurnstile();

  const mode = bookingModeOf(selectedType);
  const isPrivateBooking = mode === "private";
  const needsPeople =
    reserveData.types.find((t) => t.value === selectedType)?.requiresPeople ?? false;
  const typeLabel = reserveTypeLabel(selectedType);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm<ReserveFormData>({
    resolver: zodResolver(reserveSchema),
    defaultValues: { type: initialType ?? "" },
  });

  // マイページにログイン中なら、空欄のお名前・メールアドレス・電話番号を埋める
  const applyProfile = useCallback(
    (profile: CustomerProfile) => {
      const fill = (field: "name" | "email" | "phone", value: string | null) => {
        if (value && !getValues(field)) setValue(field, value);
      };
      fill("name", profile.name);
      fill("email", profile.email);
      fill("phone", profile.phone);
    },
    [getValues, setValue],
  );
  useCustomerPrefill(applyProfile);

  const dateTimeReady = isDateTimeReady({ date: selectedDate, time: selectedTime, mode });
  const steps = useReserveSteps({
    initialStep: initialType ? "calendar" : "type",
    hasType: !!selectedType,
    dateTimeReady,
    validateForm: trigger,
  });

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setValue("type", type);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  };

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      if (!isPrivateBooking) setSelectedTime(undefined);
    },
    [isPrivateBooking],
  );

  const handleTimeSelect = useCallback((time: string | undefined) => {
    setSelectedTime(time);
  }, []);

  const onSubmit = async (data: ReserveFormData) => {
    if (steps.step === "form") {
      steps.setStep("confirm");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const result = await createReservation(
      buildReservationInput(data, { date: selectedDate, time: selectedTime, mode }),
      human.token,
    );

    setIsSubmitting(false);
    // ボット対策のトークンは1回しか使えないので、次の送信に備えて取り直す
    human.reset();

    if (result.success) {
      steps.setStep("complete");
    } else {
      setSubmitError(result.error || "予約の送信に失敗しました。");
    }
  };

  const handleReset = () => {
    reset({ type: "" });
    setSelectedType("");
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    steps.setStep("type");
  };

  const selectedDateLabel = selectedDate
    ? format(selectedDate, "yyyy年M月d日(E)", { locale: ja })
    : "";

  const stepIndicator = (
    <ReserveStepIndicator
      currentNumber={steps.currentNumber}
      canNavigate={steps.canNavigate}
      onNavigate={steps.navigate}
    />
  );

  if (steps.step === "complete") {
    return (
      <div>
        <ReserveComplete onReset={handleReset} />
      </div>
    );
  }

  if (steps.step === "confirm") {
    // 確認画面では入力が変わらないので、watch で毎キー再描画せず送信時点の値を読む
    const formData = getValues();
    return (
      <div className="space-y-12">
        {stepIndicator}
        <ReserveSummary
          data={{
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            type: reserveTypeLabel(formData.type),
            date: selectedDateLabel,
            time: formatSelectedTime(mode, selectedTime),
            numberOfPeople: formData.numberOfPeople,
            message: formData.message,
          }}
          onBack={steps.back}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          error={submitError}
          canSubmit={human.ready}
          beforeSubmit={
            <>
              <Turnstile action="reserve" {...human.widgetProps} />
              {human.failed && <TurnstileFailedNotice />}
            </>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {stepIndicator}

      {/* Step 1: Type Selection */}
      {steps.step === "type" && (
        <ReserveTypeStep
          selectedType={selectedType}
          onSelect={handleTypeSelect}
          onNext={() => selectedType && steps.setStep("calendar")}
        />
      )}

      {/* Step 2: Calendar */}
      {steps.step === "calendar" && (
        <>
          <div>
            <div className="text-center mb-8">
              <h3 className="font-[var(--font-cormorant)] text-2xl text-[#2C2C2C] mb-2">
                {CALENDAR_COPY[mode].title}
              </h3>
              <p className="text-sm text-[#6B6B6B]">{CALENDAR_COPY[mode].description}</p>
              <p className="mt-2 text-sm text-[#5C6B5C]">
                利用種別: {typeLabel}
                <button
                  type="button"
                  onClick={steps.back}
                  className="ml-3 text-[#6B6B6B] hover:text-[#2C2C2C] underline"
                >
                  変更
                </button>
              </p>
            </div>

            <ReserveCalendar
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectDate={handleDateSelect}
              onSelectTime={handleTimeSelect}
              mode={mode}
            />
          </div>

          {/* 「戻る」と「次へ進む」は長いほうの文字幅に合わせて同じ幅にする */}
          <div className="mx-auto grid w-fit grid-flow-col auto-cols-fr gap-4">
            <button type="button" onClick={steps.back} className={secondaryButtonClass}>
              戻る
            </button>
            <button
              type="button"
              onClick={() => dateTimeReady && steps.setStep("form")}
              disabled={!dateTimeReady}
              className={primaryButtonClass}
            >
              次へ進む
            </button>
          </div>
        </>
      )}

      {/* Step 3: Form */}
      {steps.step === "form" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: Info */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium text-[#2C2C2C] mb-6">ご予約内容</h3>

            {/* Selected Info */}
            <div className="bg-white border border-[#E5E4DF] p-4 mb-6 space-y-3">
              <div>
                <p className="text-xs text-[#6B6B6B]">利用種別</p>
                <p className="text-[#2C2C2C] font-medium">{typeLabel}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B6B6B]">日時</p>
                <p className="text-[#2C2C2C] font-medium">{selectedDateLabel}</p>
                <p className="text-[#2C2C2C]">{formatSelectedTime(mode, selectedTime)}</p>
              </div>
              <button
                type="button"
                onClick={() => steps.setStep("calendar")}
                className="text-sm text-[#5C6B5C] hover:underline"
              >
                日時を変更する
              </button>
            </div>

            {isPrivateBooking && (
              <div className="bg-[#F7F6F3] p-4 mb-6">
                <p className="text-sm text-[#2C2C2C] font-medium mb-2">貸切利用について</p>
                <ul className="text-xs text-[#6B6B6B] space-y-1">
                  <li>• 9:00〜18:00の終日利用となります</li>
                  <li>• 着席最大80名 / スタンディング最大150名</li>
                  <li>• 料金は人数・利用内容により異なります</li>
                  <li>• 詳細は担当者よりご連絡いたします</li>
                </ul>
              </div>
            )}

            {contactInfo}
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <input type="hidden" {...register("type")} />

              <FormField id="name" label="お名前" required error={errors.name?.message}>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={fieldClassName(!!errors.name)}
                  placeholder="山田 太郎"
                  {...fieldA11yProps("name", errors.name?.message)}
                />
              </FormField>

              <FormField id="email" label="メールアドレス" required error={errors.email?.message}>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={fieldClassName(!!errors.email)}
                  placeholder="example@email.com"
                  {...fieldA11yProps("email", errors.email?.message)}
                />
              </FormField>

              <FormField id="phone" label="電話番号">
                <input
                  type="tel"
                  id="phone"
                  {...register("phone")}
                  className={fieldClassName()}
                  placeholder="090-1234-5678"
                />
              </FormField>

              {/* 人数 - 貸切・イベント利用の場合のみ */}
              {needsPeople && (
                <FormField
                  id="numberOfPeople"
                  label="人数"
                  required
                  hint="着席最大80名 / スタンディング最大150名"
                >
                  <input
                    type="text"
                    id="numberOfPeople"
                    {...register("numberOfPeople")}
                    className={fieldClassName()}
                    placeholder="例: 30名"
                  />
                </FormField>
              )}

              <FormField
                id="message"
                label={needsPeople ? "利用目的・ご要望" : "お問い合わせ内容・備考"}
                required
                error={errors.message?.message}
              >
                <textarea
                  id="message"
                  {...register("message")}
                  rows={4}
                  className={fieldClassName(!!errors.message, "resize-none")}
                  placeholder={
                    isPrivateBooking
                      ? "イベントの内容、必要な設備、レイアウトのご希望などをご記入ください。"
                      : "ご希望やご質問があればご記入ください。"
                  }
                  {...fieldA11yProps("message", errors.message?.message)}
                />
              </FormField>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={steps.back}
                  className="flex-1 py-4 text-sm tracking-wider text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAFAF8] transition-colors"
                >
                  戻る
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 text-sm tracking-wider text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] transition-colors"
                >
                  入力内容を確認する
                </button>
              </div>

              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                ご入力いただいた個人情報は、ご予約への対応およびご連絡のためにのみ使用いたします。詳しくは
                <Link href="/privacy" className="underline underline-offset-2 hover:text-[#2C2C2C] transition-colors">
                  プライバシーポリシー
                </Link>
                をご覧ください。
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
