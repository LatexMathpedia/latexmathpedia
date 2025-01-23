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
  error: string | null
  login: (email: string, password: string) => Promise<{ success: boolean, error?: string }>
  register: (email: string, password: string, nombre: string, apellidos: string) => Promise<{ success: boolean, error?: string }>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser && JSON.parse(storedUser).expiry > new Date().toISOString()) {
          setUser(JSON.parse(storedUser))
          console.log(JSON.parse(storedUser).admin)
        }
      } catch (error) {
        console.error("Error checking session:", error)
      }
    }
    checkSession()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean, error?: string }> => {
    try {
      const res = await fetch(API_ROUTES.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const userData = await res.json()
        if (userData.user) {
          setUser(userData)
          const expiry = new Date()
          expiry.setDate(expiry.getDate() + 7)
          localStorage.setItem('user', JSON.stringify({ ...userData, expiry: expiry.toISOString() }))
          router.push("/")
          return { success: true }
        } else {
          return { success: false, error: userData.error || "Error desconocido" }
        }
      } else {
        const errorData = await res.json()
        return { success: false, error: errorData.error || "Error desconocido" }
      }
    } catch (error) {
      console.error("Error during login:", error)
      return { success: false, error: "Error de red" }
    }
  }

  const register = async (email: string, password: string, nombre: string, apellidos: string): Promise<{ success: boolean, error?: string }> => {
    try {
      const res = await fetch(API_ROUTES.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nombre, apellidos }),
      })
      if (res.ok) {
        const userData = await res.json()
        if (userData.user) {
          setUser(userData.user)
          const expiry = new Date()
          expiry.setDate(expiry.getDate() + 7)
          localStorage.setItem('user', JSON.stringify({ ...userData.user, expiry: expiry.toISOString() }))
          logout()
          router.push("/login")
          return { success: true }
        } else {
          return { success: false, error: userData.error || "Error desconocido" }
        }
      } else {
        const errorData = await res.json()
        return { success: false, error: errorData.error || "Error desconocido" }
      }
    } catch (error) {
      console.error("Error during registration:", error)
      return { success: false, error: "Error de red" }
    }
  }

  const logout = async () => {
    try {
      await fetch(API_ROUTES.logout, { method: "POST", body: JSON.stringify({user}) })
      setUser(null)
      localStorage.removeItem("user")
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

  return <AuthContext.Provider value={{ user, error, login, register, logout, updateUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
