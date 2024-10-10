
// import {v2 as cloudinary} from 'cloudinary';
import Page from './image/page'
import HomePage from './components/Homepage'
// cloudinary.config({
    
//   cloud_name:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// })

const Cloudinary = async () => {
   
//     const {resources} =  await cloudinary.api.resources()
   
  return (
    <HomePage/>
    
  )}

export default Cloudinary