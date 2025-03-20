import { authContext, requestContext } from '@tests/utils/context'
import { fakePost, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { clearTables, insertAll } from '@tests/utils/records'
import postRouter from '..'

const createCaller = createCallerFactory(postRouter)
const db = await wrapInRollbacks(createTestDatabase())

const TABLE_USERS = 'users'
const TABLE_POSTS = 'posts'

await clearTables(db, [TABLE_POSTS])

it('should throw an error if user is not authenticated when updating a post', async () => {
  const { editPost } = createCaller(requestContext({ db }))
  const [user] = await insertAll(db, TABLE_USERS, fakeUser())
  const [post] = await insertAll(
    db,
    TABLE_POSTS,
    fakePost({ authorId: user.id })
  )

  await expect(editPost(post)).rejects.toThrow(/unauthenticated/i)
})

it('should throw an error if authenticated user is not the post author', async () => {
  const [author, otherUser] = await insertAll(db, TABLE_USERS, [
    fakeUser(),
    fakeUser(),
  ])

  const [post] = await insertAll(db, TABLE_POSTS, [
    fakePost({ authorId: author.id }),
  ])

  const { editPost } = createCaller(authContext({ db }, otherUser))

  await expect(editPost(post)).rejects.toThrow(/forbidden/i)
})

it('should update the post when the authenticated user is the author', async () => {
  const [user] = await insertAll(db, TABLE_USERS, fakeUser())
  const [post] = await insertAll(
    db,
    TABLE_POSTS,
    fakePost({ authorId: user.id })
  )

  const { editPost } = createCaller(authContext({ db }, user))

  const result = await editPost(post)

  expect(result).toMatchObject({
    title: result.title,
    content: result.content,
    authorId: user.id,
  })
})
