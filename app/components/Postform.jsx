'use client'
import { usePathname } from "next/navigation"
import { signal, effect} from "@preact/signals-react"
import { useSignals } from "@preact/signals-react/runtime";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import Loader from '../loading'
export const postDeets = {
    creator: signal(''),
    content: signal(''),
    image: signal('')
  };
  export const isSubmitting  = signal(false)
  const imgLoading = signal(true)
const Postform = ({handleSubmit,handleAddImage}) => {
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
    <>
   
    <div className="create-portal">
      <header>
    {pathName === '/create-post' ? 'Create a post' : 'Edit your post'} 
   </header>

   <div className="postform_con">
   
   <form className="postForm">
    
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
     
   </form>

   {postDeets.image.value &&  <div className="selected-pic">
      {imgLoading.value && <Loader />}
      <CldImage
                width="1500"
                height="650"
                alt="post_img"
                src={postDeets.image.value}
                loading='eager'
                onLoad={() => {imgLoading.value = false}}
                crop={{
                  type: "auto",
                  source: true,
                }} />
      <div className="cancelPic">
        <img src="../cancel.svg" alt="cancel"
        onClick={() => postDeets.image.value = ""}/>
      </div>
    </div> }
   </div>
  
    <div className="btns">
    <CldUploadWidget
                options={{ sources: ["local", "camera", "google_drive"] }}
                uploadPreset="ngb_cloudinary_app"
                onSuccess={(results) => {
            postDeets.image.value = results.info.public_id
                }}
              >
                {({ open }) => {
                  function handleAddImage() {
                 postDeets.image.value = ""
                    open()
                  }
                  return (
      <div onClick={handleAddImage}>
        <img src='../add_img.png' alt='add image' />
         <span> Add Image </span>
        </div>
        )}}
        </CldUploadWidget>
     
      <div  onClick={handleSubmit} disabled={isSubmitting.value} type="submit">
        <img src="../confirm.svg" alt="confirm" />
      <span>
 {pathName === '/create-post' && 
        `${!isSubmitting.value ? 'Create Post' : 'Creating Post'}`}
      </span>
      
        </div>  
      </div>
    </div>
    </>
  
  )
}

export default Postform