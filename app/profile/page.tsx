"use client"

import { useEffect, useState } from "react"
import { useContext } from "react"
import { toast } from "sonner"
import axios from "axios"
import { User } from "@/contexts/UserContext"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { getApiUrl } from "@/lib/utils"

interface Book {
  _id: string
  title: string
  author: string
  urlImage: string
}

interface Transaction {
  _id: string
  bookId: Book
  userId: string
  borrowDate: string
  dueDate: string
  returnDate?: string
  status: string
}

export default function page() {
  const userContext = useContext(User)
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider")
  }
  const { userToken, userRole, userData } = userContext
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const handleBookClick = (bookId: string) => {
    router.push(`/books/${bookId}`)
  }

  useEffect(() => {
    if (!userToken || !userRole || !userData) {
      toast.error("You must be logged in to view your profile")
      redirect("/login")
    }
    const fetchUserTransactions = async () => {
      if (!userToken || !userRole) {
        toast.error("You must be logged in to view your profile")
        return
      }

      try {
        const response = await axios.get(getApiUrl("/api/transactions/user"), {
          headers: {
            Authorization: `${userRole} ${userToken}`,
          },
        })
        setTransactions(response.data.data)
      } catch (error: any) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Failed to fetch your borrowed books")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserTransactions()
  }, [userToken, userRole])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#E0AAFF]" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* User Information Section */}
      <div className="mb-8 rounded-lg border bg-card p-6">
        <h1 className="mb-6 text-3xl font-bold">My Profile</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold">User Information</h2>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {(userData?.name as string) ?? "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {(userData?.email as string) ?? "N/A"}
              </p>
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold">Account Summary</h2>
            <div className="space-y-2">
              <p>
                <strong>Total Books Borrowed:</strong> {transactions.length}
              </p>

              <p>
                <strong>Returned Books:</strong>{" "}
                {transactions.filter((t) => t.status === "returned").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Borrowed Books Section */}
      <h2 className="mb-6 text-2xl font-bold">My Borrowed Books</h2>

      {transactions.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            You haven't borrowed any books yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md"
              onClick={() => handleBookClick(transaction.bookId._id)}
            >
              <div className="aspect-w-3 aspect-h-4 mb-4">
                <img
                  src={transaction.bookId.urlImage}
                  alt={transaction.bookId.title}
                  className="h-48 w-full rounded-md object-cover"
                />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                {transaction.bookId.title}
              </h3>
              <p className="mb-1 text-sm text-muted-foreground">
                by {transaction.bookId.author}
              </p>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Borrowed:</strong>{" "}
                  {new Date(transaction.borrowDate).toLocaleDateString()}
                </p>

                <p>
                  <strong>Status:</strong>
                  <span
                    className={`ml-1 rounded-full px-2 py-1 text-xs ${
                      transaction.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
