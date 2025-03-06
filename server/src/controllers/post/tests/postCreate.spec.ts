import { authContext, requestContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
import postRouter from '..'

const createCaller = createCallerFactory(postRouter)
const db = await wrapInRollbacks(createTestDatabase())

const TABLE_USERS = 'users'

it('should throw an error if user is not authenticated', async () => {
  const { create } = createCaller(requestContext({ db }))

  await expect(
    create({
      title: 'My Special post',
      content: 'This is the content of my special post.',
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('should create a persisted post', async () => {
  const [user] = await insertAll(db, TABLE_USERS, fakeUser())
  const { create } = createCaller(authContext({ db }, user))

  const postReturned = await create({
    title: 'My Post',
    content: 'This is the content.',
  })

  expect(postReturned).toMatchObject({
    id: expect.any(Number),
    title: 'My Post',
    content: 'This is the content.',
    authorId: user.id,
  })

  const [postCreated] = await selectAll(db, 'posts', (eb) =>
    eb('id', '=', postReturned.id)
  )

  expect(postCreated).toMatchObject(postReturned)
})
