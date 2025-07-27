// app/records/[id]/page.tsx

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import PatientRecordsList from "@/components/patient-records-list"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function RecordByIdPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies()
  const session = cookieStore.get("doctor-session")
  if (!session) redirect("/")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" size="sm" asChild className="mr-4">
              <Link href="/records">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Records
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Patient ID: {params.id}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PatientRecordsList patientId={params.id} />
      </main>
    </div>
  )
}
