import { authContext, requestContext } from '@tests/utils/context'
import { fakeUser, fakePost } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
import postRouter from '..'

const createCaller = createCallerFactory(postRouter)
const db = await wrapInRollbacks(createTestDatabase())

const TABLE_USERS = 'users'
const TABLE_POSTS = 'posts'

it('should throw an error if user is not authenticated when deleting a post', async () => {
  const [user] = await insertAll(db, TABLE_USERS, fakeUser())
  const [post] = await insertAll(
    db,
    TABLE_POSTS,
    fakePost({ authorId: user.id })
  )

  const { deletePost } = createCaller(requestContext({ db }))

  await expect(deletePost(post.id)).rejects.toThrow(/unauthenticated/i)
})

it('should throw an error if authenticated user is not the post author', async () => {
  const [author, otherUser] = await insertAll(db, TABLE_USERS, [
    fakeUser(),
    fakeUser(),
  ])
  const [post] = await insertAll(
    db,
    TABLE_POSTS,
    fakePost({ authorId: author.id })
  )

  const { deletePost } = createCaller(authContext({ db }, otherUser))

  await expect(deletePost(post.id)).rejects.toThrow(/forbidden/i)
})

it('should delete the post when the authenticated user is the author', async () => {
  const [user] = await insertAll(db, TABLE_USERS, fakeUser())
  const [post] = await insertAll(
    db,
    TABLE_POSTS,
    fakePost({ authorId: user.id })
  )

  const { deletePost } = createCaller(authContext({ db }, user))

  const result = await deletePost(post.id)

  expect(result).toMatchObject({
    message: 'Post deleted successfully',
  })

  const postsInDb = await selectAll(db, 'posts', (eb) => eb('id', '=', post.id))
  expect(postsInDb).toHaveLength(0)
})
