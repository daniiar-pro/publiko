import { publicProcedure } from '@server/trpc'

export default publicProcedure.mutation(() => ({
  message:
    'Logged out successfully. Please remove the Authorization header from tRPC Panel.',
}))
