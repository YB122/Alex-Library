"use client"

import { createContext, useEffect, useState, ReactNode } from "react"

interface UserData {
  [key: string]: unknown
}

interface UserContextType {
  userToken: string | null
  setUserToken: (token: string | null) => void
  userData: UserData | null
  setUserData: (data: UserData | null) => void
  userRole: string | null
  setUserRole: (role: string | null) => void
}

export const User = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  readonly children: ReactNode
}

export default function UserProvider({ children }: UserProviderProps) {
  const [userToken, setUserToken] = useState<string | null>(() => {
    if (typeof globalThis.window !== "undefined") {
      return localStorage.getItem("userToken")
    }
    return null
  })

  const [userData, setUserData] = useState<UserData | null>(() => {
    if (typeof globalThis.window !== "undefined") {
      try {
        const stored = localStorage.getItem("userData")
        return stored ? JSON.parse(stored) : null
      } catch (error) {
        localStorage.removeItem("userData")
        return null
      }
    }
    return null
  })

  const [userRole, setUserRole] = useState<string | null>(() => {
    if (typeof globalThis.window !== "undefined") {
      return localStorage.getItem("userRole")
    }
    return null
  })
  useEffect(() => {
    if (typeof globalThis.window !== "undefined") {
      if (userToken) {
        localStorage.setItem("userToken", userToken)
      } else {
        localStorage.removeItem("userToken")
      }
    }
  }, [userToken])

  useEffect(() => {
    if (typeof globalThis.window !== "undefined") {
      if (userData) {
        try {
          localStorage.setItem("userData", JSON.stringify(userData))
        } catch (error) {}
      } else {
        localStorage.removeItem("userData")
      }
    }
  }, [userData])

  useEffect(() => {
    if (typeof globalThis.window !== "undefined") {
      if (userRole) {
        localStorage.setItem("userRole", userRole)
      } else {
        localStorage.removeItem("userRole")
      }
    }
  }, [userRole])

  return (
    <User.Provider
      value={{
        userToken,
        setUserToken,
        userData,
        setUserData,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </User.Provider>
  )
}
