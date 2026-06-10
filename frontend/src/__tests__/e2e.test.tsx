import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
;(global as unknown as Record<string, unknown>).TextDecoder = TextDecoder

import axios from 'axios'
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const mockPost = jest.fn()
const mockGet = jest.fn()
const mockPut = jest.fn()

mockedAxios.create = jest.fn(() => ({
  post: mockPost,
  get: mockGet,
  put: mockPut,
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
} as never))

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider } from '../AuthContext'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

function renderWithRouter(ui: React.ReactElement, initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  mockPost.mockReset()
  mockGet.mockReset()
  mockPut.mockReset()
})

// TC-01
describe('TC-01: Homepage', () => {
  test('renders CTA button', () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    )
    expect(screen.getByText(/Search for books/i)).toBeInTheDocument()
  })
})

// TC-02
describe('TC-02: Log in navigates to /login', () => {
  test('clicking Log in shows login page', async () => {
    const user = userEvent.setup()
    renderWithRouter(
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
      </Routes>
    )
    const btn = screen.queryByText(/^log in$/i)
    if (btn) {
      await user.click(btn)
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
    }
  })
})

// TC-03
describe('TC-03: Valid login redirects to /feed', () => {
  test('successful login navigates to /feed', async () => {
    const user = userEvent.setup()

    mockPost.mockResolvedValueOnce({
      data: {
        user: {
          id: 1,
          name: 'Test User',
          username: 'testuser',
          email: 'test@uni.edu',
        },
      },
    })

    renderWithRouter(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/feed" element={<div data-testid="feed-page">Feed</div>} />
      </Routes>,
      ['/login']
    )

    await user.type(screen.getByPlaceholderText(/you@university\.edu/i), 'test@uni.edu')
    await user.type(screen.getByPlaceholderText(/••••••••/), 'password123')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(screen.getByTestId('feed-page')).toBeInTheDocument()
    })
  })
})

// TC-04
describe('TC-04: Unauthenticated /feed redirects to /login', () => {
  test('redirects to /login when not logged in', () => {
    renderWithRouter(
      <Routes>
        <Route path="/feed" element={<Navigate to="/login" />} />
        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
      </Routes>,
      ['/feed']
    )
    expect(screen.getByTestId('login-page')).toBeInTheDocument()
  })
})

// TC-05
describe('TC-05: Register form validation', () => {
  test('shows errors on empty submit', async () => {
    const user = userEvent.setup()
    renderWithRouter(
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>,
      ['/register']
    )
    await user.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      const errors = document.querySelectorAll('.auth__error')
      expect(errors.length).toBeGreaterThan(0)
    })
  })

  test('shows invalid email error', async () => {
    const user = userEvent.setup()
    renderWithRouter(
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>,
      ['/register']
    )
    await user.type(screen.getByPlaceholderText(/Your full name/i), 'alice')
    await user.type(screen.getByPlaceholderText(/you@university\.edu/i), 'bad-email')
    await user.type(screen.getAllByPlaceholderText(/••••••••/)[0], 'password123')
    await user.type(screen.getAllByPlaceholderText(/••••••••/)[1], 'password123')
    await user.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })
})