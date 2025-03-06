import { router } from '@server/trpc'
import user from './user'
import post from './post'

export const appRouter = router({
  user,
  post
})

export type AppRouter = typeof appRouter
