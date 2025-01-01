import {connectToDB} from '../../../utils/database';
import Post from '../../models/post'
import {Comment} from '../../models/post'


//Create Comment
export const POST = async (req) => {
    const {creator,postId, content,commentDate} = await req.json();
 try {
    await connectToDB()
    if(!creator) {
        return new Response('login to comment', {status: 404})
    }
    const addComment = new Comment({creator,content,commentDate})
    await addComment.save()
    const updatePost = await Post.findOneAndUpdate(
        {_id: postId},
        {$push : {comment: addComment._id}},
        {new:true, runValidators: true}
    )
  
    return new Response(JSON.stringify(updatePost), {status:201})

 }
 catch (err) {
    console.log(err)
    return new Response(err, {status: 500})
 }
}


//Get Comments
export const GET = async (req) => {
    const {searchParams} = new URL(req.url)
    const postId = searchParams.get('id') || 1
    const page = searchParams.get('page') || 1
    const limit = searchParams.get('limit') || 5
    const skipNum = Number((page- 1) * limit)
    let cursor = Number(page)
    try {
        await connectToDB()
        let postsConfig = await Post.findById(postId).select('comment').populate(
            {path:'comment',
                options: {
                skip: skipNum,
                limit: limit,
                },
                populate: {
                    path: 'creator',
                    select: ['username', 'profilePic']
                }
            }
        )
  const commentLength = await Comment.countDocuments({_id: {$in : postsConfig.comment}})
  const numOfPages = Math.ceil(commentLength/Number(limit))
  if (cursor >= numOfPages) {
    cursor = undefined
  }
  console.log(commentLength)
  let comments = await postsConfig
        return new Response(JSON.stringify([{comments,cursor}]), {status: 200})
    } catch (err) {
        console.log(err)
        return new Response(err, {status: 500})
    }
}