'use client'

import { useSignals } from "@preact/signals-react/runtime";
import { redirect, useSearchParams } from 'next/navigation';
import Loading from '../loading';
import CardList from './CardList'

export default function HomePage() {
  useSignals()

  const searchParams = useSearchParams()
  const goToLogin = searchParams.get('redirect')

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
