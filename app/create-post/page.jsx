'use client'
import PostForm from '../components/Postform'
import {postDeets, isSubmitting} from '../components/Postform'
import { signal } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { useMutation } from '@tanstack/react-query'
import {data} from '../utils/axiosUrl'
import { useRouter } from 'next/navigation'
import {useUser} from '../utils/user'

const Page = () => {
  useSignals()
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
    onSuccess: () => {
      isSubmitting.value = false
      postDeets.content.value = ''
    }
  })

  const handleCreatePost = async (e) => { 
  e.preventDefault()
  createPostMutation.mutate({
    creator: session?.user?.id,
    content: postDeets.content.value,
    image: postDeets.image.value || undefined
  })
  }
  
  if (!session?.user) {
    return <div> You need to be logged in</div>
  }
  return (
    <PostForm
    handleSubmit={handleCreatePost}/>
  )
}

export default Page