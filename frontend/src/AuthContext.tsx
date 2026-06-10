import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from './Types.ts'
import api from './api'
import { AuthContext } from './useAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get('/auth/me')
        setUser(res.data.user)
      } catch (err) {
        console.log(err)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isLoggedIn: !!user,
      isLoading,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}
