'use client'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CldImage } from "next-cloudinary"
import {data} from "../utils/axiosUrl"
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {useSignal,useSignals } from "@preact/signals-react/runtime"
import {useUser} from '../utils/user'
import Loading from '../loading'
import {comData} from '../utils/axiosUrl'
import useNextPageOserver from '../utils/useNextPageIntersection';
dayjs.extend(relativeTime)
import Comment from './Comment';
const CommentList = ({post}) => {
    useSignals()
    const limit = 5
    const commentText = useSignal("")
    const {session} = useUser()
    const queryClient = useQueryClient()

    //Create a new comment

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
      queryClient.invalidateQueries({queryKey:['comments','infinite',{id: post._id}]}, {exact: true})
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
   const ref = useNextPageOserver(getCommentsQuery)
  console.log(getCommentsQuery.hasNextPage)
 

     const listOfComments = getCommentsQuery?.data?.pages?.flatMap((item) => {

      if(item.comments.comment) {
      return item?.comments?.comment.map((comment, index) => {
        return (
  <div key={comment._id}
  onClick={() => getCommentsQuery.fetchNextPage()}>
   <Comment 
   refVal={index === limit - 1 ? ref : null}
   />

  {index === limit - 1 && getCommentsQuery.isFetchingNextPage ? <div className="commentLoad"><Loading /></div> : ''}
  </div>
)})
}
    })


    if(getCommentsQuery.isFetching) {
      return <div className="commentLoad">
<Loading />
      </div> 
    }

  return (
    <>
 {!listOfComments || listOfComments.length < 1 ?  <div>No comments yet, be the first to comment</div> : listOfComments}
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

export default CommentList