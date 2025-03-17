'use client'
import SingleCard from '../../components/SingleCard'
import { useSearchParams } from "next/navigation"
import { effect, useSignal} from '@preact/signals-react'
import {data} from '../../utils/axiosUrl'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Loading from '../../loading'
const page = () => {
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

export default page