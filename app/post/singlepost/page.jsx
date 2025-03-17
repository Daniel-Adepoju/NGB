'use client'
import SingleCard from '../../components/SingleCard'
import { useSearchParams } from "next/navigation"
import {useSignal} from '@preact/signals-react'
import {data} from '../../utils/axiosUrl'
import { useQuery } from '@tanstack/react-query'
import Loading from '../../loading'
const SinglePost = () => {
    const searchParams = useSearchParams()
    const postId = searchParams.get('postId')
    const singlePost = useSignal()

    const getSinglePost = async () => {
        try {
      const res = await data.value.get(`/api/post/${postId}`)
      const specificPost = await res.data[0]
      singlePost.value = specificPost
    return specificPost
        } catch (err) {
            console.error(err)
        }
     }
     
  const singlePostQuery = useQuery({
   queryKey:['singlePost', {id:postId}],
   queryFn: getSinglePost,
  })

  if (singlePostQuery.isFetching) {
    return <Loading/>
  }
  return (
    <>
        <SingleCard post={singlePost.value} />
 </>
  )
}

export default SinglePost