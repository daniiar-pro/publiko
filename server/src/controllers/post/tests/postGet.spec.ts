import { authContext } from '@tests/utils/context'
import { fakePost, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import postRouter from '..'

const createCaller = createCallerFactory(postRouter)
const db = await wrapInRollbacks(createTestDatabase())

const TABLE_POSTS = 'posts'
const TABLE_USERS = 'users'
const [user, userOther] = await insertAll(db, TABLE_USERS, [
  fakeUser(),
  fakeUser(),
])

const [post, postOther] = await insertAll(db, TABLE_POSTS, [
  fakePost({ authorId: user.id }),
  fakePost({ authorId: userOther.id }),
])

const { getPost } = createCaller(authContext({ db }, user))

it('should return a post', async () => {
  const postResponse = await getPost(post.id)

  expect(postResponse).toMatchObject({
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.authorId,
  })
})

it('should throw an error if the post does not exist', async () => {
  const nonExistantId = post.id + postOther.id

  await expect(getPost(nonExistantId)).rejects.toThrowError(/not found/i)
})
