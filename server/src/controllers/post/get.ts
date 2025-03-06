import { idSchema } from '@server/entities/shared'
import { postRepository } from '@server/repositories/postRepository'
import { publicProcedure } from '@server/trpc'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default publicProcedure
  .use(
    provideRepos({
      postRepository,
    })
  )
  .input(idSchema)
  .query(async ({ input: postId, ctx: { repos } }) => {
    const post = await repos.postRepository.findById(postId)

    if (!post) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Post was not found',
      })
    }

    return post
  })
