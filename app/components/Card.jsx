'use client'
import { usePathname, useRouter } from 'next/navigation';
import {useUser} from '../utils/user';
import { CldImage } from 'next-cloudinary';
import { signal, computed,effect } from '@preact/signals-react';
import { useSignal, useSignals } from '@preact/signals-react/runtime';
import { data } from '../utils/axiosUrl';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMutation,useQueryClient,useQuery} from '@tanstack/react-query';
import Burst from './Burst';
import {useRef, useEffect} from 'react'
import {io} from 'socket.io-client';
import Comment from '../components/Comment'

dayjs.extend(relativeTime)

// const socket = signal(io('localhost:3000'))

const Card = ({refValue, post}) => {
  useSignals()
 const socket = io('http://localhost:3001')
 const queryClient = useQueryClient()
 const day = dayjs(post.createdAt).fromNow().toString()
 const {session, update} = useUser()
 const pathName = usePathname()
 const likeData = signal(post.like ? post.like : [])
 const displayBurst = useSignal(false)
 const openComment = useSignal(false)
 const showStats = useSignal(false)
 const router = useRouter()
 const dialogRef = useRef()
 const contentRef = useRef()


//Get single post rouutine
const getPostToLike = async (postId) => {
  try {
const res = await data.value.get(`/api/post/${postId}`)
const singlePost =  res
return singlePost.data[0]
  } catch (err) {
      console.error(err)
  }
}
const likeQuery = useQuery({
  queryKey: ['post', {id:post._id}],
  queryFn:() => getPostToLike(post._id),
  // enabled:false,
  initialData: post
})
const currentUserLiked = likeQuery?.data?.like?.includes(session?.user?.id)

 //Like Routine
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
  onSuccess: async (data) => {
    //invalidate query to display most recent change e.g like
    // likeQuery.refetch()
  await queryClient.invalidateQueries({queryKey:['post',{id:post._id}]}, {exact:true})
   socket.emit('likePost', post._id)
  }
})

const handleLike = () => {

  likePostMutation.mutate({
    id: post._id,
    userId: session?.user?.id,
  })
  //checked if liked
   if(!currentUserLiked) {
    displayBurst.value = true
    setTimeout(() => {
        displayBurst.value = false
        }, 3000)
   }
  }


  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket is on in client zone')
    })
   
    socket.on('likePost', (res) => {
      // likeQuery.refetch()
        if(res === post._id) {
          queryClient.invalidateQueries({queryKey:['post',{id:post._id}]},{exact:true})
        }
        })
      socket.on('createPost', () => {
   queryClient.invalidateQueries(['posts'])     
  })
   
    return () => { 
      socket.off('createPost')
      socket.off('connect')
      socket.off('likePost')
    }
  },[])

  //Show Comment
  const handleCommentDisplay = () => {
    openComment.value =!openComment.value
  }
  
const handleGoToEdit = () => {
 console.log(post._id)
  router.push(`/edit-post?postId=${post._id}`)
}

//Delete Routine
const handleDelete = async() => {
 const res = await data.value.delete(`/api/post/${post._id}`)
 if(!res.error) {
   queryClient.invalidateQueries(['posts','userPosts'], {exact: true})
 }
}
const deleteMutation = useMutation({
  mutationKey: 'deletePost',
  mutationFn: handleDelete,
  onSuccess: () => {
    queryClient.invalidateQueries(['posts','userPosts'], {exact: true})
  }}
  )
const handleModal = () => {
 dialogRef.current.showModal()
}

//Detecting Link
 useEffect(() => {
 const pattern = /\b(?:https?:\/\/|www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/gi;
 const text = contentRef.current.textContent
 const updateText = text.replace(pattern, (match) => {
 const url = match.startsWith('http') ? match : `https://${match}`
  return `<a
  rel="noopener noreferrer"
  target='_blank'
  href=${url}>${match}</a>` 
})
 contentRef.current.innerHTML = updateText
 },[])

  return (
    <div ref={refValue} className="card-container">
        <section className="head">
               <div className="creator-pic">
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
    </div>
        <div>
           <span className="creator-name">
            {post.creator.username}
        </span>
        <span className="date-created">
            {day.charAt(0).toUpperCase() + day.slice(1)}</span>  
        </div>
       
        </section>
      <section className="body">
       {post.image && 
       <div className="post-picture">
         <CldImage
                width="1500"
                height="950"
                alt="post_img"
                src={post.image}
                crop={{
                  type: "auto",
                  source: true,
                }} />
             </div>}
        <div  className="content_con">
       <div ref={contentRef} className="post-content">
        {post.content}
         </div>
      <div className="post-btn">
      {pathName !=='/profile/posts' &&
      <>
      <div onClick={handleLike} id='like'>
        {currentUserLiked &&  <Burst show={displayBurst.value}/>}
          <span>
  {likeQuery.data?.like?.length} 
            </span>
           
        {currentUserLiked ? <img src="../liked.png"/> :
        <img src="../unliked.png"/> }
          </div> 
         <div id='comment' onClick={handleCommentDisplay}>
         <img src="../comment.svg" />
         </div> 
      </>}
      {pathName === '/profile/posts' && 
      <>
       <div id='edit' onClick={handleGoToEdit}>
         <img src="../edit.svg" />
         </div> 
         <div onClick={() => handleModal()} id='delete'>
         <img src="../delete.svg" />
         </div> 
      </>}
     </div>
        </div>
      </section>
     {openComment.value &&
     <section className='comment-container'>
     <Comment post={post}/>
      </section>}
    
      {pathName === '/profile/posts' && 
      <div className="post_statistics">
         <header
         onClick={() => showStats.value =!showStats.value}
         className={showStats.value ? 'active' : ''}> Stats
         </header>
      {showStats.value && 
        <section className="stats_list">
        <div className="stat">
             Created
          <span> {dayjs(post.createdAt).format('MMMM DD, YYYY')}</span>
          
        </div>
        <div className="stat">
          <span>{post?.comment?.length}</span>
          <span> Comments</span>
        </div>
       
        <div className="stat">
          <span>{likeData.value.length}</span>
          <span> Likes</span>
        </div>    
         </section>}
      
      </div>
      }
      <dialog ref={dialogRef}>
        <div className="modal-content">
        <h3>Are you sure you want to delete this post?</h3>
        <div className="btn-container">
          <div onClick={() => {
            dialogRef.current.close();
            deleteMutation.mutate()
          }}>
            <img src='../confirm.svg'/>
          </div>
          <div onClick={() => {
            console.log(dialogRef.current)
            dialogRef?.current.close()}}>
            <img src='../cancel.svg'/>
          </div>
        </div>
        </div>
      </dialog>
        </div>
        
  )
}

export default Card