import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { Users } from '@server/database'
import { idSchema } from './shared'

export const userSchema = z.object({
  id: idSchema,

  email: z.string().trim().toLowerCase().email(),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password must be at most 64 characters long'),
  username: z.string().min(1).max(500),
})

// List keys that we will return to the client
export const userKeysAll = Object.keys(userSchema.shape) as (keyof Users)[]

export const userKeysPublic = ['id', 'username'] as const

export type UserPublic = Pick<
  Selectable<Users>,
  (typeof userKeysPublic)[number]
>

// a specifict schema for authenticated user that is used in JWT
export const authUserSchema = userSchema.pick({ id: true })
export type AuthUser = z.infer<typeof authUserSchema>
