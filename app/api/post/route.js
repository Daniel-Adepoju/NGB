import { connectToDB } from "../../utils/database"
import Post from '../models/post'

export const GET = async (req) => {
  const {searchParams} = new URL(req.url)
  const page = searchParams.get('page') || 1
  const limit = searchParams.get('limit') || 10
  const search = searchParams.get('search') || ''
  const skipNum = Number((page- 1) * limit)
  let cursor = Number(page)
  let content = {
    content:{ $regex: search, $options: 'i'}
  }

  try {
    await connectToDB()
  
  const postsDeets = await Post.find()
  const numOfPages = Math.ceil(postsDeets.length / Number(limit))
  if (cursor >= numOfPages) {
    cursor = undefined
  }

  let postsConfig = Post.find({$or :[ content]}).sort('-createdAt').populate(["creator"])
   postsConfig = postsConfig.skip(skipNum).limit(limit)
  
  const posts = await postsConfig
  return new Response(JSON.stringify([{posts,cursor}]),{status:200})
    } catch(err) {
 console.log(err)
 return new Response(err, {status: 500})
    }
}
