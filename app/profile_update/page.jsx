'use client'
import { useSearchParams } from "next/navigation"
import {useUser, useProviders} from '../utils/user'

const Page = () => {

 const paramsDetails = useSearchParams()
 const email = paramsDetails.get('email')
 const name = paramsDetails.get('name')
 const session = useUser()
 const providers = useProviders()
 
  return (
    <>
    <div>
        Welcome  {name}, you can edit your profile here
    </div>
    <div className="profile-container">
   <img src='icons8-user-100 (1).png'
   alt='profile_picture'/>
    </div>
    </>
  )
}

export default Page