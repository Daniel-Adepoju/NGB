'use client'
import PostForm from '../components/Postform'
import {postDeets, isSubmitting} from '../components/Postform'
import { useSignals } from '@preact/signals-react/runtime'
import { useMutation } from '@tanstack/react-query'
import {data} from '../utils/axiosUrl'
import { useRouter } from 'next/navigation'
import {useUser} from '../utils/user'
import Link from 'next/link'
import {io} from 'socket.io-client';

const Page = () => {
  useSignals()
  const socket = io('http://localhost:3001')
  const {session} = useUser()
  const router = useRouter()
 
  
  const createPost =  async(newPost) => {
    try {
      const response = await data.value.post('api/post/create-post', newPost)
      if(!response.error) {
        router.back()
        router.refresh();
      }
      return response
    } catch (err) {
      console.error(err)
    }
  }

  const createPostMutation = useMutation({
    mutationKey: 'createPost',
    mutationFn: createPost,
    onSuccess: async () => {
      isSubmitting.value = false
      postDeets.content.value = ''
      postDeets.image.value = ''
      socket.emit('createPost')
    }
  })

  const handleCreatePost = async (e) => { 
  e.preventDefault()
  isSubmitting.value = true
  createPostMutation.mutate({
    creator: session?.user?.id,
    content: postDeets.content.value,
    image: postDeets.image.value || undefined
  })
  }
  
  if (!session?.user) {
    return (
    <div className="loginFirst">
    <span>
        <Link href='/login'>Login</Link> to access this page 
    </span>
       </div>
  )}
  return (
    <>
    <PostForm
    handleSubmit={handleCreatePost}
    />
    </>
  )
}

export default Page