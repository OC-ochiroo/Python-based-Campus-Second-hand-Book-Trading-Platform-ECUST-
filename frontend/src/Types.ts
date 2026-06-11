export type Page = "home" | "auth" | "feed" | "profile" | "my-posts"

export interface Book {
  id: number
  title: string
  author: string
  rating: number
  description: string
  owner: string
  cover: string
  spine: string
}

export interface User {
  id: number
  username: string
  email: string
}

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
}