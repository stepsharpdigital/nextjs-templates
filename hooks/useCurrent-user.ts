
"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/server/users"

interface User {
  name: string
  email: string
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { currentUser } = await getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        setError("Failed to fetch user")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  return { user, loading, error }
}