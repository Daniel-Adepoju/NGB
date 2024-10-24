'use client'
import { usePathname } from "next/navigation"
import { signal, effect} from "@preact/signals-react"
import { useSignals } from "@preact/signals-react/runtime";


export const postDeets = {
    creator: signal(''),
    content: signal(''),
    image: signal('')
  };
  export const isSubmitting  = signal(false)

const Postform = ({handleSubmit}) => {
    useSignals()
    const pathName = usePathname()

  return (
    <div className="create-portal">
   <h3>
    {pathName === '/create-post' ? 'Create a post' : 'Edit your post'} 
   </h3>
   <form  onSubmit={handleSubmit} className="postForm">
    {/* <label htmlFor="content"> Write your content</label> */}
      <textarea
      name="content"
      value={postDeets.content.value}
      onChange={(e) => postDeets.content.value = e.target.value}
      >
      </textarea>
      <button> Add Image </button>
      <button type="submit">Create Post</button>
   </form>
    </div>
  )
}

export default Postform