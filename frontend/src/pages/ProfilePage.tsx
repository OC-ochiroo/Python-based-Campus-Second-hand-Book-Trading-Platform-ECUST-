import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '../schemas'
import { useAuth } from '../useAuth'
import { MY_BOOKS } from '../data'
import Stars from '../components/Stars'
import api from '../api'
import './ProfilePage.css'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
    setError,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      wechat_username: user?.wechat_username || '',
      age: user?.age,
    },
  })

  // Sync form if user changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        wechat_username: user.wechat_username || '',
        age: user.age,
      })
    }
  }, [user, reset])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const res = await api.put('/users/me', {
        name: data.name,
        wechat_username: data.wechat_username || undefined,
        age: data.age || undefined,
      })
      setUser(res.data)
      reset(data) // clears isDirty
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to save changes'
      setError('root', { message: msg })
    }
  }

  const initials = user?.name?.charAt(0).toUpperCase() || '?'

  return (
    <div className="page">
      <h2 className="page__title">My Profile</h2>
      <div className="page__divider" />

      <div className="profile__grid">
        <div className="profile__left">
          <div className="profile__avatar-wrap">
            <div className="profile__avatar">{initials}</div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {errors.root && (
              <div className="profile__error-banner">{errors.root.message}</div>
            )}

            <div className="profile__fields">
              <div className="field">
                <label className="field__label">Name</label>
                <input
                  className={`field__input ${errors.name ? 'field__input--error' : ''}`}
                  {...register('name')}
                />
                {errors.name && <span className="profile__error">{errors.name.message}</span>}
              </div>

              <div className="field">
                <label className="field__label">Email</label>
                <input
                  className="field__input"
                  value={user?.email || ''}
                  readOnly
                  style={{ color: 'var(--color-ink-muted)' }}
                />
              </div>

              <div className="field">
                <label className="field__label">WeChat username</label>
                <input
                  className="field__input"
                  placeholder="your_wechat_id"
                  {...register('wechat_username')}
                />
              </div>

              <div className="field">
                <label className="field__label">Age</label>
                <input
                  className={`field__input ${errors.age ? 'field__input--error' : ''}`}
                  type="number"
                  placeholder="22"
                  {...register('age', { valueAsNumber: true })}
                />
                {errors.age && <span className="profile__error">{errors.age.message}</span>}
              </div>
            </div>

            <div className="profile__actions">
              <button
                type="submit"
                className={`profile__btn profile__btn--edit ${isDirty ? 'active' : ''}`}
                disabled={!isDirty || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : isDirty ? 'Save changes' : 'No changes'}
              </button>
              <button
                type="button"
                className="profile__btn profile__btn--delete"
                onClick={() => reset()}
                disabled={!isDirty}
              >
                Discard
              </button>
            </div>
          </form>
        </div>

        <div className="profile__right">
          <div className="page__header" style={{ marginBottom: 28 }}>
            <h3 className="profile__recent-title">Recent posts</h3>
            <button className="ghost-btn" onClick={() => navigate('/my-posts')}>
              My posts →
            </button>
          </div>

          {MY_BOOKS.slice(0, 2).map(b => (
            <div key={b.id} className="profile__book-item">
              <div className="profile__book-cover" style={{ background: b.cover }} />
              <div>
                <div className="profile__book-title">{b.title}</div>
                <div className="profile__book-author">{b.author}</div>
                <div className="profile__book-stars"><Stars rating={b.rating} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}