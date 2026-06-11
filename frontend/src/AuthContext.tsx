import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from './Types'
import { getMe, logout as apiLogout } from './api'
import { AuthContext } from './useAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await getMe()
        setUser(data.user)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const logout = async () => {
    try {
      await apiLogout()
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn: !!user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}