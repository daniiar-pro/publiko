import { router } from '@server/trpc'
import login from './login'
import signup from './signup'
import logout from './logout'

export default router({
  login,
  signup,
  logout,
})
