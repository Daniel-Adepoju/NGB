// 'use client'
// import { CldImage, CldOgImage } from 'next-cloudinary';
// import { CldUploadWidget } from 'next-cloudinary';
// import { useEffect } from 'react';
// import Cloudinary from '../utils/cloudinary'
// import { signal } from '@preact/signals-react';
// import { useSignals } from '@preact/signals-react/runtime';



//  export default function Page({resources}) {
//   useSignals()

//   return (
//     <>

//       <CldImage
     
//       width="300" 
//       height="300"
//       alt='imgh'
//        src={currentImg.value || 'icons8-user-100 (1).png'}
//       crop={{
//         type: 'auto',
//         source: true
//       }}
//       />
      
//     <CldUploadWidget
//     // options={{sources: ['local', 'camera','drive']}}
//     uploadPreset="next_cloudinary_app"
//      onSuccess={(results) => {
//       currentImg.value = results.info.public_id;
//     }}
//     >
//   {({open}) => {
//      function handleOnClick() {
//       currentImg.value = undefined;
//       open()
//      }
//     return (
//       <button onClick={handleOnClick}>
//         Upload an Image
//       </button>
//     );
  
//   }}
//   </CldUploadWidget>
//     </>
  




//   );
// }