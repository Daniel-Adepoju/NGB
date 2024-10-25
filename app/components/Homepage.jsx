'use client'

import { useSignals } from "@preact/signals-react/runtime";
import { signal, effect } from '@preact/signals-react'
import { redirect, useSearchParams } from 'next/navigation';
import Loading from '../loading';
import {useUser,useProviders} from '../utils/user';
import CardList from './CardList'

export default function HomePage() {
  useSignals()

  const searchParams = useSearchParams()
  const goToLogin = searchParams.get('redirect')
  const {session} = useUser()
  const providers = useProviders()


 if (goToLogin) {
  redirect('/login')
 }

 if (goToLogin) {
  return <Loading />
 }
   return (
    <div className="homepage">
  <CardList /> 
    </div>
  );
}
