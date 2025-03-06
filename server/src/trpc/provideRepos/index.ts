import type {
  Repositories,
  RepositoriesFactories,
  RepositoriesKeys,
} from '@server/repositories'
import { middleware } from '..'

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

const none: Partial<Repositories> = {}

/**
 * Middleware that provides repositories for the specified entities in the context.
 * @param reposFactoriesWanted An object containing the entities for which repositories are wanted.
 * @returns A middleware function that provides the repositories in the context.
 */
export default function provideRepos<TKeys extends RepositoriesKeys>(
  reposFactoriesWanted: Pick<RepositoriesFactories, TKeys>
) {
  return middleware(({ ctx, next }) => {
    const reposAlreadyProvided = ctx.repos || none

    const reposWantedTuples = Object.entries(reposFactoriesWanted) as Entries<
      Pick<RepositoriesFactories, TKeys>
    >

    const reposWanted = Object.fromEntries(
      reposWantedTuples.map(([key, repoFactory]) => [
        key,
        reposAlreadyProvided[key] || repoFactory(ctx.db),
      ])
    ) as Pick<Repositories, TKeys>

    return next({
      ctx: {
        repos: {
          ...reposAlreadyProvided,
          ...reposWanted,
        },
      },
    })
  })
}
