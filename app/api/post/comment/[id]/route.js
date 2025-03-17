import {connectToDB} from '../../../../utils/database';
import {Comment} from '../../../models/post'
import {SubComment} from '../../../models/post'


//Get Specific Comment
export const GET = async ({params}) => {
    try {
        await connectToDB()
        const comment = await Comment.findById(params.id).populate([
            {path:'creator',
                select:['username','profilePic'],
            },
               {path:'subComments',
                populate:{
                    path:'creator',
                    select:['username','profilePic']
                }}
    ])
        console.log(comment)
        if(!comment) {
            return new Response('Comment not found', {status: 404})
        }
        return new Response(JSON.stringify([comment]), {status: 200})
    }
    catch (error) {
        console.log(error)
        return new Response(error, {status: 500})
    }
}

//Create SubComment for a Comment
export const PATCH = async (req,{params}) => {
    try {
        await connectToDB()
        const {creator,content,commentDate} = await req.json()
        const addSubComment = await new SubComment({creator, content, commentDate})
        await addSubComment.save()
        const comment = await Comment.findByIdAndUpdate(
            {_id:params.id},
            {$push: {subComments: addSubComment._id}},
            {new: true, runValidators: true})
        return new Response(JSON.stringify([comment]), {status: 201})
    }

    catch (error) {
        console.log(error)
        return new Response(error, {status: 500})
    }
}