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

// a general setup for the tests
await clearTables(db, [TABLE_POSTS])
const [user] = await insertAll(db, TABLE_USERS, fakeUser())

// as a non-logged in user
const { findAll } = createCaller({ db })

it('should return an empty list, if there are no posts', async () => {
  // Given (ARRANGE)
  expect(await findAll()).toHaveLength(0)
})

it('should return a list of posts', async () => {
  // Given (ARRANGE)
  await insertAll(db, TABLE_POSTS, [fakePost({ authorId: user.id })])

  // When (ACT)
  const posts = await findAll()

  // Then (ASSERT)
  expect(posts).toHaveLength(1)
})

it('should return a list of posts', async () => {
  // Given (ARRANGE)
  await insertAll(db, TABLE_POSTS, [fakePost({ authorId: user.id })])

  // When (ACT)
  const posts = await findAll()

  // Then (ASSERT)
  expect(posts).toHaveLength(1)
})

// it('should return the latest post first', async () => {
//   // Given (ARRANGE)
//   const [postOld] = await insertAll(db, TABLE_POSTS, [
//     fakePost({ authorId: user.id }),
//   ])
//   const [postNew] = await insertAll(db, TABLE_POSTS, [
//     fakePost({ authorId: user.id }),
//   ])

//   // When (ACT)
//   const posts = await findAll()

//   // Then (ASSERT)
//   expect(posts[0]).toMatchObject(postNew)
//   expect(posts[1]).toMatchObject(postOld)
// })
