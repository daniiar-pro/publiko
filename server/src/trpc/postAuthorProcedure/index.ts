import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { postRepository } from '@server/repositories/postRepository'
import { idSchema } from '@server/entities/shared'
import provideRepos from '../provideRepos'

export const postAuthorProcedure = authenticatedProcedure
  .use(
    provideRepos({
      postRepository,
    })
  )
  .input(
    z.object({
      id: idSchema,
    })
  )
  .use(async ({ input: { id }, ctx: { authUser, repos }, next }) => {
    const hasSameUserId = await repos.postRepository.hasUserId(id, authUser.id)

    if (!hasSameUserId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Post does not belong to the user',
      })
    }

    return next()
  })
