'use client'

import { signal, effect} from "@preact/signals-react"
import { useSignals } from "@preact/signals-react/runtime";
import { useRouter, usePathname, redirect } from "next/navigation";
import axios from 'axios';
import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";

const data = axios.create({
  baseURL: process.env.BASE_URL
})

export const userDeets = {
    username: signal(''),
    userPassword: signal(''),
    email: signal(''), 
  };

const handleInputChange = (e) => {
    userDeets[e.target.name].value = e.target.value
  };



const Form = () => {
    useSignals()
  const router = useRouter()
  const pathName = usePathname()


  const registerUser =  async(newUser) => {
    try {
      const response = await data.post('api/auth/register', newUser)
      if(!response.error) {
        router.push('/?redirect=login')
        router.refresh();
      }
      return response
    } catch (err) {
      console.error(err)
    }
  } 

  const registerMutation = useMutation({
    mutationKey: 'register',
    mutationFn: registerUser,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    let res;
   if (pathName === '/register') { 
      registerMutation.mutate({
      username: userDeets.username.v,
      userPassword: userDeets.userPassword.v,
      email: userDeets.email.v});
   } else {
    res = await signIn('credentials', {
          password: userDeets.userPassword.v,
          email: userDeets.email.v,
          redirect: false,   
      });
    }
    if (!res?.error) {
      router.push('/')
      router.refresh();
    }
   }

    return (
        <>
       <form className="user-form" onSubmit={handleSubmit}>
    {pathName === '/register' && 
    (
          <>
            <label  htmlFor='username' className="user-label"> Username </label>
      <input type="text" id="username" name="username" value={userDeets.username.value} onChange={handleInputChange} placeholder="username" />
        </>

      )}
     <label htmlFor="email" className="user-label"> Email </label>
      <input type="email" id="email" name="email" value={userDeets.email.value} onChange={handleInputChange} placeholder="email" />
     
      <label htmlFor="password" className="user-label">  </label>
      <input type="password" id="password" name="userPassword" value={userDeets.userPassword.value} onChange={handleInputChange} placeholder="password" />
       <button type='submit' className="user-btn">
        {pathName === '/register' ? 'Create Account' : 'Login'}
        </button>
    </form>
        </>

  )
}

export default Form