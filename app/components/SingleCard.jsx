'use client'

import Card from './Card'
import Comment from './Comment'
const SingleCard = ({post}) => {
  return (
    <div className="singleCardContainer">
          <div className="singleCard">
  <Card post={post} />
  <Comment post={post} />
    </div>
    </div>

  )
}

export default SingleCard