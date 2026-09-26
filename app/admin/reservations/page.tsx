import type { Metadata } from "next";
import AdminDashboard from "@/app/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "予約管理",
  robots: { index: false, follow: false },
};

/**
 * 予約管理ダッシュボード。/admin は Cloudflare Access（許可したメールアドレスへのワンタイムコード）で守る。
 * ページは静的なままにし、予約データはサーバーアクションが Access の署名を検証してから返す。
 */
export default function AdminReservationsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#2C2C2C]">
      <div className="mx-auto max-w-[960px] px-4 sm:px-6 py-8 sm:py-10">
        <AdminDashboard />
      </div>
    </main>
  );
}
