import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { Posts } from '@server/database/types'
import { idSchema } from './shared'

export const postSchema = z.object({
  id: idSchema,
  title: z.string().min(1).max(500),
  content: z.string().min(1).max(100000),
  authorId: idSchema,
})

export const postKeysAll = Object.keys(postSchema.shape) as (keyof Posts)[]

// export const articleKeysPublic = articleKeysAll
export const postKeysPublic = postKeysAll

export type PostPublic = Pick<
  Selectable<Posts>,
  (typeof postKeysPublic)[number]
>
