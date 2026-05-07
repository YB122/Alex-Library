"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleCheck, Star, StarHalf } from "lucide-react"
import type { ControllerRenderProps } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { useContext } from "react"
import z from "zod"
import axios from "axios"
import { toast } from "sonner"
import { User } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn, getApiUrl } from "@/lib/utils"

type StockStatusCode = "IN_STOCK" | "OUT_OF_STOCK"

interface StockInfo {
  stockStatusCode?: StockStatusCode
  stockQuantity?: number
}

type option = {
  id: string
  label: string
  stockInfo: StockInfo
  color?: string
  value: string
}

interface Hinges {
  label: string
  id: string
  name: FieldName
  options?: option[]
  min?: number
  max?: number
}

interface ProductImagesProps {
  images: Array<{
    srcset: string
    src: string
    alt: string
    width: number
    height: number
    sizes: string
  }>
}

interface ReviewsProps {
  rate: number
}

interface PriceProps {
  regular: number
  sale?: number
  currency: string
  text?: string
}

interface ProductInfoProps {
  info?: Array<{
    label: string
    value: string
  }>
}

type FormType = z.infer<typeof formSchema>
type FieldName = keyof FormType

type SizeOptionProps = option

interface RadioGroupProps {
  options?: Array<option>
  field: ControllerRenderProps<FormType>
}

interface ProductFormProps {
  hinges?: Record<FieldName, Hinges>
  selected: FormType
}

const MAX_STARS = 5

const PRODUCT_DETAILS = {
  name: "Urban Chill Jacket",
  color: "blue",
  size: "m",
  reviews: {
    rate: 3.5,
  },
  description:
    "This denim puffer jacket blends warmth and street style, featuring tonal blue shades for a distinctive look that's both bold and versatile. Designed for comfort in any season.",

  images: [
    {
      srcset:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-1.jpg 640w",
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-3.jpg",
      alt: "",
      width: 1920,
      height: 2880,
      sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
    },
    {
      srcset:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-2.jpg 640w",
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-3.jpg",
      alt: "",
      width: 1920,
      height: 2880,
      sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
    },
    {
      srcset:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-1.jpg 640w",
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-3.jpg",
      alt: "",
      width: 1920,
      height: 2880,
      sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
    },
    {
      srcset:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-1.jpg 640w",
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-3.jpg",
      alt: "",
      width: 1920,
      height: 2880,
      sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
    },
  ],
}

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

interface ProductDetail1Props {
  className?: string
  book?: Book
}

