import { supabase, type Reservation } from "@/lib/supabase";

interface PageProps {
  searchParams?: {
    key?: string;
  };
}

export default async function AdminReservationsPage({ searchParams }: PageProps) {
  const accessKey = process.env.ADMIN_DASHBOARD_KEY;
  const providedKey = searchParams?.key;

  const isAuthorized = !accessKey || (providedKey && accessKey && providedKey === accessKey);

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-[#FAFAF8] text-[#2C2C2C]">
        <div className="mx-auto max-w-[720px] px-6 py-24">
          <h1 className="text-lg font-medium mb-4">Reservations Admin</h1>
          <p className="text-sm text-[#6B6B6B] mb-2">
            このページを表示するにはアクセスキーが必要です。
          </p>
          <p className="text-xs text-[#8A8A8A]">
            URL に <code className="px-1 py-0.5 bg-[#E5E4DF] rounded text-[11px]">?key=YOUR_KEY</code>{" "}
            を付与してください。
          </p>
        </div>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const reservations = (data || []) as Reservation[];

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#2C2C2C]">
      <div className="mx-auto max-w-[1100px] px-6 py-10">
        <header className="mb-8">
          <h1 className="text-xl font-medium tracking-[0.12em] uppercase text-[#6B6B6B]">
            Reservations
          </h1>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            最新100件の予約を表示しています。時刻は日本時間（Asia/Tokyo）で表示されます。
          </p>
          {error && (
            <p className="mt-3 text-sm text-[#B85C5C]">
              予約の取得に失敗しました: {error.message}
            </p>
          )}
        </header>

        <div className="overflow-x-auto border border-[#E5E4DF] bg-white">
          <table className="min-w-full text-[12px]">
            <thead className="bg-[#F7F6F3] text-[#6B6B6B]">
              <tr>
                <th className="px-3 py-2 text-left font-normal">受付日時 (JST)</th>
                <th className="px-3 py-2 text-left font-normal">利用日</th>
                <th className="px-3 py-2 text-left font-normal">時間</th>
                <th className="px-3 py-2 text-left font-normal">種別</th>
                <th className="px-3 py-2 text-left font-normal">名前</th>
                <th className="px-3 py-2 text-left font-normal">メール</th>
                <th className="px-3 py-2 text-left font-normal">電話</th>
                <th className="px-3 py-2 text-left font-normal">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => {
                const createdAtJst = new Date(r.created_at).toLocaleString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                  hour12: false,
                });

                return (
                  <tr key={r.id} className="border-t border-[#E5E4DF] hover:bg-[#FAFAF8]">
                    <td className="px-3 py-2 whitespace-nowrap text-[#2C2C2C]">
                      {createdAtJst}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-[#2C2C2C]">
                      {r.date}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-[#2C2C2C]">
                      {r.time ?? "—"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-[#2C2C2C]">
                      {r.type}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-[#2C2C2C]">
                      {r.name}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-[#2C2C2C]">
                      {r.email}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-[#2C2C2C]">
                      {r.phone ?? "—"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-[#6B6B6B]">
                      {r.status}
                    </td>
                  </tr>
                );
              })}

              {reservations.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-10 text-center text-[#8A8A8A]"
                  >
                    まだ予約はありません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

