import { NextResponse } from "next/server";
import { getTodaySession } from "@/lib/session";

const DUMMY_USER_ID = "cmpcpfzjh0000e961l4alnl3w";

export async function GET() {
  const session = await getTodaySession(DUMMY_USER_ID);

  return NextResponse.json(session);
}
