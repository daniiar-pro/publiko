import { idSchema } from '@server/entities/shared'
import { postRepository } from '@server/repositories/postRepository'
import { publicProcedure } from '@server/trpc'
import provideRepos from '@server/trpc/provideRepos'
import { z } from 'zod'

export default publicProcedure
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
  .query(async ({ input: { id }, ctx: { repos } }) => {
    const posts = await repos.postRepository.getAllPostsBySpecificAuthor(id)

    return posts
  })
