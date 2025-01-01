'use client'
import Card from './Card'
import { useSignals } from "@preact/signals-react/runtime"
import { signal } from "@preact/signals-react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams } from 'next/navigation'
import Loader from '../loading'
import {data} from '../utils/axiosUrl'
import Filter from '../components/Filter'
import useNextPageObserver from '../utils/useNextPageIntersection'


const CardList = () => {
 const searchParams = useSearchParams()
 const searchValue = searchParams.get('search') || ''
const limit = 5

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
    return prevData.cursor + 1  || undefined
  },
  queryFn:({pageParam = 1}) => {
      return getPosts(pageParam)
  }
 })
 const ref = useNextPageObserver(postsQuery)


   
  const mappedPosts = postsQuery?.data?.pages.flatMap((item) => {
    return item.posts.map((post,index) => {
      return (
        <div key={post._id} className="postCard"> <Card
        key={post._id}
        post={post}
        likeData={post.like}
        refValue={index === Number(limit - 1) ? 
          ref : null}
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
      {postsQuery.isLoading ? <Loader /> : 
      <div className="total-container">
              <Filter />
       <div className="card-list">
        {mappedPosts}
  
        {postsQuery.isFetchingNextPage ? <Loader/> : ''}
        </div>
        </div>
        }
      
      
        </>
      )
}

export default CardList