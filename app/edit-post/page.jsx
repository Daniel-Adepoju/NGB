'use client'
import { useSearchParams, useRouter} from 'next/navigation';
import Postform, {postDeets} from '../components/Postform'
import {effect} from '@preact/signals-react';
import {data} from '../utils/axiosUrl'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isSubmitting } from '../components/Postform';
const Page = () => {
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId')
  const queryClient = useQueryClient()
  const router = useRouter()

 const getPostToEdit = async () => {
    try {
  const res = await data.value.get(`/api/post/${postId}`)
  const userPost =  res.data[0]
  postDeets.content.value = userPost.content
  return userPost
    } catch (err) {
        console.error(err)
    }
 }

 const editPost = async (editedPost) => {
  try {
 const res = await data.value.patch(`/api/post/${postId}`, editedPost)
 if(!res.error) {
    router.back()
    router.refresh();
  }
 return res
  } catch(err) {
 console.log(err)
  }
 }

 const editPostMutation = useMutation({
  mutationKey: "userPost",
  mutationFn: editPost,
  onSuccess: async () => {
    isSubmitting.value = false
    postDeets.content.value = ''
   await queryClient.invalidateQueries(['posts','userPosts'], {exact: true})
  } 
})

const handleEditPost = () => {
    isSubmitting.value = true
    editPostMutation.mutate({
     content: postDeets.content.value,
    })
}

    effect(() => {
 getPostToEdit()
    },[])
  return (
    <Postform 
    handleSubmit={handleEditPost}
    />
  )
}

export default Page