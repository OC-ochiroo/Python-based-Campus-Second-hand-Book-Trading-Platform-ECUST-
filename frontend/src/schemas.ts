import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'At least 6 characters'),
})

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required').min(2, 'At least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z.string().min(1, 'Password is required').min(6, 'At least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    wechat_username: z.string().optional(),
    age: z.number().int().min(1).max(120).optional(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'At least 2 characters'),
  wechat_username: z.string().optional(),
  age: z.number().int().min(1).max(120).optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
  wechat_username?: string
  age?: number
}
export type ProfileFormData = {
  name: string
  wechat_username?: string
  age?: number
}