import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from './types'

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoggedIn: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn: !!user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}