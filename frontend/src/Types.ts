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

// API types matching backend models
export interface User {
  id: number
  name: string
  email: string
  wechat_username?: string
  age?: number
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