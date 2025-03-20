// 1. call our fake database
// 2. createCallerFactory()
// 3. Stub our pre-defined outputs
import { fakePost, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { clearTables, insertAll } from '@tests/utils/records'
import postRouter from '..'

const createCaller = createCallerFactory(postRouter)
const db = await wrapInRollbacks(createTestDatabase())

const TABLE_POSTS = 'posts'
const TABLE_USERS = 'users'

await clearTables(db, [TABLE_POSTS])
const [user] = await insertAll(db, TABLE_USERS, fakeUser())

const { getPostsForSpecificUserById } = createCaller({ db })

it('should return an empty list, if there are no posts', async () => {
  expect(await getPostsForSpecificUserById({ id: user.id })).toHaveLength(0)
})

it('should return a list of posts', async () => {
  await insertAll(db, TABLE_POSTS, [fakePost({ authorId: user.id })])

  const posts = await getPostsForSpecificUserById({ id: user.id })

  expect(posts).toHaveLength(1)
})
