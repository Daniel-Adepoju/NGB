
import {useRef, useCallback} from 'react'


const useNextPageOserver = (queryName) => {
    const observer = useRef()

   return useCallback((node) => {
        if(observer.current) {
            observer.current.disconnect()
        }

        observer.current = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
          queryName.fetchNextPage()
          console.log(entries[0].target.textContent)
            }
            })
          
           if(node) return observer.current.observe(node)
          },[queryName.isLoading, queryName.hasNextPage])
        
}

export default useNextPageOserver