"use client"

import { useState } from "react"
import type { User, LoginCredentials } from "@/types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async ({ email, password }: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Penting untuk cookies
        body: JSON.stringify({ email, password }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }
      
      const data = await response.json()
      setUser(data.user)
      
      // Simpan token jika menggunakan token-based auth
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      
      return data.user
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { user, login, isLoading, error }
}