'use client'

import { useSignals } from "@preact/signals-react/runtime";
import { signal, effect } from '@preact/signals-react'
import { redirect, useSearchParams } from 'next/navigation';
import Loading from '../loading';
import {useUser,useProviders} from '../utils/user';

export default function Home() {
  useSignals()

  const searchParams = useSearchParams()
  const goToLogin = searchParams.get('redirect')
  const session = useUser()
  const providers = useProviders()


 if (goToLogin) {
  redirect('/login')
 }
//  console.log(session)

 if (session === null || !providers) {
  return <Loading />
 }
   return (
    <div>
  Welcome to NGB {providers ? session?.user?.name : 'no user'}
    </div>
  );
}
