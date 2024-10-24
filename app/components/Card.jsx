'use client'
import { usePathname } from 'next/navigation';
import {useUser} from '../utils/user';

const Card = () => {
 const {session, update} = useUser()
 const pathName = usePathname()

  return (
    <div className="card-container">
        <section className="head">
               <div className="creator-pic">
         <img src="../cancel.svg" alt="author-pic"/>
        </div>
        <div>
           <span className="creator-name">
            Jarmaine Cole
        </span>
        <span className="date-created">
            Created 2 days ago</span>  
        </div>
       
        </section>
      <section className="body">
             <div className="post-picture">
         <img src='2.jpg' />
             </div>
     <div className="post-content">
     once upon a time in a galaxy far
     far away there was a
     boy named jermaine cole
     </div>
     <div className="post-btn">
        <img src="../liked.png"/>
        <img src="../comment.svg" />
     </div>
      </section>
   
        </div>
  )
}

export default Card