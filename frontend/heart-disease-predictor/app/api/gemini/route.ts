// app/api/gemini/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  const data = await res.json()
  const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary.'

  return NextResponse.json({ summary })
}
