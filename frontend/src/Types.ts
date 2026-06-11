export type Page = "home" | "auth" | "feed" | "profile" | "my-posts"

// Matches backend /auth/me and /auth/login response shape
export interface User {
  id: number
  username: string
  email: string
  wechat_username?: string
  age?: number
  name?: string          // display name, same as username until backend adds it
}

// Frontend display shape for BookCard (derived from Post + owner info)
export interface Book {
  id: number
  title: string
  author: string
  rating: number
  description: string
  owner: string             // username of post owner
  owner_wechat?: string     // wechat_username from owner's user record
  cover: string
  spine: string
  year?: number
  price?: number
  status?: string
  created_at?: string
}

// Matches backend Post model exactly
export interface Post {
  id: number
  user_id: number
  title: string
  author: string
  year?: number
  rating?: number
  price?: number
  description?: string
  status?: string
  created_at?: string
  updated_at?: string
  // joined from User (backend should include this in list responses)
  owner_username?: string
  owner_wechat?: string
}

export interface PostCreatePayload {
  title: string
  author: string
  year?: number
  rating?: number
  price?: number
  description?: string
}

export interface PostUpdatePayload {
  title?: string
  author?: string
  year?: number
  rating?: number
  price?: number
  description?: string
  status?: string
}

export interface Comment {
  id: number
  post_id: number
  user_id: number
  author_username: string
  text: string
  created_at: string
}

export interface CommentCreatePayload {
  text: string
}

export interface Trade {
  id: number
  post_from_id: number
  post_to_id: number
  status: string
  created_at: string
}

export interface ProfileUpdatePayload {
  wechat_username?: string
  age?: number
}