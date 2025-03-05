import type { Database } from '@server/database'
import type { Users } from '@server/database/types'
import {
  type UserPublic,
  userKeysAll,
  userKeysPublic,
} from '@server/entities/user'
import type { Insertable, Selectable } from 'kysely'

const USERS_TABLE = 'users'
export function userRepository(db: Database) {
  return {
    async create(user: Insertable<Users>): Promise<UserPublic> {
      return db
        .insertInto(USERS_TABLE)
        .values(user)
        .returning(userKeysPublic)
        .executeTakeFirstOrThrow()
    },

    async findByEmail(email: string): Promise<Selectable<Users> | undefined> {
      const user = await db
        .selectFrom(USERS_TABLE)
        .select(userKeysAll)
        .where('email', '=', email)
        .executeTakeFirst()

      return user
    },
  }
}

export type UserRepository = ReturnType<typeof userRepository>
