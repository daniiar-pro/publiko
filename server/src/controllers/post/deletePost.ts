import { TRPCError } from '@trpc/server'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { postRepository } from '@server/repositories/postRepository'
import { idSchema } from '@server/entities/shared'

export const deletePost = authenticatedProcedure
  .use(
    provideRepos({
      postRepository,
    })
  )
  .input(idSchema)
  .mutation(async ({ input: postId, ctx: { authUser, repos } }) => {
    const post = await repos.postRepository.findById(postId)
    if (!post) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Post not found',
      })
    }

    if (post.authorId !== authUser.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Forbidden: You are not allowed to delete this post',
      })
    }

    await repos.postRepository.delete(postId)

    return { message: 'Post deleted successfully' }
  })
