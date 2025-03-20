import { postSchema } from '@server/entities/post'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { postRepository } from '@server/repositories/postRepository'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure

  .use(provideRepos({ postRepository }))

  .input(
    postSchema.pick({
      id: true,
      title: true,
      content: true,
    })
  )

  .mutation(async ({ input: postData, ctx: { authUser, repos } }) => {
    const postAuthorId = await repos.postRepository.getPostAuthorId(postData.id)

    if (!postAuthorId || postAuthorId.authorId !== authUser.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Forbidden: You are not allowed to edit this post',
      })
    }

    const { id, ...updateFields } = postData

    const postUpdated = {
      ...updateFields,
      authorId: authUser.id,
    }

    await repos.postRepository.editPostById(id, postUpdated)

    return postUpdated
  })
