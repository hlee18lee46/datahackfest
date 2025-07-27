import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const patientData = await request.json()

    const prompt = `As a medical AI assistant, analyze the following patient data and provide clinical insights and recommendations for heart disease assessment:

Patient Data:
- Age: ${patientData.Age}
- Sex: ${patientData.Sex}
- Chest Pain Type: ${patientData.ChestPainType}
- Resting Blood Pressure: ${patientData.RestingBP} mmHg
- Cholesterol: ${patientData.Cholesterol} mg/dl
- Fasting Blood Sugar > 120 mg/dl: ${patientData.FastingBS === "1" ? "Yes" : "No"}
- Resting ECG: ${patientData.RestingECG}
- Maximum Heart Rate: ${patientData.MaxHR} bpm
- Exercise Induced Angina: ${patientData.ExerciseAngina === "Y" ? "Yes" : "No"}
- Oldpeak (ST Depression): ${patientData.Oldpeak}
- ST Slope: ${patientData.ST_Slope}

Please provide:
1. Key risk factors identified
2. Clinical recommendations
3. Suggested follow-up tests or monitoring
4. Lifestyle recommendations
5. Any red flags or immediate concerns

Keep the response professional and suitable for medical practitioners.`

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt,
      maxTokens: 500,
    })

    return NextResponse.json({ suggestions: text })
  } catch (error) {
    console.error("Error generating AI suggestions:", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
