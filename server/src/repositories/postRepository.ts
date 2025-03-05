import type { Database, Posts } from '@server/database'
import { type PostPublic, postKeysPublic } from '@server/entities/post'
import type { Insertable } from 'kysely'

type Pagination = {
  offset: number
  limit: number
}

const POSTS_TABLE = 'posts'
export function postRepository(db: Database) {
  return {
    async create(article: Insertable<Posts>): Promise<PostPublic> {
      return db
        .insertInto(POSTS_TABLE)
        .values(article)
        .returning(postKeysPublic)
        .executeTakeFirstOrThrow()
    },

    async findById(articleId: number): Promise<PostPublic | undefined> {
      return db
        .selectFrom(POSTS_TABLE)
        .select(postKeysPublic)
        .where('id', '=', articleId)
        .executeTakeFirst()
    },

    async findAll({ offset, limit }: Pagination): Promise<PostPublic[]> {
      return db
        .selectFrom(POSTS_TABLE)
        .select(postKeysPublic)
        .orderBy('id', 'desc')
        .offset(offset)
        .limit(limit)
        .execute()
    },

    async hasUserId(articleId: number, authorId: number): Promise<boolean> {
      const article = await db
        .selectFrom(POSTS_TABLE)
        .select('authorId')
        .where('id', '=', articleId)
        .executeTakeFirst()

      return article?.authorId === authorId
    },
  }
}

export type ArticleRepository = ReturnType<typeof postRepository>
