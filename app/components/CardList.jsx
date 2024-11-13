'use client'
import Card from './Card'
import { useSignals } from "@preact/signals-react/runtime"
import { signal } from "@preact/signals-react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams } from 'next/navigation'
import Loader from '../loading'
import { useCallback,useRef } from 'react'
import {data} from '../utils/axiosUrl'

const limit = signal(10)
const CardList = () => {
 const observer = useRef()
 const searchParams = useSearchParams()
 const searchValue = searchParams.get('search') || ''

 const getPosts = async(page) => {
    try {
  const res = await data.value.get(`/api/post?page=${page}&limit=${limit}&search=${searchValue}`)
  const postData = res
    return postData.data[0]
    }
    catch(err) {
 console.error(err)
    }

 }

 const postsQuery = useInfiniteQuery ({
  queryKey: ['posts','infinite', {searchValue}],
  getNextPageParam: (prevData) => {
    return prevData.cursor + 1 || undefined
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

  const mappedPosts = postsQuery?.data?.pages.flatMap((item,index) => {
    return item.posts.map((post,index) => {
        // console.log(post)
      return (
        <div key={post._id} className="postCard"> <Card
        key={post._id}
        post={post}
        likeData={post.like}
        refValue={index === 9 ? observerCallback : null}
        />
               </div>)
        }) 
      })
      
      if(postsQuery.isError) {
        return <div>NETWORK ERROR{JSON.stringify(postsQuery.error)}</div>
      }
      if(mappedPosts?.length === 0) {
        return (
          <div className="emptyDisplay"> Nothing to display</div>
        )
      }
     
  
      return (
        <>
     
       <div className="card-list">
        {postsQuery.isLoading ? <Loader /> : mappedPosts }
        </div>
    
        {postsQuery.isFetchingNextPage ? <Loader/> : ''}
    
        </>
      )
}

export default CardList