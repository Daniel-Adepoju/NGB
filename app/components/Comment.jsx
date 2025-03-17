'use client'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CldImage } from "next-cloudinary"
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {useSignal,useSignals } from "@preact/signals-react/runtime"
import {useUser} from '../utils/user'
import Loading from '../loading'
import {comData} from '../utils/axiosUrl'
import useNextPageObserver from '../utils/useNextPageIntersection';
import {io} from 'socket.io-client';
import { useEffect } from 'react';
import Link from 'next/link';
dayjs.extend(relativeTime)


const Comment = ({post}) => {
    useSignals()
    const socket = io('http://localhost:3001')
    const limit = 5
    const commentText = useSignal("")
    const {session} = useUser()
    const queryClient = useQueryClient()

    //Create a new comment

    const createComment = async (newComment) => {
      try {
   const res = await comData.value.post('/api/post/comment', newComment)
    return res
      }
      catch (error) {
        console.error(error)
      }
    }

    const createCommentMutation = useMutation({
    mutationKey: 'comments',
    mutationFn: createComment,
    onSuccess: async () => {
      commentText.value = ""
     await queryClient.invalidateQueries({queryKey:['comments','infinite',{id: post._id}]}, {exact: true})
     socket.emit('commentPost')
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
    
    useEffect(() => {
     socket.on('commentPost', () => {
      queryClient.invalidateQueries({queryKey:['comments','infinite',{id: post._id}]}, {exact: true})
     })

     return () => {
      socket.off('commentPost')
     }
    },[])
  //Get Comments
    const getComments = async(page) => {
      try {
    const res = await comData.value.get(`/api/post/comment?id=${post._id}&limit=${limit}&page=${page}`)
    const postData = res
      return postData.data[0]
      }
      catch(err) {
   console.error(err)
      }
   }
   

   const getCommentsQuery = useInfiniteQuery({
    queryKey: ['comments','infinite',{id: post._id}],
    getNextPageParam: (prevPage) => {
      return prevPage.cursor + 1 || undefined
    },
    queryFn: ({pageParam = 1}) => {
      return getComments(pageParam)
    },
   })
   const refVal = useNextPageObserver(getCommentsQuery)
    

     const listOfComments = getCommentsQuery?.data?.pages?.flatMap((item) => {
      if(item.comments.comment) {
      return item?.comments?.comment.map((comment, index) => {
        return (

  <div key={comment._id} 
  className="comment-container"
  ref = {index === Number(limit - 1) ? refVal : null}
  >
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
  <p className='comDate'>{dayjs(comment.commentDate).fromNow().toString()}</p>
  </div>
  </div>
  <div className="reply">
  <Link className='reply' href={`/post/singlecomment?commentId=${comment._id}`}>
    {comment?.subComments?.length > 0 ?
    <span>View Replies</span> :
    <span>Reply</span>}
     <img alt='reply icon' src='../comment.svg'/>
     </Link>
  </div>
  </div>
 )})
}
    })


    if(getCommentsQuery.isLoading) {
      return <div className="commentLoad">
<Loading />
      </div> 
    }

  return (
    <>
 {!listOfComments || listOfComments.length < 1 ? 
 <div>No comments yet, be the first to comment</div> :
   listOfComments
}
 {getCommentsQuery.isFetchingNextPage ? <div className="commentLoad"><Loading /> </div>: ''}
 
  {session?.user &&  <div className="write-comment">
    <div className='write-container'>
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
   <textarea type='text'
   placeholder="Write a comment..."
   value={commentText.value}
   onChange={(e) => commentText.value = e.target.value}
   />

   <img onClick={handleCreateComment} className='send-comment' src='../send.svg' alt='send-comment'/>
    </div>
    </div> }
  
   </>
  )
}

export default Comment