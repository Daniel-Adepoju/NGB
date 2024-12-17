'use client'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CldImage } from "next-cloudinary"
import { signal } from "@preact/signals-react"
import {data} from "../utils/axiosUrl"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {useSignal,useSignals } from "@preact/signals-react/runtime"
import {useUser} from '../utils/user'
dayjs.extend(relativeTime)

const Comment = ({post}) => {
    useSignals()
    const commentData = signal(post.comment ? post.comment : [])
    const commentText = useSignal("")
    const {session} = useUser()
    const queryClient = useQueryClient()

    const createComment = async (newComment) => {
      try {
   const res = await data.value.post('api/post/comment', newComment)
    return res
      }
      catch (error) {
        console.error(error)
      }
    }

    const createCommentMutation = useMutation({
    mutationKey: 'comments',
    mutationFn: createComment,
    onSuccess: () => {
      commentText.value = ""
      queryClient.invalidateQueries(['posts'], {exact: true})
    },
    })

    const handleCreateComment = () => {
      createCommentMutation.mutate({
        content: commentText.value,
        postId: post._id,
        creator: session?.user?.id,
        commentDate: new Date()
      })
    }

     const listOfComments = commentData.value.map((comment,index) => {
 
      return (
  <div key={comment._id} className="comment">
  <div className="head">
  <div className='user-pic'>
  <CldImage
  width="40"
  height="40"
  alt="profile_img"
  src={comment.creator.profilePic}
  crop={{
    type: "auto",
    source: true,
  }}/>
  </div>
  <span>{comment.creator.username}</span>
  </div>
  <div className="body">
       <div className='comment-text'>
  <p>{comment.content}</p>
  <p>{dayjs(comment.commentDate).fromNow().toString()}</p>
  </div>
  </div>
  </div>
 )
    })

  return (
    <>
   {listOfComments.length > 0 ? listOfComments : 
   'No comments yet, be the first to comment'}
  {session?.user &&  <div className="write-comment">
    <div className='user-pic'>
    <CldImage
    width="40"
    height="40"
    alt="profile_img"
    src={session?.user?.profilePic}
    crop={{
      type: "auto",
      source: true,
    }}/>
   </div>

   <input type='text'
   placeholder="Write a comment..."
   value={commentText.value}
   onChange={(e) => commentText.value = e.target.value}
   />

   <img onClick={handleCreateComment} className='send-comment' src='../send.svg' alt='send-comment'/>
    </div> }
  
   </>
  )
}

export default Comment