import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/apis/authMiddleware";

export const config = {
  matcher: "/api/:path*",
};

export default function middleware(req) {
  const authResults = authMiddleware(req);
  if (!authResults?.isvalid) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.next();
}
