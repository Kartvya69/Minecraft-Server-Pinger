import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Server address is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.mcstatus.io/v2/status/java/${encodeURIComponent(address)}`)
    if (!response.ok) {
      throw new Error("Failed to fetch server status")
    }
    const data = await response.json()

    // Remove the icon from the response
    const { icon, ...restData } = data

    return NextResponse.json(restData)
  } catch (error) {
    console.error("Error fetching server status:", error)
    return NextResponse.json({ error: "Failed to fetch server status" }, { status: 500 })
  }
}

