import { router } from '@server/trpc'
import login from './login'
import signup from './signup'
import testIt from './testIt'

export default router({
  login,
  signup,
  testIt
})
