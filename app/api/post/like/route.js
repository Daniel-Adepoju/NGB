import {connectToDB} from '../../../utils/database';
import Post from '../../models/post';
import User from '../../models/user';


export const PATCH = async (req) => {
    const {id,userId} = await req.json()
    console.log({id,userId})
    try {
        await connectToDB()
         let updatePost
         const post = await Post.findById(id)
         const user = await User.findById(userId)
     //check for user
     if(!user) {
        return new Response('You Have To Log In To Like Posts', {status: 404})
     }
     //unlike
         if(post.like.includes(user._id)) {
        const removeLike = post.like.filter(likeId => likeId!=user._id)
         updatePost = await Post.findOneAndUpdate(
            {_id: id},
            {like: removeLike},
            {new:true, runValidators: true}
        )
         return new Response(JSON.stringify(updatePost), {status: 200})
         }
    //like
    if(!post.like.includes(user._id)) {
        const addLike = [...post.like, userId]
        const updatePost = await Post.findOneAndUpdate(
            {_id: id},
            {like: addLike},
            {new:true, runValidators: true}
        )
        return new Response(JSON.stringify(updatePost), {status: 200})
    }
}
    catch(err) {
        console.log({FROMAPI:err.message})
return new Response(err, {status: 500})
    }
}