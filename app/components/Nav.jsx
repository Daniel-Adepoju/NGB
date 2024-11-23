'use client'
import Link from "next/link"

import { useSignals } from "@preact/signals-react/runtime";
import { signal, effect } from '@preact/signals-react'
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { CldImage, CldOgImage } from 'next-cloudinary';
import {useUser, useProviders } from '../utils/user'

const currentImg = signal('')

const Nav = () => {
    useSignals()
  const {session} = useUser()
  const providers = useProviders()
  
  return (
    <nav>
       <Link href='/' >
         <div className="logo"> NGB </div>
       </Link>
    <div className="toggle-menu">
      <span></span>
      <span></span>
      <span></span>
    </div>
  

        <ul>
          <span>
    <Link href={`/profile/profile_update/?id=${session?.user?.id}&name=${session?.user?.name}`}>
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



  {session?.user && <li>
    <Link href='/create-post'>Create Post</Link> </li>}


    <li className="logAndSign"> 
     {!session?.user ? <Link href="/login">Login</Link>
     : <span onClick = {(() => signOut())}> Sign Out </span>}
        </li>
     
     <li>Views</li>
        </ul>
        
    </nav>
  )
}

export default Nav