import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import { useAuth } from './useAuth'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'
import MyPostsPage from './pages/MyPostsPage'
import './App.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth()
  if (isLoading) return <div>Loading...</div>
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />
}

function AppRoutes() {
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/feed" /> : <LoginPage />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/feed" /> : <RegisterPage />} />
        <Route path="/feed" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <FeedPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <ProfilePage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/my-posts" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <MyPostsPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}
