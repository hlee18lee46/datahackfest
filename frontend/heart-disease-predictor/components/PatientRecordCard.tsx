// This contains everything from one assessment card
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Calendar, User } from "lucide-react"

export interface Assessment {
  _id: string
  patientData: {
    PatientID: string
    Age: string
    Sex: string
    ChestPainType: string
    RestingBP: string
    Cholesterol: string
    FastingBS: string
    RestingECG: string
    MaxHR: string
    ExerciseAngina: string
    Oldpeak: string
    ST_Slope: string
  }
  timestamp: string
  status: string
  prediction?: {
    risk: string
    percentage: number
  }
}

export function PatientRecordCard({ assessment }: { assessment: Assessment }) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getChestPainTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      TA: "Typical Angina",
      ATA: "Atypical Angina",
      NAP: "Non-Anginal Pain",
      ASY: "Asymptomatic",
    }
    return types[type] || type
  }

  const getSexLabel = (sex: string) => (sex === "M" ? "Male" : "Female")

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <CardTitle className="text-lg">
              Patient Assessment #{assessment._id?.slice(-6) ?? "Unknown"}
            </CardTitle>
          </div>
          <Badge variant="outline">{assessment.status}</Badge>
        </div>
        <CardDescription className="flex items-center space-x-4">
          <span className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            Patient ID: {assessment.patientData.PatientID}
          </span>
          <span className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {getSexLabel(assessment.patientData.Sex)}, {assessment.patientData.Age} years
          </span>
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(assessment.timestamp)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Chest Pain Type</span>
            <p className="text-sm">{getChestPainTypeLabel(assessment.patientData.ChestPainType)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Blood Pressure</span>
            <p className="text-sm">{assessment.patientData.RestingBP} mmHg</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Cholesterol</span>
            <p className="text-sm">{assessment.patientData.Cholesterol} mg/dl</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Max Heart Rate</span>
            <p className="text-sm">{assessment.patientData.MaxHR} bpm</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Exercise Angina</span>
            <p className="text-sm">{assessment.patientData.ExerciseAngina === "Y" ? "Yes" : "No"}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">ST Depression</span>
            <p className="text-sm">{assessment.patientData.Oldpeak}</p>
          </div>
          <div className="text-sm font-medium text-gray-500">
            <p className="text-sm">Resting ECG: {assessment.patientData.RestingECG}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-sm text-gray-800 font-semibold">Risk Prediction</span>
            <p className="text-sm">
              {assessment.prediction
                ? `${assessment.prediction.percentage}% (${assessment.prediction.risk})`
                : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
