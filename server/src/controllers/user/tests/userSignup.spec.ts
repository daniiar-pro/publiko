import { createTestDatabase } from '@tests/utils/database'
import { fakeUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { selectAll } from '@tests/utils/records'
import { random } from '@tests/utils/random'
import userRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(userRouter)
const { signup } = createCaller({ db })

const TABLE_USERS = 'users'

it('should save a user', async () => {
  const user = fakeUser()
  const response = await signup(user)

  const [userCreated] = await selectAll(db, TABLE_USERS, (eb) =>
    eb('email', '=', user.email)
  )

  expect(userCreated).toMatchObject({
    id: expect.any(Number),
    ...user,
    password: expect.not.stringContaining(user.password),
  })

  expect(userCreated.password).toHaveLength(60)

  expect(response).toEqual({
    id: userCreated.id,
  })
})

it('should require a valid email', async () => {
  await expect(
    signup(
      fakeUser({
        email: 'user-email-invalid',
      })
    )
  ).rejects.toThrow(/email/i)
})

it('should require a password with at least 8 characters', async () => {
  await expect(
    signup(
      fakeUser({
        password: 'pas.123',
      })
    )
  ).rejects.toThrow(/password/i)
})

it('throws an error for invalid email', async () => {
  await expect(
    signup(
      fakeUser({
        email: 'not-an-email',
      })
    )
  ).rejects.toThrow(/email/)
})

it('stores lowercased email', async () => {
  const user = fakeUser()

  await signup({
    ...user,
    email: user.email.toUpperCase(),
  })

  const userSaved = await selectAll(db, TABLE_USERS, (eb) =>
    eb('email', '=', user.email)
  )

  expect(userSaved).toHaveLength(1)
})

it('stores email with trimmed whitespace', async () => {
  const user = fakeUser()
  await signup({
    ...user,
    email: ` \t ${user.email}\t `,
  })

  const userSaved = await selectAll(db, TABLE_USERS, (eb) =>
    eb('email', '=', user.email)
  )

  expect(userSaved).toHaveLength(1)
})

it('throws an error for duplicate email', async () => {
  const email = random.email()

  await signup(fakeUser({ email }))

  await expect(signup(fakeUser({ email }))).rejects.toThrow(
    /email already exists/i
  )
})
