import { useSignals } from '@preact/signals-react/runtime'
import axios from 'axios'
import { signal } from '@preact/signals-react'

export const data = signal(axios.create({
    baseURL: process.env.BASE_URL
  }))

  export const comData = signal(axios.create({
    baseURL: process.env.BASE_URL
  }))
  
const AxiosUrl = () => {
    useSignals()
  return (
    <div></div>
  )
}

export default AxiosUrl