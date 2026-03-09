"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { reserveData, siteConfig } from "@/app/data/site";
import ReserveCalendar from "./ReserveCalendar";
import ReserveSummary from "./ReserveSummary";
import ReserveComplete from "./ReserveComplete";
import { createReservation } from "@/app/actions/reservation";

const reserveSchema = z.object({
  name: z.string().min(1, "お名前を入力してください"),
  email: z.string().email("正しいメールアドレスを入力してください"),
  phone: z.string().optional(),
  type: z.string().min(1, "利用種別を選択してください"),
  numberOfPeople: z.string().optional(),
  message: z.string().min(1, "お問い合わせ内容を入力してください"),
});

type ReserveFormData = z.infer<typeof reserveSchema>;

export default function ReserveForm() {
  const [step, setStep] = useState<"type" | "calendar" | "form" | "confirm" | "complete">("type");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPrivateBooking = selectedType === "private";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ReserveFormData>({
    resolver: zodResolver(reserveSchema),
  });

  const formData = watch();

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setValue("type", type);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  };

  const handleContinueToCalendar = () => {
    if (selectedType) {
      setStep("calendar");
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (!isPrivateBooking) {
      setSelectedTime(undefined);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinueToForm = () => {
    if (selectedDate && (isPrivateBooking || selectedTime)) {
      setStep("form");
    }
  };

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: ReserveFormData) => {
    if (step === "form") {
      setStep("confirm");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Supabaseに予約を送信
    const result = await createReservation({
      type: data.type,
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      time: isPrivateBooking ? null : selectedTime || null,
      peopleCount: data.numberOfPeople ? parseInt(data.numberOfPeople, 10) || null : null,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message || null,
    });

    setIsSubmitting(false);

    if (result.success) {
      setStep("complete");
    } else {
      setSubmitError(result.error || "予約の送信に失敗しました。");
    }
  };

  const handleBack = () => {
    if (step === "confirm") {
      setStep("form");
    } else if (step === "form") {
      setStep("calendar");
    } else if (step === "calendar") {
      setStep("type");
    }
  };

  const handleReset = () => {
    reset();
    setSelectedType("");
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setStep("type");
  };

  const getStepNumber = () => {
    switch (step) {
      case "type": return 1;
      case "calendar": return 2;
      case "form": return 3;
      case "confirm": return 4;
      default: return 1;
    }
  };

  const currentStepNumber = getStepNumber();

  if (step === "complete") {
    return <ReserveComplete onReset={handleReset} />;
  }

  if (step === "confirm") {
    return (
      <ReserveSummary
        data={{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: reserveData.types.find((t) => t.value === formData.type)?.label || "",
          date: selectedDate ? format(selectedDate, "yyyy年M月d日(E)", { locale: ja }) : "",
          time: isPrivateBooking ? "終日貸切（9:00〜18:00）" : selectedTime || "",
          numberOfPeople: formData.numberOfPeople,
          message: formData.message,
        }}
        onBack={handleBack}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        error={submitError}
      />
    );
  }

  return (
    <div className="space-y-12">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {[
          { num: 1, label: "利用種別" },
          { num: 2, label: "日時選択" },
          { num: 3, label: "情報入力" },
          { num: 4, label: "確認" },
        ].map((s, index) => (
          <div key={s.num} className="flex items-center">
            <div className="flex items-center gap-2">
              <span
                className={`w-8 h-8 flex items-center justify-center text-sm ${
                  currentStepNumber >= s.num
                    ? "bg-[#2C2C2C] text-white"
                    : "bg-[#E5E4DF] text-[#8A8A8A]"
                }`}
              >
                {s.num}
              </span>
              <span
                className={`text-xs hidden sm:block ${
                  currentStepNumber >= s.num ? "text-[#2C2C2C]" : "text-[#8A8A8A]"
                }`}
              >
                {s.label}
              </span>
            </div>
            {index < 3 && (
              <div
                className={`w-6 sm:w-10 h-px mx-2 sm:mx-3 ${
                  currentStepNumber > s.num ? "bg-[#2C2C2C]" : "bg-[#E5E4DF]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Type Selection */}
      {step === "type" && (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="font-[var(--font-cormorant)] text-2xl text-[#2C2C2C] mb-2">
              ご利用種別を選択
            </h3>
            <p className="text-sm text-[#6B6B6B]">
              ご希望の利用タイプをお選びください
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reserveData.types.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleTypeSelect(type.value)}
                className={`p-6 text-left transition-all border ${
                  selectedType === type.value
                    ? "border-[#2C2C2C] bg-[#2C2C2C] text-white"
                    : "border-[#E5E4DF] bg-white hover:border-[#5C6B5C] text-[#2C2C2C]"
                }`}
              >
                <span className="block text-base font-medium mb-1">{type.label}</span>
                {type.value === "private" && (
                  <span className={`block text-xs ${selectedType === type.value ? "text-white/70" : "text-[#8A8A8A]"}`}>
                    終日貸切・80名まで
                  </span>
                )}
                {type.value === "event" && (
                  <span className={`block text-xs ${selectedType === type.value ? "text-white/70" : "text-[#8A8A8A]"}`}>
                    イベント・法人利用相談
                  </span>
                )}
                {type.value === "tour" && (
                  <span className={`block text-xs ${selectedType === type.value ? "text-white/70" : "text-[#8A8A8A]"}`}>
                    施設のご案内
                  </span>
                )}
                {type.value === "meeting" && (
                  <span className={`block text-xs ${selectedType === type.value ? "text-white/70" : "text-[#8A8A8A]"}`}>
                    打ち合わせ・セミナー
                  </span>
                )}
                {(type.value === "visitor" || type.value === "coworking") && (
                  <span className={`block text-xs ${selectedType === type.value ? "text-white/70" : "text-[#8A8A8A]"}`}>
                    {type.value === "visitor" ? "お試し利用" : "定期利用"}
                  </span>
                )}
                {type.value === "kids" && (
                  <span className={`block text-xs ${selectedType === type.value ? "text-white/70" : "text-[#8A8A8A]"}`}>
                    お子様連れでのご利用
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={handleContinueToCalendar}
              disabled={!selectedType}
              className="px-12 py-4 text-sm tracking-wider text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] disabled:bg-[#D0D0D0] disabled:cursor-not-allowed transition-colors"
            >
              次へ進む
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Calendar */}
      {step === "calendar" && (
        <>
          <div>
            <div className="text-center mb-8">
              <h3 className="font-[var(--font-cormorant)] text-2xl text-[#2C2C2C] mb-2">
                {isPrivateBooking ? "ご希望の日付を選択" : "ご希望の日時を選択"}
              </h3>
              <p className="text-sm text-[#6B6B6B]">
                {isPrivateBooking
                  ? "貸切利用の日付をお選びください（9:00〜18:00の終日利用）"
                  : "カレンダーから日付を選び、時間帯をお選びください"}
              </p>
              <p className="mt-2 text-sm text-[#5C6B5C]">
                利用種別: {reserveData.types.find((t) => t.value === selectedType)?.label}
                <button
                  type="button"
                  onClick={handleBack}
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
              isPrivateBooking={isPrivateBooking}
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-8 py-4 text-sm tracking-wider text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAFAF8] transition-colors"
            >
              戻る
            </button>
            <button
              type="button"
              onClick={handleContinueToForm}
              disabled={!selectedDate || (!isPrivateBooking && !selectedTime)}
              className="px-12 py-4 text-sm tracking-wider text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] disabled:bg-[#D0D0D0] disabled:cursor-not-allowed transition-colors"
            >
              次へ進む
            </button>
          </div>
        </>
      )}

      {/* Step 3: Form */}
      {step === "form" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: Info */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium text-[#2C2C2C] mb-6">ご予約内容</h3>
            
            {/* Selected Info */}
            <div className="bg-white border border-[#E5E4DF] p-4 mb-6 space-y-3">
              <div>
                <p className="text-xs text-[#6B6B6B]">利用種別</p>
                <p className="text-[#2C2C2C] font-medium">
                  {reserveData.types.find((t) => t.value === selectedType)?.label}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B6B6B]">日時</p>
                <p className="text-[#2C2C2C] font-medium">
                  {selectedDate && format(selectedDate, "yyyy年M月d日(E)", { locale: ja })}
                </p>
                <p className="text-[#2C2C2C]">
                  {isPrivateBooking ? "終日貸切（9:00〜18:00）" : selectedTime}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep("calendar")}
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

            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-[#6B6B6B] mb-1">営業時間</dt>
                <dd className="text-[#2C2C2C]">
                  {siteConfig.hours.days} {siteConfig.hours.regular}
                </dd>
              </div>
              <div>
                <dt className="text-[#6B6B6B] mb-1">電話でのお問い合わせ</dt>
                <dd className="text-[#2C2C2C]">
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="hover:text-[#5C6B5C] transition-colors"
                  >
                    {siteConfig.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {/* Hidden type field */}
              <input type="hidden" {...register("type")} />

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm text-[#2C2C2C] mb-2">
                  お名前 <span className="text-[#B85C5C]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={`w-full px-4 py-3 bg-white border ${
                    errors.name ? "border-[#B85C5C]" : "border-[#E5E4DF]"
                  } text-[#2C2C2C] placeholder-[#B0B0B0] focus:outline-none focus:border-[#5C6B5C] transition-colors`}
                  placeholder="山田 太郎"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-[#B85C5C]">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm text-[#2C2C2C] mb-2">
                  メールアドレス <span className="text-[#B85C5C]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={`w-full px-4 py-3 bg-white border ${
                    errors.email ? "border-[#B85C5C]" : "border-[#E5E4DF]"
                  } text-[#2C2C2C] placeholder-[#B0B0B0] focus:outline-none focus:border-[#5C6B5C] transition-colors`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-[#B85C5C]">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm text-[#2C2C2C] mb-2">
                  電話番号
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register("phone")}
                  className="w-full px-4 py-3 bg-white border border-[#E5E4DF] text-[#2C2C2C] placeholder-[#B0B0B0] focus:outline-none focus:border-[#5C6B5C] transition-colors"
                  placeholder="090-1234-5678"
                />
              </div>

              {/* Number of People - 貸切・イベント利用の場合のみ表示 */}
              {(selectedType === "private" || selectedType === "event") && (
                <div>
                  <label
                    htmlFor="numberOfPeople"
                    className="block text-sm text-[#2C2C2C] mb-2"
                  >
                    人数 <span className="text-[#B85C5C]">*</span>
                  </label>
                  <input
                    type="text"
                    id="numberOfPeople"
                    {...register("numberOfPeople")}
                    className="w-full px-4 py-3 bg-white border border-[#E5E4DF] text-[#2C2C2C] placeholder-[#B0B0B0] focus:outline-none focus:border-[#5C6B5C] transition-colors"
                    placeholder="例: 30名"
                  />
                  <p className="mt-1 text-xs text-[#8A8A8A]">
                    着席最大80名 / スタンディング最大150名
                  </p>
                </div>
              )}

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm text-[#2C2C2C] mb-2">
                  {isPrivateBooking || selectedType === "event"
                    ? "利用目的・ご要望"
                    : "お問い合わせ内容・備考"}{" "}
                  <span className="text-[#B85C5C]">*</span>
                </label>
                <textarea
                  id="message"
                  {...register("message")}
                  rows={4}
                  className={`w-full px-4 py-3 bg-white border ${
                    errors.message ? "border-[#B85C5C]" : "border-[#E5E4DF]"
                  } text-[#2C2C2C] placeholder-[#B0B0B0] focus:outline-none focus:border-[#5C6B5C] transition-colors resize-none`}
                  placeholder={
                    isPrivateBooking
                      ? "イベントの内容、必要な設備、レイアウトのご希望などをご記入ください。"
                      : "ご希望やご質問があればご記入ください。"
                  }
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-[#B85C5C]">{errors.message.message}</p>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
