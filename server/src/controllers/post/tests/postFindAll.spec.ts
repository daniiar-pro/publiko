import { fakePost, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { clearTables, insertAll } from '@tests/utils/records'
import articleRouter from '..'

const createCaller = createCallerFactory(articleRouter)
const db = await wrapInRollbacks(createTestDatabase())

const TABLE_POSTS = 'posts'
const TABLE_USERS = 'users'

await clearTables(db, [TABLE_POSTS])
const [user] = await insertAll(db, TABLE_USERS, fakeUser())

const { getAllPosts } = createCaller({ db })

it('should return an empty list, if there are no posts', async () => {
  expect(await getAllPosts()).toHaveLength(0)
})

it('should return a list of posts', async () => {
  await insertAll(db, TABLE_POSTS, [fakePost({ authorId: user.id })])

  const posts = await getAllPosts()

  expect(posts).toHaveLength(1)
})

it('should return a list of posts', async () => {
  await insertAll(db, TABLE_POSTS, [fakePost({ authorId: user.id })])

  const posts = await getAllPosts()

  expect(posts).toHaveLength(1)
})
