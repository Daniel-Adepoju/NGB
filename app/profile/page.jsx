'use client'
import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { useUser } from "../utils/user"
const page = () => {
    const { session } = useUser()


    if(session?.user) {
        return (
    <>
     <div className="profile">
        <div className="profile-header">
                 <div className="profile-picture">
<CldImage  
        width="300" 
        height="300"
        alt='imgh'
         src={session?.user?.profilePic}
        crop={{
          type: 'auto',
          source: true
        }} />
        </div>   
            <div className="deets">
             <div className="name">
            {session?.user?.name}
        </div>
        <div className="email">
            {session?.user?.email}
        </div>   
            </div>
        </div>

          <div className="profile-body">
        <Link href='#'>
        <div className="profile-posts">
          profile posts
          </div>   
        </Link>
        
          
            <Link href={`profile/profile_update/?id=${session?.user?.id}&name=${session?.user?.name}`}>
          <div className="edit">
           edit profile
            </div>
            </Link>
           
           
          </div>
      
      </div>
    </>
   
  )
}
else {
    return (
    <div className="loginFirst">
<span>
    <Link href='/login'>Login</Link> to access this page 
</span>
   
        </div>
    )
 
}
}

export default page