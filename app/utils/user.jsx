'use client'
import { createContext, useContext } from "react"
import {useSession, getProviders} from 'next-auth/react'
import { useState, useEffect } from 'react';


export const UserContext = createContext()
export const ProviderContext = createContext()
export const useUser = () => useContext(UserContext)
export const useProviders = () => useContext(ProviderContext)

const User = ({children}) => {

  const {data: session} = useSession()
  const [providers,setProviders] = useState(null)

  useEffect(() => {
    const grabProvider = async () => {
     const res = await getProviders()
     setProviders(res)
    }
    grabProvider()
   },[])
  

  return (
    <ProviderContext.Provider value={providers}>
      <UserContext.Provider value={session}>
           {children}
       </UserContext.Provider>
    </ProviderContext.Provider>
   
  )
}

export default User