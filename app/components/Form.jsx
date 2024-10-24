'use client'

import { signal, effect} from "@preact/signals-react"
import { useSignals } from "@preact/signals-react/runtime";
import { useRouter, usePathname, redirect } from "next/navigation";
import Link from "next/link";
import {data} from '../utils/axiosUrl'
import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";

export const formType = signal('')
export const isSubmitting  = signal(false)

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
      const response = await data.value.post('api/auth/register', newUser)
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
    onSuccess: () => {
      isSubmitting.value = false
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    isSubmitting.value = true
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
      isSubmitting.value = false
    }
    if (pathName === '/login' && !res?.error) {
      router.push('/')
      router.refresh();
    }
   }

    return (
        <>
        <div className="user-title">
          {pathName === '/register'? 'Create an NGB Account' :
          'Login to your NGB account'}
          </div>
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
     
      <label htmlFor="password" className="user-label"> Password </label>
      <input type="password" id="password" name="userPassword" value={userDeets.userPassword.value} onChange={handleInputChange} placeholder="password" />
       <button type='submit' className="user-btn" disabled={isSubmitting.value}>
        {formType}
        </button>
    </form>
     <div className="register-prompt">
      {pathName === '/register' ? 'Already have an account?, login'
      :`Don't have an account?, create one`} 
      <Link href={pathName === '/register' ? '/login' : '/register'}
      >here
      </Link>
      </div>
        </>

  )
}

export default Form