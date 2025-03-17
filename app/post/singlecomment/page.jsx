'use client'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSignals, useSignal } from "@preact/signals-react/runtime";
import { comData } from "../../utils/axiosUrl";
import { useSearchParams } from "next/navigation";
import Loading from '../../loading';
import {useQuery,useQueryClient,useMutation} from "@tanstack/react-query";
import { CldImage } from 'next-cloudinary';
import {useUser} from '../../utils/user'
dayjs.extend(relativeTime)
 
const SingleComment = () => {
  useSignals()
  const comment = useSignal()
  const params = useSearchParams()
  const commentId = params.get('commentId')
  const {session} = useUser()
  const commentText = useSignal()
  const queryClient = useQueryClient()


  const getComment = async() => {
    try {
    const data =await comData.value.get(`/api/post/comment/${commentId}`)
    comment.value = data.data[0]
    commentText.value =  `@${data.data[0].creator.username}`
    return data.data[0]
    } 
      catch(err) {
   console.log(err)
      }
  }
  const getCommentQuery = useQuery({
    queryKey: ['subComments', commentId],
    queryFn:getComment
  })


  //Create subComment
  const createSubComment = async (newComment) => {
    try {
const res = await comData.value.patch(`/api/post/comment/${commentId}`, newComment)
return res    
}
    catch(err) {
  console.log(err)
    }
  }
  const subCommentMutation = useMutation({
    mutationKey: 'replies',
    mutationFn: createSubComment,
    onSuccess: async () => {
  commentText.value = ''
await queryClient.invalidateQueries({
  queryKey:['subComments', commentId]});
    }
  })
  const handleCreateSubComment = () => {
    subCommentMutation.mutate({
      content: commentText.value,
      creator: session?.user?.id,
      commentDate: new Date()
  })
}

  if (getCommentQuery.isFetching) {
    return <Loading/>
  }

  return (
   <>
   <div className="single-comment-container">
  <div className="comment-container">
  <div className="head">
  <div className='user-pic'>
  <CldImage
  width="40"
  height="40"
  alt="profile_img"
  src={comment.value.creator.profilePic}
  crop={{
    type: "auto",
    source: true,
  }}/>
  </div>
  <span>{comment.value.creator.username}</span>
  </div>
  <div className="body">
       <div className='comment-text'>
  <p>{comment.value.content}</p>
  <p className='comDate'>{dayjs(comment.value.commentDate).fromNow().toString()}</p>
  </div>
  </div>
  </div>


  <div className="sub-comment">
    {comment.value.subComments?.map((subComment, index) => (
  <div className="comment-container" key={subComment._id}>
  <div className="head">
  <div className='user-pic'>
  <CldImage
  width="40"
  height="40"
  alt="profile_img"
  src={subComment.creator.profilePic}
  crop={{
    type: "auto",
    source: true,
  }}/>
  </div>
  <span>{subComment.creator.username}</span>
  </div>
  <div className="body">
       <div className='comment-text'>
  <p>{subComment.content}</p>
  <p className='comDate'>{dayjs(subComment.commentDate).fromNow().toString()}</p>
  </div>
  <img onClick ={() => {
    commentText.value = `@${subComment.creator.username}`
  }}className='reply' alt='reply icon' src='../comment.svg'/>
  </div>
  </div>
    ))}
  </div>

  <div className="write-comment">
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
   placeholder="Write a reply..."
   value={commentText.value}
   onChange={(e) => commentText.value = e.target.value}
   />

   <img onClick={handleCreateSubComment} className='send-comment' src='../send.svg' alt='send-comment'/>
    </div>
    </div> 
  </div>
   </>
  )
}


export default SingleComment