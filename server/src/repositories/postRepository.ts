import type { Database, Posts } from '@server/database'
import {
  type PostPublic,
  postKeysPublic,
  type PostUpdate,
} from '@server/entities/post'
import type { Insertable } from 'kysely'

type Pagination = {
  offset: number
  limit: number
}

const POSTS_TABLE = 'posts'

export function postRepository(db: Database) {
  return {
    async create(post: Insertable<Posts>): Promise<PostPublic> {
      return db
        .insertInto(POSTS_TABLE)
        .values(post)
        .returning(postKeysPublic)
        .executeTakeFirstOrThrow()
    },

    async findById(postId: number): Promise<PostPublic | undefined> {
      return db
        .selectFrom(POSTS_TABLE)
        .select(postKeysPublic)
        .where('id', '=', postId)
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

    async hasUserId(postId: number, authorId: number): Promise<boolean> {
      const post = await db
        .selectFrom(POSTS_TABLE)
        .select('authorId')
        .where('id', '=', postId)
        .executeTakeFirst()

      return post?.authorId === authorId
    },

    async delete(postId: number): Promise<void> {
      await db
        .deleteFrom(POSTS_TABLE)
        .where('id', '=', postId)
        .executeTakeFirstOrThrow()
    },

    async getAllPostsBySpecificAuthor(authorId: number): Promise<PostPublic[]> {
      return db
        .selectFrom(POSTS_TABLE)
        .select(postKeysPublic)
        .where('authorId', '=', authorId)
        .execute()
    },

    async editPostById(
      postId: number,
      records: Insertable<PostUpdate>
    ): Promise<PostUpdate> {
      return db
        .updateTable(POSTS_TABLE)
        .set(records)
        .where('posts.id', '=', postId)
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async getPostAuthorId(postId: number) {
      return db
        .selectFrom(POSTS_TABLE)
        .select('posts.authorId')
        .where('posts.id', '=', postId)
        .executeTakeFirst()
    },
  }
}

export type ArticleRepository = ReturnType<typeof postRepository>

// const result = await db
//   .updateTable(POSTS_TABLE)
//   .set((eb) => ({
//     age: eb('age', '+', 1),
//     first_name: eb.selectFrom('pet').select('name').limit(1),
//     last_name: 'updated',
//   }))
//   .where('id', '=', '1')
//   .executeTakeFirst()

// console.log(result.numUpdatedRows)
