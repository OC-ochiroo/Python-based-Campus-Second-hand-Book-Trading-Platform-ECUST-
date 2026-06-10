import { createContext, useContext } from 'react'
import type { User } from './Types.ts'

export interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoggedIn: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
