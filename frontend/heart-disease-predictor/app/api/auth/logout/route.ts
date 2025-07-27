import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()

  // Clear session cookie
  cookieStore.delete("doctor-session")

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"))
}
