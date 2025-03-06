import type { Database } from '@server/database'
import { postRepository } from './postRepository'
import { userRepository } from './userRepository'

export type RepositoryFactory = <T>(db: Database) => T

const repositories = { postRepository, userRepository }

export type RepositoriesFactories = typeof repositories

export type Repositories = {
  [K in keyof RepositoriesFactories]: ReturnType<RepositoriesFactories[K]>
}

export type RepositoriesKeys = keyof Repositories

export { repositories }
