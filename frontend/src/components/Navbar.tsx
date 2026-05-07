import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import api from '../api'
import Btn from './Btn'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // clear local state regardless
    }
    logout()
    navigate('/')
  }

  const link = (label: string, path: string) => (
    <button
      onClick={() => navigate(path)}
      className={`navbar__link ${location.pathname === path ? 'navbar__link--active' : 'navbar__link--inactive'}`}
    >
      {label}
    </button>
  )

  return (
    <nav className="navbar">
      <button className="navbar__logo" onClick={() => navigate('/')}>
        Book2Go
      </button>
      <div className="navbar__links">
        {isLoggedIn && link('Feed', '/feed')}
        {isLoggedIn && link('My Posts', '/my-posts')}
        {isLoggedIn && link('Profile', '/profile')}
      </div>
      <div>
        {isLoggedIn
          ? <Btn label="Log out" secondary onClick={handleLogout} />
          : <Btn label="Log in" onClick={() => navigate('/login')} />}
      </div>
    </nav>
  )
}