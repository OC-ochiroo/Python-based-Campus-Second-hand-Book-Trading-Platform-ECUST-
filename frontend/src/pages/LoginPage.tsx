import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../schemas'
import { useAuth } from '../useAuth'
import api from '../api'
import LoadingSpinner from '../components/LoadingSpinner'
import './AuthPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post('/auth/login', data)
      setUser(res.data.user)
      navigate('/feed')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      const msg = axiosErr?.response?.data?.detail ?? 'Invalid email or password'
      setError('root', { message: msg })
    }
  }

  return (
    <div className="auth">
      <div className="auth__left">
        <div className="auth__tagline">
          Your next<br />favourite book<br />is waiting.
        </div>
      </div>

      <div className="auth__form-panel">
        <form className="auth__form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth__welcome">Welcome back</div>
          <h2 className="auth__title">Book2Go</h2>

          {errors.root && (
            <div className="auth__error-banner" role="alert">{errors.root.message}</div>
          )}

          <div className="auth__field">
            <label className="auth__label">Email</label>
            <input
              className={`auth__input ${errors.email ? 'auth__input--error' : ''}`}
              type="email"
              placeholder="you@university.edu"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && <span className="auth__error" role="alert">{errors.email.message}</span>}
          </div>

          <div className="auth__field auth__field--last">
            <label className="auth__label">Password</label>
            <input
              className={`auth__input ${errors.password ? 'auth__input--error' : ''}`}
              type="password"
              placeholder="••••••••"
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            {errors.password && <span className="auth__error" role="alert">{errors.password.message}</span>}
          </div>

          <button className="auth__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner size="sm" message="" /> : 'Log in'}
          </button>

          <p className="auth__footer">
            No account?{' '}
            <Link to="/register" className="auth__signup-link">Sign up</Link>
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
