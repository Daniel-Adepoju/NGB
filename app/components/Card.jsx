'use client'
import { usePathname } from 'next/navigation';
import {useUser} from '../utils/user';
import { CldImage } from 'next-cloudinary';
import { signal, computed } from '@preact/signals-react';
import { useSignal, useSignals } from '@preact/signals-react/runtime';
import { data } from '../utils/axiosUrl';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMutation,useQueryClient} from '@tanstack/react-query';
import Burst from './Burst';
import Comment from './Comment'
import Image from 'next/image'
dayjs.extend(relativeTime)


const Card = ({refValue, post}) => {
  useSignals()
 const queryClient = useQueryClient()
 const day = dayjs(post.createdAt).fromNow().toString()
 const {session, update} = useUser()
 const pathName = usePathname()
 const likeData = signal(post.like ? post.like : [])
 const currentUserLiked = likeData.value.includes(session?.user?.id)
 const displayBurst = useSignal(false)
 const openComment = useSignal(false)

const likePost = async(editedLike) => {
  try {
  const res = await data.value.patch('/api/post/like', editedLike)
  return res
  } catch(err) {
    console.error(err)
  }
}

const likePostMutation = useMutation({
 mutationKey: "like",
  mutationFn: likePost,
  onSuccess: (data) => {
    //invalidate query to display most recent change e.g like
   queryClient.invalidateQueries(['posts'], {exact: true})
  }
})

const handleLike = () => {
  likePostMutation.mutate({
    id: post._id,
    userId: session?.user?.id,
  })
   if(!currentUserLiked) {
    displayBurst.value = true
    setTimeout(() => {
        displayBurst.value = false
        }, 3000)
   }
  }

  const handleCommentDisplay = () => {
    openComment.value =!openComment.value
  }
  
  return (
    <div ref={refValue} className="card-container">
        <section className="head">
               <div className="creator-pic">
       {post.creator.profilePic ? 
                <CldImage
                width="100"
                height="100"
                alt="profile_img"
                src={post.creator.profilePic}
                crop={{
                  type: "auto",
                  source: true,
                }}
              />
       :  <img src="../icons8-user-100 (1).png" alt="author-pic"/>
              }</div>
        <div>
           <span className="creator-name">
            {post.creator.username}
        </span>
        <span className="date-created">
            {day.charAt(0).toUpperCase() + day.slice(1)}</span>  
        </div>
       
        </section>
      <section className="body">
             <div className="post-picture">
         {post.image &&   <CldImage
                width="100"
                height="100"
                alt="profile_img"
                src={post.image}
                crop={{
                  type: "auto",
                  source: true,
                }} />
              }
             </div>
     <div className="post-content">
        {post.content}
     </div>
     <div className="post-btn">
        <div onClick={handleLike} id='like'>
        {currentUserLiked &&  <Burst show={displayBurst.value}/>}
          <span>
           {likeData.value.length}  
            </span>
           
        {currentUserLiked ? <img src="../liked.png"/> :
        <img src="../unliked.png"/> }
          </div>
         <div id='comment' onClick={handleCommentDisplay}>
         <img src="../comment.svg" />    
         </div>
  
     </div>
      </section>
     {openComment.value &&
     <section className='comment-container'
     >
     <Comment post={post}/>
      </section>}
        </div>
        
  )
}

export default Card