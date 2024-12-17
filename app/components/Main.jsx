'use client'
import {toggleMenu, isMenuOpen} from './Nav'
import { useSignals } from '@preact/signals-react/runtime'
const Main = ({children}) => {
    useSignals()
  return (
    <>
        {isMenuOpen.value && <div
        onClick={toggleMenu}
        className="cover"></div>
        }
        

    <section  className="main">
    {children}
 </section>
    </>

  )
}

export default Main