"use client"

import { useEffect, useState, useMemo } from "react"
import { useContext } from "react"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { ProductDetail1 } from "@/components/product-detail1"
import axios from "axios"
import { User } from "@/contexts/UserContext"
import { getApiUrl } from "@/lib/utils"

interface Book {
  _id: string
  title: string
  author: string
  publishedYear: number
  availableCopies: number
  isActiveAvailableCopies: boolean
  isActiveAdmin: boolean
  userId: string
  urlImage: string
  description: string
  rating: number
}

interface BookDetailClientProps {
  bookId: string
}

const fetchBook = async (
  bookId: string,
  userContext: { userRole: string | null; userToken: string | null }
): Promise<Book | null> => {
  try {
    console.log("fetchBook called with bookId:", bookId)
    const userToken = userContext?.userToken
    const userRole = userContext?.userRole

    const apiUrl = `/api/books/${bookId}`
    console.log("Making API call to:", apiUrl)

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `${userRole} ${userToken}`,
      },
    })

    return response.data.data
  } catch (error) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 401) {
        toast.error("Unauthorized access")
      }
    }

    return null
  }
}

export function BookDetailClient({ bookId }: BookDetailClientProps) {
  console.log("BookDetailClient received bookId:", bookId)

  const userContext = useContext(User)
  const { userRole, userToken, userData } = userContext || {
    userRole: null,
    userToken: null,
    userData: null,
  }

  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const memoizedUserContext = useMemo(
    () => ({ userRole, userToken }),
    [userRole, userToken]
  )

  useEffect(() => {
    if (userRole && userToken && userData) {
      const loadBook = async () => {
        try {
          const fetchedBook = await fetchBook(bookId, memoizedUserContext)
          setBook(fetchedBook)
        } catch (error) {
          toast.error("Failed to load book")
        } finally {
          setLoading(false)
        }
      }

      loadBook()
    } else {
      toast.error("You must login first")
      redirect("/login")
    }
  }, [bookId, memoizedUserContext, userRole, userToken, userData])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#E0AAFF]" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-[#6B21A8]">Book not found</p>
      </div>
    )
  }

  return <ProductDetail1 book={book} />
}
