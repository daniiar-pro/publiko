import { publicProcedure } from '@server/trpc'

export default publicProcedure.query(() => 'Some string')
