"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Pause, Play, Star } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { getApiUrl } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Data Fetching
// ---------------------------------------------------------------------------
const fetchBooks = async (): Promise<Book[]> => {
  try {
    const response = await axios.get(getApiUrl("/api/books"))
    return response.data.data
  } catch (error) {
    return []
  }
}

// ---------------------------------------------------------------------------
// BookCard
// ---------------------------------------------------------------------------
function BookCard({ book }: { book: Book }) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/books/${book._id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="group relative w-52 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-md backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02] sm:w-60 md:w-64 dark:border-white/10 dark:bg-white/10"
    >
      {/* Book image */}
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={book.urlImage}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            // Fallback image if book image fails to load
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80"
          }}
        />
        {/* Rating badge overlay */}
        <div className="absolute top-2 right-2 rounded-full bg-[#E0AAFF] px-2 py-1 text-xs font-medium text-[#10002B] shadow-lg">
          {book.rating.toFixed(1)}
        </div>
      </div>

      {/* Book info */}
      <div className="bg-white/80 px-4 py-3 backdrop-blur-md dark:bg-white/10">
        <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
          {book.title}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(book.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : i < book.rating
                      ? "fill-yellow-200 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SocialMediaTrending2
// ---------------------------------------------------------------------------
export default function SocialMediaTrending2() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const animationRef = useRef<number | null>(null)
  const positionRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)

  // Speed in px/second
  const SPEED = 60

  // Fetch books on component mount
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const fetchedBooks = await fetchBooks()
        setBooks(fetchedBooks)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Wait one tick so the DOM is fully rendered before measuring
    const raf = requestAnimationFrame(() => {
      const halfWidth = track.scrollWidth / 2

      const step = (timestamp: number) => {
        if (paused) {
          lastTimeRef.current = null
          animationRef.current = requestAnimationFrame(step)
          return
        }

        if (lastTimeRef.current === null) {
          lastTimeRef.current = timestamp
        }

        const delta = (timestamp - lastTimeRef.current) / 1000
        lastTimeRef.current = timestamp

        positionRef.current += SPEED * delta

        // Seamless loop: when we've scrolled one full copy width, reset
        if (positionRef.current >= halfWidth) {
          positionRef.current -= halfWidth
        }

        track.style.transform = `translateX(-${positionRef.current}px)`
        animationRef.current = requestAnimationFrame(step)
      }

      animationRef.current = requestAnimationFrame(step)
    })

    return () => {
      cancelAnimationFrame(raf)
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [paused])

  // Duplicate books for seamless infinite loop
  const allBooks = books.length > 0 ? [...books, ...books] : []

  // Show loading state
  if (loading) {
    return (
      <section className="w-full overflow-hidden py-12 dark:bg-muted">
        <div className="flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      </section>
    )
  }

  // Show empty state if no books
  if (books.length === 0) {
    return (
      <section className="w-full overflow-hidden py-12 dark:bg-muted">
        <div className="flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">No books available</p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full overflow-hidden py-12">
      {/* ── Carousel ── */}
      <div
        className="relative w-full overflow-hidden rounded"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div
          role="region"
          aria-label="Books carousel"
          className="relative w-full overflow-hidden"
        >
          <button
            onClick={() => setPaused((p) => !p)}
            className="absolute top-3 right-3 z-20 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-white/10 dark:hover:bg-white/20"
            aria-label={paused ? "Play carousel" : "Pause carousel"}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          {/* Fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#e8dfe8] to-transparent dark:from-muted" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#e8dfe8] to-transparent dark:from-muted" />

          {/* Scrolling track — no flex-wrap, single line */}
          <div
            ref={trackRef}
            className="flex gap-4 will-change-transform"
            style={{ width: "max-content" }}
          >
            {allBooks.map((book, idx) => (
              <BookCard key={`${book._id}-${idx}`} book={book} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
