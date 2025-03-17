import {connectToDB} from '../../../utils/database'
import Post from '../../models/post'

export const GET = async (req, {params}) => {
    try {
      await connectToDB()
      const post = await Post.findById(params.id).populate('creator')
    
      if(!post) {
        return new Response('Post not found', {status: 404})
      }
      return new Response(JSON.stringify([post]), {status: 200})
    } catch (error) {
      return new Response(error, {status: 500})
    }
  }


export const PATCH = async(req,{params}) => {
  const {content} = await req.json()
  try {
    await connectToDB()
    const updatePost = await Post.findOneAndUpdate(
      {_id: params.id},
      {content},
      {new:true, runValidators: true}
  )
    return new Response([updatePost], {status: 200})
  } catch (error) {
    return new Response(error, {status:500})
  }  
}

export const DELETE = async (req, {params}) => {
   try {
    await connectToDB()
    const deletePost = await Post.findByIdAndDelete(params.id)
    if(!deletePost) {
      return new Response('Post not found', {status: 404})
    }
    return new Response(JSON.stringify([deletePost]), {status: 200})
   } catch (err) {
    return new Response(err, {status: 500})
   }
}