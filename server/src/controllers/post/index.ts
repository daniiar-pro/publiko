import { router } from '@server/trpc'
import create from './create'
import getAllPosts from './getAllPosts'
import getPost from './getPost'
import { deletePost } from './deletePost'

export default router({
  create,
  getAllPosts,
  getPost,
  deletePost,
})
