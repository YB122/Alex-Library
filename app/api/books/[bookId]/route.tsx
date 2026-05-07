import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params

    // Get authorization header from the request
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: 401 }
      )
    }

    const response = await axios.get(
      `https://library-tan-eta.vercel.app/api/books/${bookId}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    )
    console.log(response.data)

    return NextResponse.json(response.data.data)
  } catch (error) {
    console.error("Error fetching book:", error)

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: any } }
      const status = axiosError.response?.status || 500
      const data = axiosError.response?.data || {
        error: "Internal server error",
      }

      return NextResponse.json(data, { status })
    }

    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 })
  }
}
