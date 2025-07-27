"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Heart, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface PatientData {
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

export default function PatientAssessmentForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [patientData, setPatientData] = useState<PatientData>({
    PatientID: "",
    Age: "",
    Sex: "",
    ChestPainType: "",
    RestingBP: "",
    Cholesterol: "",
    FastingBS: "",
    RestingECG: "",
    MaxHR: "",
    ExerciseAngina: "",
    Oldpeak: "",
    ST_Slope: "",
  })

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setPatientData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!patientData.PatientID) {
      alert("Please enter a Patient ID")
      return
    }
  
    setIsLoading(true)
  
    try {
      // ✅ Fix goes here — normalize number fields
      const normalizedData = {
        ...patientData,
        Age: Number(patientData.Age),
        RestingBP: Number(patientData.RestingBP),
        Cholesterol: Number(patientData.Cholesterol),
        FastingBS: Number(patientData.FastingBS),
        MaxHR: Number(patientData.MaxHR),
        Oldpeak: Number(patientData.Oldpeak),
      }
  
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientData: normalizedData }), // 👈 use normalizedData
      })
  
      if (response.ok) {
        setIsSubmitted(true)
      } else {
        alert("Failed to save assessment")
      }
    } catch (error) {
      console.error("Error saving assessment:", error)
      alert("Error saving assessment")
    } finally {
      setIsLoading(false)
    }
  }
  

  const handleNewAssessment = () => {
    setIsSubmitted(false)
    setPatientData({
      PatientID: "",
      Age: "",
      Sex: "",
      ChestPainType: "",
      RestingBP: "",
      Cholesterol: "",
      FastingBS: "",
      RestingECG: "",
      MaxHR: "",
      ExerciseAngina: "",
      Oldpeak: "",
      ST_Slope: "",
    })
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-green-700">Assessment Saved Successfully</CardTitle>
          <CardDescription>Patient data has been recorded</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Patient ID:</strong> {patientData.PatientID}
            </p>
          </div>
          <div className="flex space-x-4 justify-center">
            <Button onClick={handleNewAssessment}>New Assessment</Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
          <CardDescription>Enter patient data for heart disease assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="patient-id">Patient ID</Label>
                <Input
                  id="patient-id"
                  type="text"
                  value={patientData.PatientID}
                  onChange={(e) => handleInputChange("PatientID", e.target.value)}
                  required
                  placeholder="Enter patient ID"
                />
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={patientData.Age}
                  onChange={(e) => handleInputChange("Age", e.target.value)}
                  required
                  min="1"
                  max="120"
                  placeholder="Enter age"
                />
              </div>

              <div>
                <Label>Sex</Label>
                <RadioGroup
                  value={patientData.Sex}
                  onValueChange={(value) => handleInputChange("Sex", value)}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="M" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="F" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="chest-pain">Chest Pain Type</Label>
                <Select
                  value={patientData.ChestPainType}
                  onValueChange={(value) => handleInputChange("ChestPainType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chest pain type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TA">Typical Angina (TA)</SelectItem>
                    <SelectItem value="ATA">Atypical Angina (ATA)</SelectItem>
                    <SelectItem value="NAP">Non-Anginal Pain (NAP)</SelectItem>
                    <SelectItem value="ASY">Asymptomatic (ASY)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="resting-bp">Resting Blood Pressure (mmHg)</Label>
                <Input
                  id="resting-bp"
                  type="number"
                  value={patientData.RestingBP}
                  onChange={(e) => handleInputChange("RestingBP", e.target.value)}
                  required
                  min="50"
                  max="250"
                  placeholder="e.g., 120"
                />
              </div>

              <div>
                <Label htmlFor="cholesterol">Cholesterol (mg/dl)</Label>
                <Input
                  id="cholesterol"
                  type="number"
                  value={patientData.Cholesterol}
                  onChange={(e) => handleInputChange("Cholesterol", e.target.value)}
                  required
                  min="100"
                  max="600"
                  placeholder="e.g., 200"
                />
              </div>

              <div>
                <Label>Fasting Blood Sugar {">"} 120 mg/dl</Label>
                <RadioGroup
                  value={patientData.FastingBS}
                  onValueChange={(value) => handleInputChange("FastingBS", value)}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="fbs-no" />
                    <Label htmlFor="fbs-no">No (0)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="fbs-yes" />
                    <Label htmlFor="fbs-yes">Yes (1)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="resting-ecg">Resting ECG</Label>
                <Select
                  value={patientData.RestingECG}
                  onValueChange={(value) => handleInputChange("RestingECG", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ECG result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="ST">ST-T Wave Abnormality (ST)</SelectItem>
                    <SelectItem value="LVH">Left Ventricular Hypertrophy (LVH)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="max-hr">Maximum Heart Rate (bpm)</Label>
                <Input
                  id="max-hr"
                  type="number"
                  value={patientData.MaxHR}
                  onChange={(e) => handleInputChange("MaxHR", e.target.value)}
                  required
                  min="60"
                  max="220"
                  placeholder="e.g., 150"
                />
              </div>

              <div>
                <Label>Exercise Induced Angina</Label>
                <RadioGroup
                  value={patientData.ExerciseAngina}
                  onValueChange={(value) => handleInputChange("ExerciseAngina", value)}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="N" id="angina-no" />
                    <Label htmlFor="angina-no">No (N)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Y" id="angina-yes" />
                    <Label htmlFor="angina-yes">Yes (Y)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="oldpeak">Oldpeak (ST Depression)</Label>
                <Input
                  id="oldpeak"
                  type="number"
                  step="0.1"
                  value={patientData.Oldpeak}
                  onChange={(e) => handleInputChange("Oldpeak", e.target.value)}
                  required
                  min="0"
                  max="10"
                  placeholder="e.g., 1.4"
                />
              </div>

              <div>
                <Label htmlFor="st-slope">ST Slope</Label>
                <Select value={patientData.ST_Slope} onValueChange={(value) => handleInputChange("ST_Slope", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ST slope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Up">Upsloping (Up)</SelectItem>
                    <SelectItem value="Flat">Flat</SelectItem>
                    <SelectItem value="Down">Downsloping (Down)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Assessment...
                </>
              ) : (
                "Save Patient Assessment"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
