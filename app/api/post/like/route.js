import {connectToDB} from '../../../utils/database';
import Post from '../../models/post';
import User from '../../models/user';

export const PATCH = async (req) => {
    const {id,userId} = await req.json()
    try {
        await connectToDB()
         const post = await Post.findOne({_id: id})
         const user = await User.findById(userId)
         //unlike
         if(post.like.includes(user._id)) {
        const removeLike = post.like.filter(likeId => likeId!=user._id)
        const updatePost = await Post.findOneAndUpdate(
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
        console.log(err)
return new Response(err, {status: 500})
    }
}