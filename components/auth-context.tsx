"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_ROUTES } from "@/lib/api-config"

type User = {
  admin: boolean
  apellidos: string
  nombre: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<Boolean>
  register: (email: string, password: string, nombre: string, apellidos: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(API_ROUTES.checkSession)
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Error checking session:", error)
      }
    }
    checkSession()
  }, [])

  const login = async (email: string, password: string): Promise<Boolean> => {
    try {
      const res = await fetch(API_ROUTES.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
        router.push("/")
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error("Error during login:", error)
      return false
    }
  }

  const register = async (email: string, password: string, nombre: string, apellidos: string) => {
    try {
      const res = await fetch(API_ROUTES.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nombre, apellidos }),
      })
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
        router.push("/")
      } else {
        throw new Error("Error en el registro")
      }
    } catch (error) {
      console.error("Error during registration:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch(API_ROUTES.logout, { method: "POST" })
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  const updateUser = async (updates: Partial<User>) => {
    try {
      const res = await fetch(API_ROUTES.updateUser + user?.email, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        const updatedUserData = await res.json()
        setUser(updatedUserData)
      } else {
        throw new Error("Error al actualizar el usuario")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

