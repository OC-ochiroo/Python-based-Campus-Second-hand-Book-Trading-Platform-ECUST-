import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '../schemas'
import { useAuth } from '../AuthContext'
import api from '../api'
import LoadingSpinner from '../components/LoadingSpinner'
import './AuthPage.css'

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
        name: data.name,
        email: data.email,
        password: data.password,
        wechat_username: data.wechat_username || undefined,
        age: data.age || undefined,
      })
      setUser(res.data.user)
      navigate('/feed')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      const msg = axiosErr?.response?.data?.detail ?? 'Registration failed'
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
            <div className="auth__error-banner" role="alert">{errors.root.message}</div>
          )}

          <div className="auth__field">
            <label className="auth__label">Name</label>
            <input className={`auth__input ${errors.name ? 'auth__input--error' : ''}`}
              placeholder="Your full name" {...register('name')} aria-invalid={!!errors.name} />
            {errors.name && <span className="auth__error" role="alert">{errors.name.message}</span>}
          </div>

          <div className="auth__field">
            <label className="auth__label">Email</label>
            <input className={`auth__input ${errors.email ? 'auth__input--error' : ''}`}
              type="email" placeholder="you@university.edu" {...register('email')} aria-invalid={!!errors.email} />
            {errors.email && <span className="auth__error" role="alert">{errors.email.message}</span>}
          </div>

          <div className="auth__field">
            <label className="auth__label">Password</label>
            <input className={`auth__input ${errors.password ? 'auth__input--error' : ''}`}
              type="password" placeholder="••••••••" {...register('password')} aria-invalid={!!errors.password} />
            {errors.password && <span className="auth__error" role="alert">{errors.password.message}</span>}
          </div>

          <div className="auth__field auth__field--last">
            <label className="auth__label">Confirm Password</label>
            <input className={`auth__input ${errors.confirmPassword ? 'auth__input--error' : ''}`}
              type="password" placeholder="••••••••" {...register('confirmPassword')}
              aria-invalid={!!errors.confirmPassword} />
            {errors.confirmPassword && <span className="auth__error" role="alert">{errors.confirmPassword.message}</span>}
          </div>

          <button className="auth__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><LoadingSpinner size="sm" message="" /> Creating…</> : 'Create account'}
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