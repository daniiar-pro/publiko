import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { fakePost, fakeUser } from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { createCallerFactory, router } from '..'
import { postAuthorProcedure } from '.'

const routes = router({
  testCall: postAuthorProcedure.query(() => 'passed'),
})

const db = await wrapInRollbacks(createTestDatabase())
const [userOne, userTwo] = await insertAll(db, 'users', [
  fakeUser(),
  fakeUser(),
])

const [postOne, postTwo] = await insertAll(db, 'posts', [
  fakePost({ authorId: userOne.id }),
  fakePost({ authorId: userTwo.id }),
])

const createCaller = createCallerFactory(routes)
const authenticated = createCaller(authContext({ db }, userOne))

it('should pass if post belongs to the user', async () => {
  const response = await authenticated.testCall({ id: postOne.id })
  expect(response).toEqual('passed')
})

it('should throw an error if post is not provided', async () => {
  await expect((authenticated.testCall as any)({})).rejects.toThrow(/number/)
})

it('should throw an error if user provides a non-existing post id', async () => {
  await expect((authenticated.testCall as any)({ id: 999 })).rejects.toThrow(
    /post/i
  )
})

it('should throw an error if user provides null post id', async () => {
  await expect(authenticated.testCall({ id: null as any })).rejects.toThrow(
    /number/
  )
})

it('should throw an error if post does not belong to the user', async () => {
  await expect(authenticated.testCall({ id: postTwo.id })).rejects.toThrow(
    /post/i
  )
})
