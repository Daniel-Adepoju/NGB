'use client'
import Card from '../../components/Card';
import { useSignals } from "@preact/signals-react/runtime"
import { signal } from "@preact/signals-react"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import {data} from '../../utils/axiosUrl'
import {useUser} from '../../utils/user';
import { useCallback,useRef } from 'react'
import { useSearchParams } from 'next/navigation';
import Loader from '../../loading'


const limit = signal(10)
const Page = () => {
  useSignals()
  const observer = useRef()
  const searchParams = useSearchParams()
  const {session} = useUser()
  const searchValue = searchParams.get('search') || ''
  const userId = searchParams.get('id')

  //GET
  const getPosts = async(page) => {
    try {
   const res = await data.value.get(`/api/profile/${userId}/posts?page=${page}&limit=${limit}&search=${searchValue}`)
   const postData = res
     return postData.data[0]
     }
     catch(err) {
      console.log(err)
  }
 }

const postsQuery = useInfiniteQuery ({
  queryKey: ['userPosts','infinite', {searchValue}],
  getNextPageParam: (prevData) => {
    return prevData.cursor + 1  || undefined
  },
  queryFn:({pageParam = 1}) => {
    return getPosts(pageParam)
  }
})

const observerCallback = useCallback(node => {
  if(observer.current) observer.current.disconnect()
  observer.current = new IntersectionObserver((entries) => {
  if(entries[0].isIntersecting) {
 postsQuery.fetchNextPage()  
  }
  })

 if(node) return observer.current.observe(node)
},[postsQuery.isLoading, postsQuery.hasNextPage])

const mappedPosts = postsQuery?.data?.pages.flatMap((item) => {
  return item.post.flatMap((post,index) => {
    return (
      <div key={post._id}>

      <div key={post._id} className="postCard"> <Card
      key={post._id}
      post={post}
      likeData={post.like}
      refValue={index === Number(limit - 1) ? observerCallback : null}
      />
             </div>
             
             </div>)
      }) 
    })

if(mappedPosts?.length === 0) {
  return (
    <div className="userPostInfo"> {`You've not made a post yet`}</div>
  )
}

return (
  <>
  {!postsQuery.isLoading && <div className="userPostInfo">
 Welcome, {session?.user?.name}, you can edit your posts and view their stats here.
  </div>}
 
  {postsQuery.isLoading ? <Loader /> :  <div className="user_posts">
    {mappedPosts} 
  </div> }
  {postsQuery.isFetchingNextPage ? <Loader/> : ''}
  </>
  )
}

export default Page