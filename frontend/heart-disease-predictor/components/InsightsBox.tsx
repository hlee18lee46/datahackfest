'use client'

import { useEffect, useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function InsightsBox() {
  const [loading, setLoading] = useState(true)
  const [insight, setInsight] = useState('')
  const [error, setError] = useState('')
  const patientRecord = {
    Age: "44",
    Sex: "M",
    ChestPainType: "ATA",         // Atypical Angina
    RestingBP: "120",
    Cholesterol: "200",
    FastingBS: "1",               // Assume fasting blood sugar is 1 (100 mg/dL or higher)
    RestingECG: "ST",
    MaxHR: "180",
    ExerciseAngina: "N",          // "No" = "N"
    Oldpeak: "1.4",               // ST depression
    ST_Slope: "Down"              // Infer from ST depression and ECG
  }

useEffect(() => {
  if (!patientRecord) return;

  const fetchInsights = async () => {
    try {
      const aiRes = await fetch('http://127.0.0.1:5000/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientRecord),
      })

      if (!aiRes.ok) {
        throw new Error(`API error: ${aiRes.status}`)
      }

      const data = await aiRes.json()
      setInsight(data.summary || 'No summary returned.')
    } catch (e) {
      setError('Failed to load AI insights.')
      console.error('AI fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  fetchInsights()
}, [patientRecord])

  if (loading) {
    return (
      <div className="flex items-center">
        <Loader2 className="animate-spin mr-2 h-5 w-5 text-blue-500" />
        <span className="text-gray-600">Generating insights from Gemini...</span>
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>
  }

  return (
    <div className="text-sm text-gray-800 space-y-2">
      <p className="flex items-center font-medium">
        <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
        AI Summary:
      </p>
      <p>{insight}</p>
    </div>
  )
}
