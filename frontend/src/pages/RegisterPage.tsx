import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../useAuth'
import api from '../api'
import './AuthPage.css'

const registerSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await api.post('/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password,
      })
      setUser(res.data.user)
      navigate('/feed')
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Registration failed'
      setError('root', { message: msg })
    }
  }

  return (
    <div className="auth">
      <div className="auth__left">
        <div className="auth__tagline">
          Join thousands<br />of readers<br />today.
        </div>
      </div>

      <div className="auth__form-panel">
        <form className="auth__form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth__welcome">Create account</div>
          <h2 className="auth__title">Book2Go</h2>

          {errors.root && (
            <div className="auth__error-banner">{errors.root.message}</div>
          )}

          <div className="auth__field">
            <label className="auth__label">Username</label>
            <input
              className={`auth__input ${errors.username ? 'auth__input--error' : ''}`}
              placeholder="your_username"
              {...register('username')}
            />
            {errors.username && <span className="auth__error">{errors.username.message}</span>}
          </div>

          <div className="auth__field">
            <label className="auth__label">Email</label>
            <input
              className={`auth__input ${errors.email ? 'auth__input--error' : ''}`}
              type="email"
              placeholder="you@university.edu"
              {...register('email')}
            />
            {errors.email && <span className="auth__error">{errors.email.message}</span>}
          </div>

          <div className="auth__field">
            <label className="auth__label">Password</label>
            <input
              className={`auth__input ${errors.password ? 'auth__input--error' : ''}`}
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && <span className="auth__error">{errors.password.message}</span>}
          </div>

          <div className="auth__field auth__field--last">
            <label className="auth__label">Confirm Password</label>
            <input
              className={`auth__input ${errors.confirmPassword ? 'auth__input--error' : ''}`}
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <span className="auth__error">{errors.confirmPassword.message}</span>}
          </div>

          <button className="auth__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>

          <p className="auth__footer">
            Already have an account?{' '}
            <Link to="/login" className="auth__signup-link">Log in</Link>
          </p>
        </form>
      </div>

      <div className="auth__right">
        <div className="auth__quote">
          "A reader lives<br />a thousand lives."
        </div>
      </div>
    </div>
  )
}