import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Reservation = {
  id: string;
  created_at: string;
  type: string;
  date: string;
  time: string | null;
  people_count: number | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: "pending" | "confirmed" | "cancelled";
};
