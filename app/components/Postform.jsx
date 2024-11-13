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
    
    const handleTextArea = (e) => {
        if(e.target.value.trim().length > 300) {
         postDeets.content.value = e.target.value.substring(0,300)
    } else {
      postDeets.content.value = e.target.value
    }
}
    const handlePasteToTextArea = (e) => {

      const pastedText = e.clipboardData.getData('text')
      e.preventDefault()
      const newText = postDeets.content.value + pastedText  
      postDeets.content.value = newText.substring(0, 200)
    }

  return (
    <div className="create-portal">
      <div>
        
      </div>
   <header>
    {pathName === '/create-post' ? 'Create a post' : 'Edit your post'} 
   </header>
   <form  onSubmit={handleSubmit} className="postForm">
    {/* <label htmlFor="content"> Write your content</label> */}
      <textarea
      name="content"
      value={postDeets.content.value}
      onChange={handleTextArea}
      onPaste={handlePasteToTextArea}
      >
      </textarea>
     <span className="text-limit">
       {`${postDeets.content.value.trim().length}/300`}
       </span>
      <div className="btns">
        <button> Add Image </button>
      <button disabled={isSubmitting.value} type="submit">
        {pathName === '/create-post' && 
        `${!isSubmitting.value ? 'Create Post' : 'Creating Post'}`}
        </button>  
      </div>
    
   </form>
    </div>
  )
}

export default Postform