import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("doctor-session")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { patientData } = await request.json()

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("datahackfest")
    const collection = db.collection("patient")

    // Create assessment document
    const assessment = {
      patientData,
      timestamp: new Date(),
      doctorId: "demo-doctor", // In a real app, this would come from the session
      status: "completed"
    }

    // Save to MongoDB
    const result = await collection.insertOne(assessment)

    console.log("Patient Assessment Saved to MongoDB:", {
      id: result.insertedId,
      patientData,
      timestamp: assessment.timestamp,
    })

    return NextResponse.json({
      success: true,
      message: "Assessment saved successfully",
      assessmentId: result.insertedId
    })
  } catch (error) {
    console.error("Error saving assessment:", error)
    return NextResponse.json({ error: "Failed to save assessment" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("doctor-session")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("datahackfest")
    const collection = db.collection("patient")

    // Get all assessments (in a real app, you'd filter by doctor)
    const assessments = await collection
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json({
      success: true,
      assessments: assessments
    })
  } catch (error) {
    console.error("Error fetching assessments:", error)
    return NextResponse.json({ error: "Failed to fetch assessments" }, { status: 500 })
  }
}
