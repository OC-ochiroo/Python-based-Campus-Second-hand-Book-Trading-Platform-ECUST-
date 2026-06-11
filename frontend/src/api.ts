import axios from 'axios'
import type {
  User,
  Post,
  PostCreatePayload,
  PostUpdatePayload,
  Comment,
  CommentCreatePayload,
  ProfileUpdatePayload,
} from './Types'

// ─── Axios instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export default api

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  user: User
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', { email, password })
  return res.data
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', { username, email, password })
  return res.data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

export async function getMe(): Promise<AuthResponse> {
  const res = await api.get<AuthResponse>('/auth/me')
  return res.data
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function updateProfile(payload: ProfileUpdatePayload): Promise<User> {
  const res = await api.put<User>('/users/me', payload)
  return res.data
}

export async function getUserById(userId: number): Promise<User> {
  const res = await api.get<User>(`/auth/users/${userId}`)
  return res.data
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<Post[]> {
  const res = await api.get<Post[]>('/posts')
  return res.data
}

export async function getMyPosts(): Promise<Post[]> {
  const res = await api.get<Post[]>('/posts/me')
  return res.data
}

export async function createPost(payload: PostCreatePayload): Promise<Post> {
  const res = await api.post<Post>('/posts', payload)
  return res.data
}

export async function updatePost(postId: number, payload: PostUpdatePayload): Promise<Post> {
  const res = await api.put<Post>(`/posts/${postId}`, payload)
  return res.data
}

export async function deletePost(postId: number): Promise<void> {
  await api.delete(`/posts/${postId}`)
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export async function getComments(postId: number): Promise<Comment[]> {
  const res = await api.get<Comment[]>(`/posts/${postId}/comments`)
  return res.data
}

export async function createComment(
  postId: number,
  payload: CommentCreatePayload,
): Promise<Comment> {
  const res = await api.post<Comment>(`/posts/${postId}/comments`, payload)
  return res.data
}

export async function deleteComment(postId: number, commentId: number): Promise<void> {
  await api.delete(`/posts/${postId}/comments/${commentId}`)
}