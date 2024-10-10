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
  const session = useUser()
  const providers = useProviders()

  return (
    <nav>
        <div className="logo"> NGB </div>
        <ul>
        <Link href={`/profile_update/?id=${session?.user?.email}&name=${session?.user?.name}`}>
    <li>
        {session?.user &&  !session?.user?.image &&
    <img src="icons8-user-100 (1).png" alt="profile_img"/>
    }
       {session?.user && session?.user?.image &&
        <CldImage  
        width="300" 
        height="300"
        alt='imgh'
         src={currentImg.value}
        crop={{
          type: 'auto',
          source: true
        }} />
        }
       {!session?.user && ''}
    </li>
    </Link>
    
    
    <li>
     {!session?.user ? <Link href="/login">Login</Link>
     : <span onClick = {(() => signOut())}> Sign Out </span>}
        </li>
        </ul>
    </nav>
  )
}

export default Nav