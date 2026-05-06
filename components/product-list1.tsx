"use client"

import { useEffect, useState } from "react"
import { Price, PriceValue } from "@/components/price"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn, getApiUrl } from "@/lib/utils"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Star, Search, Filter, ArrowUpDown } from "lucide-react"
import { useContext } from "react"
import { User } from "@/contexts/UserContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ---------------------------------------------------------------------------
// Book Types
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
const fetchBooks = async (userContext: any): Promise<Book[]> => {
  try {
    // Get user token and role from context
    const userToken = userContext?.userToken
    const userRole = userContext?.userRole

    const response = await axios.get(getApiUrl("/api/books"), {
      headers: {
        Authorization: `${userRole} ${userToken}`,
      },
    })
    return response.data.data
  } catch (error) {
    return []
  }
}

interface ProductList1Props {
  className?: string
}

const ProductList1 = ({ className }: ProductList1Props) => {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [filterBy, setFilterBy] = useState("all")
  const userContext = useContext(User)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const fetchedBooks = await fetchBooks(userContext)
        setBooks(fetchedBooks)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [userContext])

  useEffect(() => {
    let filtered = [...books]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by availability
    if (filterBy === "available") {
      filtered = filtered.filter((book) => book.availableCopies > 0)
    } else if (filterBy === "unavailable") {
      filtered = filtered.filter((book) => book.availableCopies === 0)
    }

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "author":
          return a.author.localeCompare(b.author)
        case "year":
          return b.publishedYear - a.publishedYear
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

    setFilteredBooks(filtered)
  }, [books, searchTerm, filterBy, sortBy])

  if (loading) {
    return (
      <section className={cn("py-32", className)}>
        <div className="container">
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#E0AAFF]" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("py-15", className)}>
      <div className="container">
        {/* Search, Filter, and Sort Controls */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter */}
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full border-mauve-300 focus:border-mauve-500 focus:ring-mauve-500 md:w-40">
              <Filter className="mr-2 h-4 w-4 text-mauve-600" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full border-mauve-300 focus:border-mauve-500 focus:ring-mauve-500 md:w-40">
              <ArrowUpDown className="mr-2 h-4 w-4 text-mauve-600" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="author">Author (A-Z)</SelectItem>
              <SelectItem value="year">Year (Newest)</SelectItem>
              <SelectItem value="rating">Rating (Highest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-muted-foreground">
          {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""}{" "}
          found
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-[#6B21A8]">
              No books found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid place-items-center gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const BookCard = ({ book }: { book: Book }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/books/${book._id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="block h-full w-full max-w-md cursor-pointer transition-opacity hover:opacity-80"
    >
      <Card className="h-full overflow-hidden p-0">
        <CardHeader className="relative block p-0">
          <AspectRatio ratio={1.268115942} className="overflow-hidden">
            <img
              src={book.urlImage}
              alt={book.title}
              className="block size-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80"
              }}
            />
          </AspectRatio>
          {/* Rating badge */}
          <div className="absolute top-4 left-4 rounded-full bg-[#E0AAFF] px-2 py-1 text-xs font-medium text-[#10002B] shadow-lg">
            {book.rating.toFixed(1)}
          </div>
          {book.isActiveAvailableCopies && book.isActiveAdmin ? (
            <Badge className="absolute top-4 right-4 bg-green-100 text-green-800">
              Available
            </Badge>
          ) : (
            <Badge className="absolute top-4 right-4 bg-red-100 text-red-800">
              Out of Stock
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex h-full flex-col gap-4 pb-6">
          <CardTitle className="text-xl font-semibold">{book.title}</CardTitle>
          <CardDescription className="font-medium text-muted-foreground">
            by {book.author}
          </CardDescription>
          <CardDescription className="text-sm text-muted-foreground">
            {book.description}
          </CardDescription>
          <div className="mt-auto">
            <div className="mb-2 flex items-center gap-2">
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
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {book.rating.toFixed(1)}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Published: {book.publishedYear}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {book.availableCopies} copies available
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { ProductList1 }
