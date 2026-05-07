import { BookDetailClient } from "./BookDetailClient"

interface PageProps {
  params: {
    value?: string
    bookId?: string
    status?: string
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  console.log("Page params:", resolvedParams)
  let bookId: string | undefined
  if (resolvedParams?.value) {
    console.log("params.value:", resolvedParams.value)
    try {
      const match = resolvedParams.value.match(/\\"bookId\\":\\"([^"]+)\\"/)
      console.log("match:", match)
      bookId = match ? match[1] : undefined
    } catch (error) {
      console.error("String parsing error:", error)
      bookId = undefined
    }
  } else {
    bookId = resolvedParams?.bookId
  }
  console.log("Extracted bookId:", bookId)

  if (!bookId) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-[#6B21A8]">Invalid book ID</p>
      </div>
    )
  }

  return <BookDetailClient bookId={bookId} />
}
