import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

/**
 * 公開ページ共通のレイアウト。
 * ヘッダー・フッターをここに置くことで、ページを移動してもヘッダーが作り直されない。
 * （/admin はこのグループの外なのでヘッダーなし）
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
