'use client'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CldImage } from "next-cloudinary"
import { signal, effect } from "@preact/signals-react"
import {data} from "../utils/axiosUrl"
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {useSignal,useSignals } from "@preact/signals-react/runtime"
import {useUser} from '../utils/user'
import Loading from '../loading'
import {comData} from '../utils/axiosUrl'
import useNextPageOserver from '../utils/useNextPageIntersection';
dayjs.extend(relativeTime)


const Comment = ({refVal, comment}) => {
    useSignals()
   
  return (
    <>
 <div key={comment._id}
  onClick={() => getCommentsQuery.fetchNextPage()}
  ref={refVal}
  className="comment">
  <div className="head">
  <div className='user-pic'>
  <CldImage
  width="40"
  height="40"
  alt="profile_img"
  src={comment.creator.profilePic}
  crop={{
    type: "auto",
    source: true,
  }}/>
  </div>
  <span>{comment.creator.username}</span>
  </div>
  <div className="body">
       <div className='comment-text'>
  <p>{comment.content}</p>
  <p>{dayjs(comment.commentDate).fromNow().toString()}</p>
  </div>
  </div>
  </div>
  
   </>
  )
}

export default Comment