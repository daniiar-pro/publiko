import type { Users, Posts } from '@server/database/types'
import type { Insertable } from 'kysely'
import { random } from '@tests/utils/random'
import type { AuthUser } from '../user'

const randomId = () =>
  random.integer({
    min: 1,
    max: 1000000,
  })

/**
 * Generates a fake user with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeUser = <T extends Partial<Insertable<Users>>>(
  overrides: T = {} as T
) =>
  ({
    email: random.email(),
    username: random.first(),
    password: 'Password.123!',
    ...overrides,
  }) satisfies Insertable<Users>

export const fakeAuthUser = <T extends Partial<AuthUser>>(
  overrides: T = {} as T
): AuthUser => ({
  id: randomId(),
  email: random.email(),
  ...overrides,
})

/**
 * Generates a fake post with some default test data.
 * @param overrides userId and any properties that should be different from default fake data.
 */
export const fakePost = <T extends Partial<Insertable<Posts>>>(overrides: T) =>
  ({
    title: random.string(),
    content: random.paragraph(),
    authorId: randomId(),
    ...overrides,
  }) satisfies Insertable<Posts>
