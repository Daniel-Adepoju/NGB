import {connectToDB} from '../../../utils/database';
import Post from '../../models/post'

export const POST = async (req) => {
    const {creator,postId, content,commentDate} = await req.json();
 try {
    await connectToDB()
    const singlePost = await Post.findById(postId)
    if(!creator) {
        return new Response('login to comment', {status: 404})
    }
 
    
    const addComment = [...singlePost.comment, {creator,content,commentDate}]
    const updatePost = await Post.findOneAndUpdate(
        {_id: postId},
        {comment: addComment},
        {new:true, runValidators: true}
    )
    console.log(updatePost)
    return new Response(JSON.stringify(updatePost), {status:201})

 }
 catch (err) {
    console.log(err)
    return new Response("dan" + err, {status: 500})
 }
}

export const GET = async (req) => {
    try {
        await connectToDB()
        const comments = await Comment.find().populate(['post','creator'])
        return new Response(JSON.stringify(comments), {status: 200})
    } catch (err) {
        console.log(err)
        return new Response(err, {status: 500})
    }
}