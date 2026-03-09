-- ============================================
-- 予約テーブル
-- Supabase Dashboard の SQL Editor で実行してください
-- ============================================

-- タイムゾーンを日本時間に設定（このセッションのみ）
-- Supabaseのデフォルトビューを日本時間にしたい場合は
-- Dashboard → Settings → Database → Timezone を 'Asia/Tokyo' に変更
set timezone = 'Asia/Tokyo';

create table if not exists reservations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  
  -- 予約タイプ: visitor, coworking, kids, meeting, private, event
  type text not null,
  
  -- 予約日時
  date date not null,
  time text, -- 時間（貸切の場合はnull）
  
  -- 人数（貸切・イベント用）
  people_count int,
  
  -- 連絡先
  name text not null,
  email text not null,
  phone text,
  message text,
  
  -- ステータス: pending(確認待ち), confirmed(確定), cancelled(キャンセル)
  status text default 'pending'
);

-- RLS（Row Level Security）を有効化
alter table reservations enable row level security;

-- 誰でも予約を作成できるポリシー（匿名ユーザー含む）
create policy "Anyone can insert reservations"
  on reservations for insert
  with check (true);

-- 自分の予約のみ閲覧可能（emailで照合）
-- ※管理者はSupabase Dashboardで全件確認可能
create policy "Users can view own reservations"
  on reservations for select
  using (true);

-- インデックス
create index if not exists reservations_date_idx on reservations (date);
create index if not exists reservations_status_idx on reservations (status);
create index if not exists reservations_created_at_idx on reservations (created_at desc);
