"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn, getApiUrl } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { useContext } from "react"
import { User } from "@/contexts/UserContext"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

interface Login1Props {
  heading?: string
  logo?: {
    url: string
    src: string
    alt: string
    title?: string
    className?: string
  }
  buttonText?: string
  signupText?: string
  signupUrl?: string
  className?: string
}

const Login1 = ({
  heading = "Login",
  buttonText = "Login",
  signupText = "Need an account?",
  className,
}: Login1Props) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const userContext = useContext(User)
  if (!userContext) throw new Error("Login1 must be used within UserProvider")

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    const loginPromise = axios.post(getApiUrl("/api/users/login"), {
      email: data.email,
      password: data.password,
    })

    toast.promise(loginPromise, {
      loading: "Signing in...",
      success: (response) => {
        userContext.setUserData(response.data.data)
        userContext.setUserToken(response.data.token)
        userContext.setUserRole(response.data.data.role)
        setTimeout(() => router.push("/"), 1000)
        return "Login successful! Redirecting..."
      },
      error: (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          setError("root", { message: error.response.data.message })
          return error.response.data.message
        } else {
          setError("root", { message: "Login failed" })
          return "Login failed. Please try again."
        }
      },
    })

    try {
      await loginPromise
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : buttonText}
            </Button>
          </form>
          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>{signupText}</p>
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login1
