import { NextResponse } from "next/server";
import { clearCustomerSession } from "@/lib/customer-auth";
import { MYPAGE_PATH } from "@/lib/routes";
import { siteOrigin } from "@/lib/site-origin";

export async function POST() {
  const response = NextResponse.redirect(new URL(MYPAGE_PATH, await siteOrigin()), 303);
  clearCustomerSession(response);
  return response;
}
