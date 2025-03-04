import React from 'react'
import Detail from '../details/Detail'
import assests from '../../assets/assets';
import { auth } from '../../lib/firebase';


const RightSide = () => {
  return (
    <>
      <div className='detail'>
        {/* <Detail /> */}

        <div className="rs rounded-2xl">
          <div className="rs-profile">
            <img src={assests.profile_img} alt="profileimaage" />
            <h3>Richard ford
              <img src={assests.green_dot} alt="profileismaage" id='green' />
            </h3>
            <p>hey, i am richard  sansford  using chat app</p>
          </div>
          <hr />
          <div className="rs-media">
            <p>media</p>
            <div>
              <img src={assests.pic1} alt="profileimaage" />
              <img src={assests.pic2} alt="profileimaage" />
              <img src={assests.pic3} alt="profileimaage" /> 
              <img src={assests.pic4} alt="profileimaage" />
              <img src={assests.pic2} alt="profileimaage" />
              <img src={assests.pic1 } alt="profileimaage" />  
            </div>
          </div>
          <button  onClick={()=> auth.signOut()}>Logout</button>
        </div>
      </div>
    </>
  )
}

export default RightSide