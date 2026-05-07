"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useContext } from "react"
import { User } from "@/contexts/UserContext"
import SocialMediaTrending2 from "@/components/Socialmediatrending2"
import { getApiUrl } from "@/lib/utils"

interface Book {
  _id: string
  title: string
  author: string
  description?: string
  urlImage?: string
  year?: number
  rating?: number
  isActiveAvailableCopies?: boolean
  isActiveAdmin?: boolean
}

export default function Page() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const userContext = useContext(User)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const userToken = userContext?.userToken
        const userRole = userContext?.userRole

        const response = await axios.get(getApiUrl("/api/books"), {
          headers:
            userToken && userRole
              ? {
                  Authorization: `${userRole} ${userToken}`,
                }
              : {},
        })
        setBooks(response.data.data.slice(0, 5)) // Show first 5 books in carousel
      } catch (error) {
        console.error("Failed to fetch books:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [userContext])

  const handleBookClick = (bookId: string) => {
    router.push(`/books/${bookId}`)
  }
  console.log(process.env.NEXT_PUBLIC_API_BASE_URL, "aaaaaaaaaaaaaaaa")

  return (
    <div>
      {/* Book Carousel Section */}
      <div className="py-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Welcome to Alex Library
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover our featured collection of books and start your reading
              journey today.
            </p>
          </div>

          <div className="mx-auto w-full max-w-4xl">
            <Carousel>
              <CarouselContent>
                {books.map((book) => (
                  <CarouselItem key={book._id}>
                    <div
                      className="group relative aspect-[16/9] cursor-pointer overflow-hidden rounded-lg bg-muted"
                      onClick={() => handleBookClick(book._id)}
                    >
                      <div
                        className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: book.urlImage
                            ? `url(${book.urlImage})`
                            : "linear-gradient(to bottom right, #dbeafe, #e9d5ff)",
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-black">
                        <h2 className="mb-2 text-5xl font-bold">
                          {book.title}
                        </h2>
                        <p className="mb-2 text-2xl opacity-90">
                          by {book.author}
                        </p>
                        {book.year && (
                          <p className="mb-4 text-sm opacity-80">
                            Published: {book.year}
                          </p>
                        )}
                        {book.rating && (
                          <p className="mb-6 text-lg">
                            ⭐ {book.rating.toFixed(1)}
                          </p>
                        )}
                        <Button variant="secondary">View Details</Button>
                      </div>
                      {book.isActiveAvailableCopies && book.isActiveAdmin && (
                        <div className="absolute top-4 right-4">
                          <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-medium text-white">
                            Available
                          </span>
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="start-4" />
              <CarouselNext className="end-4" />
            </Carousel>
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/books")}
            >
              Browse All Books
            </Button>
          </div>
        </div>
      </div>

      {/* Social Media Trending Section */}
      <SocialMediaTrending2 />
    </div>
  )
}
