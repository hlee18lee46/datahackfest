import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import LoginForm from "@/components/login-form"

export default async function HomePage() {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.get("doctor-session")

  if (isLoggedIn) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
