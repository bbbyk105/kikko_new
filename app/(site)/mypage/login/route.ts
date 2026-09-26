import { NextResponse, type NextRequest } from "next/server";
import { emailFromLoginToken, setCustomerSession } from "@/lib/customer-auth";
import { MYPAGE_LOGIN_ERROR_PARAM, MYPAGE_PATH } from "@/lib/routes";
import { siteOrigin } from "@/lib/site-origin";

/** メールのログイン用リンク。署名と期限が正しければログイン状態の Cookie を付けてマイページへ */
export async function GET(request: NextRequest) {
  const email = emailFromLoginToken(request.nextUrl.searchParams.get("token") ?? "");
  const destination = new URL(MYPAGE_PATH, await siteOrigin());
  if (!email) {
    destination.searchParams.set(MYPAGE_LOGIN_ERROR_PARAM, "1");
    return NextResponse.redirect(destination, 303);
  }
  const response = NextResponse.redirect(destination, 303);
  setCustomerSession(response, email);
  return response;
}
