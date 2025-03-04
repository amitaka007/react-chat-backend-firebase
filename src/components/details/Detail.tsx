import React from 'react'
import { details } from '../../data/data'
import { auth } from '../../lib/firebase'

const Detail = () => {
 
  return (
    <div className='detail flex-1'>
      <div className='user px-5 py-4 flex flex-col items-center gap-5 border-b border-[#dddddd35]'>
        <img src='./avatar.png' alt='avatar' className='w-[70px]  object-cover h-[70px] rounded-[50%]' />
        <h2>John Doe</h2>
        <p>lorem ipusm dolar sit</p>
      </div>
      <div className='info p-5 flex flex-col gap-2   '>
        {details.map((detail, index) => ( 
          <div key={index} className="option">
            <div className="title flex items-center justify-between">
              <span>{detail.title}</span>
              <img
                src={detail.img}
                alt="arrow"
                className="w-[28px] h-[28px] p-2 rounded-[50%] cursor-pointer bg-[#11192880]"
              />
            </div>


            {/* Render sub-items (e.g., Shared Photos) */}
            {/* Check if subItems exist and are not empty */}
            {detail.subItems && detail.subItems.length > 0 && (
              <div className="photos flex flex-col gap-5 mt-5">
                {detail.subItems.map((photo, idx) => (
                  <div key={idx} className="photoItem flex items-center justify-between">
                    <div className="photoDetail flex items-center gap-5">
                      <img src={photo.img} alt="avatar" className="w-10 h-10 rounded-md object-cover" />
                      <span className="text-sm text-gray-400 font-light">{photo.name}</span>
                    </div>
                    <img
                      src="./download.png"
                      alt="download"
                      className="w-[28px] h-[28px] p-2 cursor-pointer bg-[#11192880] rounded-[50%]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <button className='px-5 py-[10px] text-white border-none rounded cursor-pointer bg-[#e64a698d] hover:bg-[#dc143cc2]'>Block User</button>
        <button className='px-5 py-[10px] text-white border-none rounded cursor-pointer bg-[#1a73e8] hover:bg-[#3d8ffb]' onClick={()=> auth.signOut()}>Logout  </button>
      </div>
    </div>
  )
}

export default Detail 