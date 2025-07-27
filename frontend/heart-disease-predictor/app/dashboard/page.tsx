import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, LogOut } from "lucide-react"
import Link from "next/link"

export default async function Dashboard() {
  const cookieStore = await cookies()
  const session = cookieStore.get("doctor-session")

  if (!session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">CardioAssess</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome!</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/api/auth/logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage patient heart disease assessments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>New Patient Assessment</span>
              </CardTitle>
              <CardDescription>Enter patient data and record diagnosis</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/assessment">Start Assessment</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span>Patient Records</span>
              </CardTitle>
              <CardDescription>View previous assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/records">View Records</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <Users className="h-5 w-5 text-green-600" />
      <span>Search Patient</span>
    </CardTitle>
    <CardDescription>Find a record by Patient ID</CardDescription>
  </CardHeader>
  <CardContent>
    <Button variant="secondary" className="w-full" asChild>
      <Link href="/search">Search</Link>
    </Button>
  </CardContent>
</Card>

        </div>
      </main>
    </div>
  )
}
