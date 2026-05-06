"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn, getApiUrl } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import axios, { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignupFormData = z.infer<typeof signupSchema>

interface Signup1Props {
  heading?: string
  buttonText?: string
  signupText?: string
  className?: string
}

const Signup1 = ({
  heading = "Signup",
  buttonText = "Create Account",
  signupText = "Already a user?",
  className,
}: Signup1Props) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  })

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)

    const registrationPromise = axios.post(getApiUrl("/api/users/register"), {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      role: "member",
    })

    toast.promise(registrationPromise, {
      loading: "Creating your account...",
      success: (response) => {
        setTimeout(() => router.push("/login"), 1000)
        return "Account created successfully! Redirecting to login..."
      },
      error: (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          setError("root", { message: error.response.data.message })
          return error.response.data.message
        } else {
          setError("root", { message: "Registration failed" })
          return "Registration failed. Please try again."
        }
      },
    })

    try {
      await registrationPromise
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <section
      className={cn("flex items-center justify-center pt-20", className)}
    >
      <div className="flex h-full items-center justify-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-6 lg:justify-start">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md"
          >
            {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
            {errors.root && (
              <div className="w-full rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {errors.root.message}
              </div>
            )}
            <div className="w-full">
              <Input
                type="text"
                placeholder="Name"
                className="text-sm"
                {...register("name")}
              />
              {touchedFields.name && errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <Input
                type="email"
                placeholder="Email"
                className="text-sm"
                {...register("email")}
              />
              {touchedFields.email && errors.email && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="relative w-full">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="pr-10 text-sm"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {touchedFields.password && errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="relative w-full">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="pr-10 text-sm"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-muted-foreground transition-colors hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {touchedFields.confirmPassword && errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : buttonText}
            </Button>
          </form>
          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>{signupText}</p>
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup1
