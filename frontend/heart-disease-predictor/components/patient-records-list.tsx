"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Calendar, User, Loader2, AlertCircle } from "lucide-react"

interface Assessment {
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

interface PatientRecordsListProps {
  patientId?: string
}
export default function PatientRecordsList({ patientId }: PatientRecordsListProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      const response = await fetch("/api/assessment")
      if (response.ok) {
        const data = await response.json()
  
        const filteredData = patientId
          ? data.assessments.filter((a: Assessment) => a.patientData.PatientID === patientId)
          : data.assessments
  
        const enriched = await Promise.all(
          filteredData.map(async (a: Assessment) => {
            try {
              const res = await fetch("http://localhost:5000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(a.patientData),
              })
  
              if (res.ok) {
                const pred = await res.json()
                return { ...a, prediction: pred }
              }
            } catch (e) {
              console.error("Prediction failed for", a.patientData, e)
            }
  
            return { ...a, prediction: { risk: "N/A", percentage: 0 } }
          })
        )
  
        setAssessments(enriched)
      } else {
        setError("Failed to fetch assessments")
      }
    } catch (error) {
      setError("Error loading assessments")
    } finally {
      setLoading(false)
    }
  }
  
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getChestPainTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      TA: "Typical Angina",
      ATA: "Atypical Angina",
      NAP: "Non-Anginal Pain",
      ASY: "Asymptomatic",
    }
    return types[type] || type
  }

  const getSexLabel = (sex: string) => {
    return sex === "M" ? "Male" : "Female"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading assessments...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
          <span className="text-red-600">{error}</span>
        </CardContent>
      </Card>
    )
  }

  if (assessments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assessments Found</h3>
          <p className="text-gray-600 mb-4">No patient assessments have been recorded yet.</p>
          <Button asChild>
            <a href="/assessment">Start First Assessment</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {assessments.map((assessment) => (
        <Card key={assessment._id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <CardTitle className="text-lg">
                  Patient Assessment #{assessment._id.slice(-6)}
                </CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{assessment.status}</Badge>
              </div>
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
  <span className="text-sm text-gray-800"><strong>Risk Prediction</strong></span>
  <p className="text-sm">
    {assessment.prediction
      ? `${assessment.prediction.percentage}% (${assessment.prediction.risk})`
      : "N/A"}
  </p>
</div>


            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 