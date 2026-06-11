import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '../schemas'
import { useAuth } from '../useAuth'
import type { Book } from '../Types'
import { getMyPosts, updateProfile } from '../api'
import Stars from '../components/Stars'
import LoadingSpinner from '../components/LoadingSpinner'
import './ProfilePage.css'

const COVER_PALETTE = [
  { cover: "#2c3e50", spine: "#1a252f" },
  { cover: "#5c4a1e", spine: "#3d3014" },
  { cover: "#4a2040", spine: "#321529" },
  { cover: "#1e3a5f", spine: "#132540" },
];

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [recentBooks, setRecentBooks] = useState<Book[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
    setError,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || user?.username || '',
      wechat_username: user?.wechat_username || '',
      age: user?.age,
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || user.username,
        wechat_username: user.wechat_username || '',
        age: user.age,
      })
    }
  }, [user, reset])

  useEffect(() => {
    let cancelled = false
    getMyPosts()
      .then((posts) => {
        if (!cancelled) {
          setRecentBooks(
            posts.slice(0, 2).map((p, i) => ({
              id: p.id,
              title: p.title,
              author: p.author ?? '',
              rating: p.rating ?? 0,
              description: p.description ?? '',
              owner: p.owner_username ?? 'me',
              cover: COVER_PALETTE[i % COVER_PALETTE.length].cover,
              spine: COVER_PALETTE[i % COVER_PALETTE.length].spine,
            }))
          )
        }
      })
      .catch(() => { /* recent posts are non-critical, fail silently */ })
    return () => { cancelled = true }
  }, [])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updated = await updateProfile({
        wechat_username: data.wechat_username || undefined,
        age: data.age || undefined,
      })
      // merge returned fields back into auth context user
      setUser({ ...user!, ...updated })
      reset(data)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      const msg = axiosErr?.response?.data?.detail ?? 'Failed to save changes'
      setError('root', { message: msg })
    }
  }

  const initials = (user?.name || user?.username)?.charAt(0).toUpperCase() ?? '?'

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
              <div className="profile__error-banner" role="alert">{errors.root.message}</div>
            )}

            <div className="profile__fields">
              <div className="field">
                <label className="field__label">Display name</label>
                <input className={`field__input ${errors.name ? 'field__input--error' : ''}`}
                  {...register('name')} aria-invalid={!!errors.name} />
                {errors.name && <span className="profile__error" role="alert">{errors.name.message}</span>}
              </div>

              <div className="field">
                <label className="field__label">Email</label>
                <input className="field__input" value={user?.email || ''} readOnly
                  style={{ color: 'var(--color-ink-muted)' }} />
              </div>

              <div className="field">
                <label className="field__label">WeChat username</label>
                <input className="field__input" placeholder="your_wechat_id"
                  {...register('wechat_username')} />
              </div>

              <div className="field">
                <label className="field__label">Age</label>
                <input className={`field__input ${errors.age ? 'field__input--error' : ''}`}
                  type="number" placeholder="22" {...register('age', { valueAsNumber: true })}
                  aria-invalid={!!errors.age} />
                {errors.age && <span className="profile__error" role="alert">{errors.age.message}</span>}
              </div>
            </div>

            <div className="profile__actions">
              <button type="submit"
                className={`profile__btn profile__btn--edit ${isDirty ? 'active' : ''}`}
                disabled={!isDirty || isSubmitting}>
                {isSubmitting
                  ? <><LoadingSpinner size="sm" message="" /> Saving…</>
                  : isDirty ? 'Save changes' : 'No changes'}
              </button>
              <button type="button" className="profile__btn profile__btn--delete"
                onClick={() => reset()} disabled={!isDirty}>
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

          {recentBooks.length === 0 && (
            <p style={{ color: 'var(--color-ink-muted)', fontSize: 14 }}>No posts yet.</p>
          )}

          {recentBooks.map((b) => (
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