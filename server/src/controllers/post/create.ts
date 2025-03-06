import { postSchema } from '@server/entities/post'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { postRepository } from '@server/repositories/postRepository'

export default authenticatedProcedure

  .use(provideRepos({ postRepository }))

  .input(
    postSchema.pick({
      title: true,
      content: true,
    })
  )

  .mutation(async ({ input: postData, ctx: { authUser, repos } }) => {
    const post = {
      ...postData,
      authorId: authUser.id,
    }

    const postCreated = await repos.postRepository.create(post)

    return postCreated
  })
