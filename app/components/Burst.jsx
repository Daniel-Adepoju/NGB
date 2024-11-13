 import React from 'react'
 
 const Burst = ({show, burstId}) => {
  console.log(burstId)
   return (
    <>
{show && <div className={`animation-container ${show && 'active'}`}>
<div className="burst">
    <div className="line"></div>
    <div className="line"></div>
    <div className="line"></div>
    <div className="line"></div>
    <div className="line"></div>
    <div className="line"></div>
    <div className="line"></div>
    <div className="line"></div>
</div>
</div>}
</>
   )
 }
 
 export default Burst