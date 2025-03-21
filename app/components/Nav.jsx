'use client'
import Link from "next/link"

import { useSignals} from "@preact/signals-react/runtime";
import { signal} from '@preact/signals-react'
import { signOut } from 'next-auth/react';
import { CldImage} from 'next-cloudinary';
import {useUser} from '../utils/user'

 export const isMenuOpen = signal(false)

export const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
const falsifyMenu = () => {
 isMenuOpen.value = false
}


const Nav = () => {
    useSignals()
  const {session} = useUser()
 
  return (
    <nav>
       <Link href='/' >
         <div onClick={falsifyMenu} className="logo"> NGB </div>
       </Link>
    <div
    onClick={toggleMenu} 
    className={`toggle-menu ${isMenuOpen.value && 'active'}`}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  

        <ul  className={`${isMenuOpen.value && 'active'}`}>
          <span onClick={falsifyMenu}>
    <Link href={`/profile`}>
       {session?.user && session?.user?.profilePic &&
        <CldImage  
        width="300" 
        height="300"
        alt='imgh'
         src={session?.user?.profilePic}
        crop={{
          type: 'auto',
          source: true
        }} />
        }
       {!session?.user && ''}
    </Link>
    </span>



  {session?.user && <li onClick={falsifyMenu}>
    <Link href='/create-post'>Create Post</Link> </li>}


    <li onClick={falsifyMenu} className="logAndSign"> 
     {!session?.user ? <Link href="/login">Login</Link>
     : <span onClick = {(() => signOut())}> Sign Out </span>}
        </li>
     
        </ul>
        
    </nav>
  )
}

export default Nav