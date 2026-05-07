import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const resolvedParams = await params
    const bookId = resolvedParams.bookId
    
    // Get authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    const apiUrl = `https://library-tan-eta.vercel.app/api/books/${bookId}`
    console.log("Making API call to:", apiUrl)

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: authHeader || '',
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error fetching book:', error)
    
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: any } }
      if (axiosError.response?.status === 401) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      if (axiosError.response?.status === 404) {
        return NextResponse.json(
          { error: 'Book not found' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    )
  }
}