const ProductDetail1 = ({ className, book }: ProductDetail1Props) => {
  const userContext = useContext(User)
  if (!userContext) {
    throw new Error("ProductDetail1 must be used within a UserProvider")
  }
  const { userToken, userRole, userData } = userContext
  const router = useRouter()
  console.log(book.'book')
  console.log(book._id,'book id')

  const handleBorrow = async () => {
    if (!book || !userToken || !userRole || !userData) {
      toast.error("You must be logged in to borrow a book")
      return
    }

    try {
      await axios.post(
        getApiUrl(`/api/transactions/borrow/${userData._id}/${book._id}`),
        {},
        {
          headers: {
            Authorization: `${userRole} ${userToken}`,
          },
        }
      )

      toast.success("Book borrowed successfully!")
      router.push("/profile")
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } }
        }
        if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message)
        } else {
          toast.error("Failed to borrow book")
        }
      } else {
        toast.error("Failed to borrow book")
      }
    }
  }

  // Use book data if provided, otherwise fall back to default data
  const productData = book
    ? {
        name: book.title,
        description: book.description,
        reviews: {
          rate: book.rating,
        },
        images: [
          {
            srcset: `${book.urlImage} 1920w, ${book.urlImage} 1280w, ${book.urlImage} 640w`,
            src: book.urlImage,
            alt: book.title,
            width: 1920,
            height: 1080,
            sizes:
              "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
          },
        ],
      }
    : PRODUCT_DETAILS
  return (
    <section className={cn("py-15", className)}>
      <div className="container">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <ProductImages images={productData.images} />
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                    {productData.name}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <Reviews rate={productData.reviews.rate} />
                    <Badge
                      variant={
                        book &&
                        book.isActiveAvailableCopies &&
                        book.isActiveAdmin
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      <CircleCheck />
                      {book &&
                      book.isActiveAvailableCopies &&
                      book.isActiveAdmin
                        ? "In Stock"
                        : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">{productData.description}</p>
            </div>

            <Button size="lg" className="w-full" onClick={handleBorrow}>
              Borrow Now
            </Button>

            <ProductForm
              selected={{
                color: "",
                quantity: 1,
                size: "",
              }}
            />

            {book && (
              <ProductInfo
                info={[
                  {
                    label: "Author",
                    value: book.author,
                  },
                  {
                    label: "Published Year",
                    value: book.publishedYear.toString(),
                  },
                  {
                    label: "Available Copies",
                    value: book.availableCopies.toString(),
                  },
                  {
                    label: "Status",
                    value: book.isActiveAvailableCopies
                      ? "Available"
                      : "Not Available",
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const ProductInfo = ({ info }: ProductInfoProps) => {
  if (!info) return

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Book Details</h2>
      <dl>
        {info.map((item, index) => (
          <div
            key={`product-detail-1-info-${index}`}
            className="flex items-center justify-between border-b py-3 last:border-b-0"
          >
            <dt className="text-sm font-medium text-muted-foreground">
              {item.label}
            </dt>
            <dd className="text-sm font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

const ProductImages = ({ images }: ProductImagesProps) => {
  return (
    <Carousel
      opts={{
        breakpoints: {
          "(min-width: 768px)": {
            active: false,
          },
        },
      }}
    >
      <CarouselContent className="gap-4 md:m-0 md:grid md:grid-cols-3 xl:gap-5">
        {images.map((img, index) => (
          <CarouselItem
            className="first:col-span-3 md:p-0"
            key={`product-detail-1-image-${index}`}
          >
            <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
              <img
                srcSet={img.srcset}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes={img.sizes}
                className="block size-full object-cover object-center"
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="md:hidden">
        <CarouselPrevious className="start-4" />
        <CarouselNext className="end-4" />
      </div>
    </Carousel>
  )
}

const Reviews = ({ rate }: ReviewsProps) => {
  const renderStars = () => {
    const fullStars = Math.floor(rate)
    const hasHalfStar = rate % 1 >= 0.5
    const emptyStars = MAX_STARS - fullStars - (hasHalfStar ? 1 : 0)

    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`product-detail-1-star-full-${i}`}
          className="size-4 fill-yellow-500 stroke-yellow-500"
        />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="product-detail-1-half-star" className="relative size-4">
          <StarHalf className="absolute end-0 top-0 size-full fill-yellow-500 stroke-yellow-500" />
          <StarHalf className="absolute start-0 top-0 size-full -scale-x-100 fill-black/15 stroke-black/15 dark:invert" />
        </div>
      )
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`product-detail-1-star-empty-${i}`}
          className="size-4 fill-black/15 stroke-black/15 dark:invert"
        />
      )
    }

    return stars
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">{renderStars()}</div>
    </div>
  )
}

const formSchema = z.object({
  color: z.string(),
  quantity: z.number().min(1),
  size: z.string(),
})

const ProductForm = ({ hinges, selected }: ProductFormProps) => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: selected?.color,
      size: selected?.size,
      quantity: selected?.quantity,
    },
  })

  function onSubmit(values: FormType) {}

  const sizeHinges = hinges?.size

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {sizeHinges && (
        <Controller
          control={form.control}
          name={sizeHinges.name}
          render={({ field }) => (
            <fieldset className="space-y-3">
              <legend className="text-base font-semibold">
                {sizeHinges.label}
              </legend>
              <SizeRadioGroup field={field} options={sizeHinges.options} />
            </fieldset>
          )}
        />
      )}
    </form>
  )
}

const SizeRadioGroup = ({ options, field }: RadioGroupProps) => {
  if (!options) return

  return (
    <RadioGroup
      {...field}
      value={`${field.value}`}
      onValueChange={(value) => {
        if (value != field.value && value) {
          field.onChange(value)
        }
      }}
      className="flex flex-wrap gap-3"
    >
      {options &&
        options.map((item, index) => (
          <SizeOption
            key={`product-detail-1-size-input-${index}`}
            stockInfo={item.stockInfo}
            id={item.id}
            label={item.label}
            value={item.value}
          />
        ))}
    </RadioGroup>
  )
}

const SizeOption = ({ id, label, stockInfo, value }: SizeOptionProps) => {
  const isOutOfStock = stockInfo.stockStatusCode === "OUT_OF_STOCK"

  return (
    <label
      htmlFor={id}
      className="relative flex h-10 w-16 cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground has-checked:bg-primary has-checked:text-primary-foreground has-disabled:pointer-events-none has-disabled:opacity-50"
    >
      <RadioGroupItem
        id={id}
        className="absolute size-px overflow-hidden opacity-0"
        value={value}
        disabled={isOutOfStock}
      />
      <span className="uppercase">{label}</span>
      {isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-px w-full rotate-45 bg-border"></div>
        </div>
      )}
    </label>
  )
}

export { ProductDetail1 }
