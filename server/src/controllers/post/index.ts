import { router } from '@server/trpc'
import create from './create'
import getAllPosts from './getAllPosts'
import getPost from './getPost'
import { deletePost } from './deletePost'
import getPostsForSpecificUserById from './getPostsForSpecificUserById'
import editPost from './editPost'

export default router({
  create,
  getAllPosts,
  getPost,
  deletePost,
  getPostsForSpecificUserById,
  editPost,
})
