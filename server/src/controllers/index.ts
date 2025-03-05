import { router } from '@server/trpc'
import user from './user'

export const appRouter = router({
  user,
})

export type AppRouter = typeof appRouter
